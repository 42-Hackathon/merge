console.log("Flux Collector content script loaded.");

// --- 이벤트 리스너 설정 ---
document.addEventListener('mousedown', handleMouseDown, true);

// --- 드래그 앤 드롭 이벤트 리스너 ---
document.addEventListener('dragstart', handleDragStart, true);
document.addEventListener('dragover', handleDragOver, true);
document.addEventListener('drop', handleDrop, true);

// 드래그 상태 추적
let draggedElement = null;
let dragData = null;

/**
 * 마우스 다운 이벤트를 처리하여 'Alt + 좌클릭'을 감지합니다.
 * @param {MouseEvent} e - 마우스 이벤트 객체
 */
function handleMouseDown(e) {
  // e.button === 0은 마우스 좌클릭을 의미합니다.
  // e.altKey는 Alt 키가 눌렸는지 확인합니다.
  if (e.button === 0 && e.altKey) {
    // 1. 이벤트 전파를 즉시, 그리고 완전히 중단시켜 다른 스크립트(예: 유튜브 플레이어)의 동작을 막습니다.
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // 2. 사용자에게 즉시 피드백을 보여줍니다. (낙관적 UI)
    showFeedback(e.clientX, e.clientY);

    // 클릭된 위치의 가장 상위 요소를 가져옵니다.
    const targetElement = e.target;
    if (!targetElement) return;

    // 수집된 정보를 객체로 만듭니다.
    const collectedData = {
      text: getSelectedText() || targetElement.innerText,
      target_html: targetElement.outerHTML,
      source_url: window.location.href,
      page_title: document.title,
      favIconUrl: getFaviconUrl(),
      timestamp: new Date().toISOString()
    };
    
    // 디버깅을 위해 수집된 데이터를 콘솔에 출력합니다.
    console.log("Flux Data Collected (in content.js):", collectedData);

    // Chrome API 사용 가능한지 체크
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error("Flux Error: Chrome extension API not available. Please RELOAD the page (F5) to continue collecting data.");
      return;
    }

    // 3. 백그라운드로 데이터를 보내기만 하고 응답은 기다리지 않습니다. (Fire and Forget)
    try {
      chrome.runtime.sendMessage({
        type: 'COLLECT_DATA',
        payload: collectedData
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Flux Error: Failed to send message:", chrome.runtime.lastError.message);
          if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
            console.error("The extension has been updated. Please RELOAD the page (F5) to continue collecting data.");
          }
        } else if (response && response.success) {
          console.log("✅ Click data sent successfully");
        }
      });
    } catch (e) {
      if (e.message.includes('Extension context invalidated')) {
        console.error("Flux Error: The extension has been updated. Please RELOAD the page (F5) to continue collecting data.");
      } else {
        console.error("Flux Error: An unexpected error occurred while sending data.", e);
      }
    }
  }
}

// Alt 키와 함께 발생하는 클릭 이벤트를 완전히 차단하는 추가 리스너 (이중 방어벽 역할)
document.addEventListener('click', (e) => {
  if (e.altKey) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}, true); // 캡처 단계에서 실행하여 다른 리스너보다 먼저 동작하도록 설정

/**
 * 현재 선택된 텍스트를 가져옵니다.
 * @returns {string} 선택된 텍스트
 */
function getSelectedText() {
  return window.getSelection().toString().trim();
}

/**
 * 페이지의 파비콘 URL을 가져옵니다.
 * @returns {string | null} 파비콘 URL 또는 찾지 못한 경우 null
 */
function getFaviconUrl() {
  let faviconUrl = null;
  
  // 1. rel="icon" 링크 찾기
  const iconLink = document.querySelector("link[rel~='icon']");
  if (iconLink) {
    faviconUrl = iconLink.href;
  }

  // 2. 만약 찾지 못했다면, 구글의 기본 파비콘 서비스를 이용
  if (!faviconUrl) {
    // URL을 생성하여 절대 경로로 만듭니다.
    try {
      const pageUrl = new URL(window.location.href);
      faviconUrl = `https://www.google.com/s2/favicons?domain=${pageUrl.hostname}&sz=32`;
    } catch (e) {
      console.error("Flux: Invalid page URL for favicon fallback.", e);
      return null;
    }
  }

  // 상대 경로일 경우 절대 경로로 변환
  if (faviconUrl && !faviconUrl.startsWith('http')) {
     try {
       faviconUrl = new URL(faviconUrl, window.location.href).href;
     } catch (e) {
       console.error("Flux: Could not construct absolute favicon URL.", e);
       return null;
     }
  }
  
  return faviconUrl;
}

/**
 * 사용자에게 시각적 피드백을 보여줍니다.
 * @param {number} x - 클릭된 x 좌표
 * @param {number} y - 클릭된 y 좌표
 */
function showFeedback(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'flux-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  document.body.appendChild(ripple);

  // 애니메이션이 끝나면 요소를 제거합니다.
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

// === 드래그 앤 드롭 기능 ===

/**
 * 드래그 시작 시 요소 정보를 수집합니다.
 * @param {DragEvent} e - 드래그 이벤트 객체
 */
function handleDragStart(e) {
  draggedElement = e.target;
  
  // 요소 타입별 데이터 추출
  const elementType = getElementType(draggedElement);
  dragData = extractElementData(draggedElement, elementType);
  
  console.log("Flux: Drag started -", elementType, dragData);
  
  // 드래그 피드백 설정
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
}

/**
 * 드래그 오버 이벤트를 처리합니다.
 * @param {DragEvent} e - 드래그 이벤트 객체
 */
function handleDragOver(e) {
  // 드롭을 허용하려면 preventDefault() 호출 필요
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}

/**
 * 드롭 이벤트를 처리합니다.
 * @param {DragEvent} e - 드롭 이벤트 객체
 */
function handleDrop(e) {
  e.preventDefault();
  
  // 데스크톱 앱 영역으로 드롭된 경우에만 수집
  if (isDropOnApp()) {
    collectDraggedData();
    showDragFeedback(e.clientX, e.clientY);
  }
  
  // 상태 초기화
  draggedElement = null;
  dragData = null;
}

/**
 * 요소의 타입을 판별합니다.
 * @param {Element} element - 대상 요소
 * @returns {string} 요소 타입
 */
function getElementType(element) {
  const tagName = element.tagName.toLowerCase();
  
  if (tagName === 'img') return 'image';
  if (tagName === 'a') return 'link';
  if (tagName === 'video') return 'video';
  if (tagName === 'iframe' && isVideoFrame(element)) return 'video';
  if (element.textContent && element.textContent.trim()) return 'text';
  
  return 'unknown';
}

/**
 * iframe이 동영상인지 확인합니다.
 * @param {Element} element - iframe 요소
 * @returns {boolean} 동영상 여부
 */
function isVideoFrame(element) {
  const src = element.src || '';
  return src.includes('youtube.com') || src.includes('vimeo.com') || 
         src.includes('dailymotion.com') || src.includes('twitch.tv');
}

/**
 * 요소 타입별 메타데이터를 추출합니다.
 * @param {Element} element - 대상 요소
 * @param {string} type - 요소 타입
 * @returns {Object} 추출된 데이터
 */
function extractElementData(element, type) {
  const baseData = {
    type: type,
    source_url: window.location.href,
    page_title: document.title,
    favIconUrl: getFaviconUrl(),
    timestamp: new Date().toISOString()
  };

  switch (type) {
    case 'image':
      return {
        ...baseData,
        image_url: element.src || element.dataset.src,
        alt_text: element.alt || '',
        width: element.naturalWidth || element.width,
        height: element.naturalHeight || element.height,
        title: element.title || ''
      };
      
    case 'link':
      return {
        ...baseData,
        link_url: element.href,
        link_text: element.textContent.trim(),
        title: element.title || '',
        domain: new URL(element.href).hostname
      };
      
    case 'video':
      return {
        ...baseData,
        video_url: element.src || element.querySelector('source')?.src,
        title: element.title || getVideoTitle() || document.title,
        duration: element.duration || 0,
        poster: element.poster || '',
        platform: getVideoPlatform(element),
        video_id: getVideoId(element),
        thumbnail: getVideoThumbnail(element)
      };
      
    case 'text':
      return {
        ...baseData,
        text: element.textContent.trim(),
        html: element.outerHTML
      };
      
    default:
      return {
        ...baseData,
        content: element.textContent.trim(),
        html: element.outerHTML
      };
  }
}

/**
 * 데스크톱 앱 영역에 드롭되었는지 확인합니다.
 * @returns {boolean} 앱 영역 드롭 여부
 */
function isDropOnApp() {
  // 현재는 모든 드롭을 허용 (추후 앱 연동 시 특정 영역으로 제한)
  return true;
}

/**
 * 드래그된 데이터를 수집합니다.
 */
function collectDraggedData() {
  if (!dragData) return;
  
  console.log("Flux Data Collected (drag):", dragData);
  
  // Chrome API 사용 가능한지 체크
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    console.error("Flux Error: Chrome extension API not available. Please RELOAD the page (F5) to continue collecting data.");
    return;
  }
  
  // 백그라운드로 데이터 전송
  try {
    chrome.runtime.sendMessage({
      type: 'COLLECT_DRAG_DATA',
      payload: dragData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Flux Error: Failed to send message:", chrome.runtime.lastError.message);
        if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
          console.error("The extension has been updated. Please RELOAD the page (F5) to continue collecting data.");
        }
      } else if (response && response.success) {
        console.log("✅ Drag data sent successfully");
      }
    });
  } catch (e) {
    if (e.message.includes('Extension context invalidated')) {
      console.error("Flux Error: The extension has been updated. Please RELOAD the page (F5) to continue collecting data.");
    } else {
      console.error("Flux Error: An unexpected error occurred while sending drag data.", e);
    }
  }
}

/**
 * 드래그 수집에 대한 시각적 피드백을 보여줍니다.
 * @param {number} x - 드롭된 x 좌표
 * @param {number} y - 드롭된 y 좌표
 */
function showDragFeedback(x, y) {
  const feedback = document.createElement('div');
  feedback.className = 'flux-drag-success';
  feedback.style.left = `${x}px`;
  feedback.style.top = `${y}px`;
  feedback.textContent = '✓ Collected!';

  document.body.appendChild(feedback);

  // 2초 후 제거
  setTimeout(() => {
    feedback.remove();
  }, 2000);
}

// === 동영상 플랫폼별 메타데이터 추출 ===

/**
 * 동영상 제목을 플랫폼별로 추출합니다.
 * @returns {string|null} 동영상 제목
 */
function getVideoTitle() {
  // YouTube
  if (window.location.hostname.includes('youtube.com')) {
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer') ||
                        document.querySelector('h1.title') ||
                        document.querySelector('#video-title');
    if (titleElement) return titleElement.textContent.trim();
  }
  
  // Vimeo
  if (window.location.hostname.includes('vimeo.com')) {
    const titleElement = document.querySelector('h1[data-name="title"]') ||
                        document.querySelector('.video-title');
    if (titleElement) return titleElement.textContent.trim();
  }
  
  return null;
}

/**
 * 동영상 플랫폼을 판별합니다.
 * @param {Element} element - 동영상 요소
 * @returns {string} 플랫폼 이름
 */
function getVideoPlatform(element) {
  const hostname = window.location.hostname;
  const src = element.src || '';
  
  if (hostname.includes('youtube.com') || src.includes('youtube.com')) return 'YouTube';
  if (hostname.includes('vimeo.com') || src.includes('vimeo.com')) return 'Vimeo';
  if (hostname.includes('dailymotion.com') || src.includes('dailymotion.com')) return 'Dailymotion';
  if (hostname.includes('twitch.tv') || src.includes('twitch.tv')) return 'Twitch';
  
  return 'Unknown';
}

/**
 * 동영상 ID를 추출합니다.
 * @param {Element} element - 동영상 요소
 * @returns {string|null} 동영상 ID
 */
function getVideoId(element) {
  const url = element.src || window.location.href;
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }
  
  return null;
}

/**
 * 동영상 썸네일 URL을 추출합니다.
 * @param {Element} element - 동영상 요소
 * @returns {string|null} 썸네일 URL
 */
function getVideoThumbnail(element) {
  // 기본 poster 속성
  if (element.poster) return element.poster;
  
  // YouTube 썸네일
  if (window.location.hostname.includes('youtube.com')) {
    const videoId = getVideoId(element);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // Vimeo 썸네일 (DOM에서 찾기)
  if (window.location.hostname.includes('vimeo.com')) {
    const thumbnail = document.querySelector('meta[property="og:image"]');
    if (thumbnail) return thumbnail.getAttribute('content');
  }
  
  return null;
}
