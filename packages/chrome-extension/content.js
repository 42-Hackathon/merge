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

    // 클릭된 위치에서 가장 적절한 요소를 찾습니다 (이미지 우선)
    const targetElement = findBestElement(e.target);
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
  // 드래그된 요소에서 가장 적절한 요소를 찾습니다
  draggedElement = findBestElement(e.target);
  
  // 요소 타입별 데이터 추출
  const elementType = getElementType(draggedElement);
  dragData = extractElementData(draggedElement, elementType);
  
  // 드래그 데이터에 추가 정보 포함
  dragData = {
    ...dragData,
    drag_method: 'native_drag',
    original_element: {
      tag: e.target.tagName.toLowerCase(),
      id: e.target.id,
      className: e.target.className,
      text: e.target.textContent?.substring(0, 100)
    }
  };
  
  console.log("Flux: Drag started -", elementType, dragData);
  
  // 드래그 피드백 설정
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  
  // 이미지인 경우 드래그 이미지 설정
  if (elementType === 'image' && draggedElement.tagName === 'IMG') {
    const dragImage = new Image();
    dragImage.src = dragData.image_url;
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  }
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
 * 클릭된 요소에서 가장 적절한 타겟 요소를 찾습니다.
 * 우선순위: 이미지 > 비디오 > 링크 > 텍스트
 * @param {Element} clickedElement - 클릭된 요소
 * @returns {Element} 가장 적절한 타겟 요소
 */
function findBestElement(clickedElement) {
  // 1. 클릭된 요소가 이미지나 비디오라면 그대로 사용
  const tagName = clickedElement.tagName.toLowerCase();
  if (tagName === 'img') return clickedElement;
  if (tagName === 'video') return clickedElement;
  if (tagName === 'iframe' && isVideoFrame(clickedElement)) return clickedElement;
  
  // 2. 부모 요소를 거슬러 올라가며 미디어 요소 찾기
  let currentElement = clickedElement;
  let maxDepth = 5; // 최대 5단계까지만 올라감
  
  while (currentElement && currentElement.parentElement && maxDepth > 0) {
    const parent = currentElement.parentElement;
    
    // 부모에서 이미지 찾기 (lazy loading 고려)
    const img = parent.querySelector('img[src], img[data-src], img[data-lazy]');
    if (img) {
      // 실제 src 확인
      const actualSrc = img.src || img.dataset.src || img.dataset.lazy;
      if (actualSrc) return img;
    }
    
    // 부모에서 비디오 찾기
    const video = parent.querySelector('video');
    if (video) return video;
    
    // YouTube 썸네일 특별 처리
    if (window.location.hostname.includes('youtube.com')) {
      const thumbnail = parent.querySelector('img[src*="ytimg.com"]');
      if (thumbnail) return thumbnail;
    }
    
    currentElement = parent;
    maxDepth--;
  }
  
  // 3. YouTube 비디오 플레이어 특별 처리
  if (window.location.hostname.includes('youtube.com')) {
    // 비디오 플레이어 영역인지 확인
    const videoPlayer = clickedElement.closest('#movie_player, .html5-video-player, ytd-player');
    if (videoPlayer) {
      // 실제 video 요소 찾기
      const actualVideo = videoPlayer.querySelector('video');
      if (actualVideo) return actualVideo;
      
      // video 요소가 없어도 플레이어 영역이면 가상 요소 반환
      return createVirtualVideoElement();
    }
    
    // 썸네일 영역 확인
    const thumbnailContainer = clickedElement.closest('ytd-thumbnail, a[href*="/watch?v="]');
    if (thumbnailContainer) {
      const thumbnail = thumbnailContainer.querySelector('img');
      if (thumbnail) return thumbnail;
    }
  }
  
  // 4. 근처 영역에서 미디어 요소 찾기
  const nearbyArea = clickedElement.closest('article, section, div[class*="card"], div[class*="item"]');
  if (nearbyArea) {
    // 우선순위: 이미지 > 비디오
    const nearbyImg = nearbyArea.querySelector('img[src], img[data-src]');
    if (nearbyImg) return nearbyImg;
    
    const nearbyVideo = nearbyArea.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
    if (nearbyVideo) return nearbyVideo;
  }
  
  // 5. 링크 요소 확인
  const linkElement = clickedElement.closest('a[href]');
  if (linkElement) return linkElement;
  
  // 6. 이미지나 비디오가 없으면 원래 요소 반환
  return clickedElement;
}

/**
 * YouTube 가상 비디오 요소 생성
 * @returns {Object} 가상 비디오 요소
 */
function createVirtualVideoElement() {
  return {
    tagName: 'VIDEO',
    src: window.location.href,
    dataset: {
      platform: 'youtube',
      videoId: getYouTubeVideoId(window.location.href)
    }
  };
}

/**
 * YouTube URL에서 비디오 ID 추출
 * @param {string} url - YouTube URL
 * @returns {string|null} 비디오 ID
 */
function getYouTubeVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

/**
 * 요소의 타입을 판별합니다.
 * @param {Element} element - 대상 요소
 * @returns {string} 요소 타입
 */
function getElementType(element) {
  // tagName이 문자열인 경우(가상 요소) 처리
  const tagName = typeof element.tagName === 'string' ? 
    element.tagName.toLowerCase() : 
    element.tagName;
  
  if (tagName === 'img') return 'image';
  if (tagName === 'video') return 'video';
  if (tagName === 'iframe' && isVideoFrame(element)) return 'video';
  if (tagName === 'a') return 'link';
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
      // 실제 이미지 URL 추출 (lazy loading 고려)
      const imgSrc = element.src || element.dataset.src || element.dataset.lazy || element.dataset.original;
      
      // 상위 요소에서 추가 정보 추출
      const container = element.closest('figure, article, div[class*="card"]');
      let caption = '';
      if (container) {
        const captionEl = container.querySelector('figcaption, [class*="caption"], [class*="title"]');
        caption = captionEl ? captionEl.textContent.trim() : '';
      }
      
      return {
        ...baseData,
        image_url: imgSrc,
        alt_text: element.alt || caption || '',
        width: element.naturalWidth || element.width || parseInt(element.getAttribute('width')) || 0,
        height: element.naturalHeight || element.height || parseInt(element.getAttribute('height')) || 0,
        title: element.title || caption || '',
        // 추가 메타데이터
        srcset: element.srcset || '',
        loading: element.loading || 'auto',
        decode: element.decoding || 'auto',
        caption: caption
      };
      
    case 'link':
      // 링크의 미리보기 정보 추출
      const linkMeta = extractLinkMetadata(element);
      
      return {
        ...baseData,
        link_url: element.href,
        link_text: element.textContent.trim(),
        title: element.title || linkMeta.title || '',
        domain: new URL(element.href).hostname,
        // 추가 메타데이터
        description: linkMeta.description,
        image: linkMeta.image,
        favicon: linkMeta.favicon,
        type: linkMeta.type
      };
      
    case 'video':
      // 비디오 플랫폼별 처리
      const videoData = extractVideoMetadata(element);
      
      return {
        ...baseData,
        video_url: element.src || videoData.url,
        title: element.title || videoData.title || getVideoTitle() || document.title,
        duration: element.duration || videoData.duration || 0,
        poster: element.poster || videoData.thumbnail || '',
        platform: videoData.platform || getVideoPlatform(element),
        video_id: videoData.id || getVideoId(element),
        thumbnail: videoData.thumbnail || getVideoThumbnail(element),
        // 추가 메타데이터
        channel: videoData.channel,
        views: videoData.views,
        uploaded: videoData.uploaded,
        description: videoData.description
      };
      
    case 'text':
      // 텍스트 컨텍스트 추출
      const textContext = extractTextContext(element);
      
      return {
        ...baseData,
        text: element.textContent.trim(),
        html: element.outerHTML,
        // 추가 메타데이터
        headings: textContext.headings,
        links: textContext.links,
        images: textContext.images,
        parentTag: element.tagName.toLowerCase(),
        className: element.className
      };
      
    default:
      return {
        ...baseData,
        content: element.textContent.trim(),
        html: element.outerHTML,
        tagName: element.tagName.toLowerCase()
      };
  }
}

/**
 * 링크의 미리보기 메타데이터 추출
 * @param {Element} linkElement - 링크 요소
 * @returns {Object} 링크 메타데이터
 */
function extractLinkMetadata(linkElement) {
  const metadata = {
    title: '',
    description: '',
    image: '',
    favicon: '',
    type: 'website'
  };
  
  // 링크 내부의 정보 추출
  const titleEl = linkElement.querySelector('[class*="title"], h1, h2, h3');
  if (titleEl) metadata.title = titleEl.textContent.trim();
  
  const descEl = linkElement.querySelector('[class*="desc"], [class*="summary"], p');
  if (descEl) metadata.description = descEl.textContent.trim();
  
  const imgEl = linkElement.querySelector('img');
  if (imgEl) metadata.image = imgEl.src || imgEl.dataset.src;
  
  // 파비콘 추출
  try {
    const url = new URL(linkElement.href);
    metadata.favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
  } catch (e) {}
  
  return metadata;
}

/**
 * 비디오 메타데이터 추출
 * @param {Element} element - 비디오 요소
 * @returns {Object} 비디오 메타데이터
 */
function extractVideoMetadata(element) {
  const metadata = {
    url: '',
    title: '',
    duration: 0,
    thumbnail: '',
    platform: '',
    id: '',
    channel: '',
    views: '',
    uploaded: '',
    description: ''
  };
  
  // YouTube 특별 처리
  if (window.location.hostname.includes('youtube.com')) {
    metadata.platform = 'YouTube';
    metadata.id = getYouTubeVideoId(window.location.href);
    metadata.url = window.location.href;
    
    // 제목 - 여러 셀렉터 시도
    const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                   document.querySelector('h1.style-scope.ytd-watch-metadata') ||
                   document.querySelector('#above-the-fold h1') ||
                   document.querySelector('h1[data-title]') ||
                   document.querySelector('.ytd-watch-metadata h1') ||
                   document.querySelector('h1.ytd-video-primary-info-renderer') ||
                   document.querySelector('#video-title') ||
                   document.querySelector('h1.title') ||
                   document.querySelector('meta[name="title"]');
    
    if (titleEl) {
      metadata.title = titleEl.textContent?.trim() || titleEl.getAttribute('content');
    }
    
    // 대체 방법: meta 태그에서 제목 가져오기
    if (!metadata.title) {
      const metaTitle = document.querySelector('meta[property="og:title"]') ||
                       document.querySelector('meta[name="twitter:title"]');
      if (metaTitle) metadata.title = metaTitle.getAttribute('content');
    }
    
    // 채널명 - 여러 셀렉터 시도
    const channelEl = document.querySelector('ytd-channel-name yt-formatted-string') ||
                     document.querySelector('.ytd-channel-name a') ||
                     document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string') ||
                     document.querySelector('#upload-info #channel-name') ||
                     document.querySelector('#owner #channel-name');
    if (channelEl) metadata.channel = channelEl.textContent.trim();
    
    // 조회수
    const viewsEl = document.querySelector('.ytd-watch-info-text span') ||
                   document.querySelector('span.view-count') ||
                   document.querySelector('meta[itemprop="interactionCount"]');
    if (viewsEl) {
      metadata.views = viewsEl.textContent?.trim() || viewsEl.getAttribute('content');
    }
    
    // 썸네일 - 고화질 우선
    if (metadata.id) {
      metadata.thumbnail = `https://img.youtube.com/vi/${metadata.id}/maxresdefault.jpg`;
    }
    
    // 설명
    const descEl = document.querySelector('#description yt-formatted-string') ||
                  document.querySelector('#description-inline-expander') ||
                  document.querySelector('meta[property="og:description"]');
    if (descEl) {
      metadata.description = (descEl.textContent?.trim() || descEl.getAttribute('content'))?.substring(0, 200);
    }
  }
  
  // Vimeo 처리
  else if (window.location.hostname.includes('vimeo.com')) {
    metadata.platform = 'Vimeo';
    const match = window.location.pathname.match(/\/(\d+)/);
    if (match) metadata.id = match[1];
  }
  
  // 기본 video 요소 정보
  if (element.tagName === 'VIDEO' || element.tagName === 'video') {
    metadata.url = element.src || element.querySelector('source')?.src || window.location.href;
    metadata.duration = element.duration || 0;
    metadata.thumbnail = element.poster || metadata.thumbnail;
  }
  
  // 가상 요소 처리
  if (element.dataset && element.dataset.platform === 'youtube') {
    metadata.platform = 'YouTube';
    metadata.id = element.dataset.videoId;
    metadata.url = element.src || window.location.href;
  }
  
  return metadata;
}

/**
 * 텍스트 컨텍스트 추출
 * @param {Element} element - 텍스트 요소
 * @returns {Object} 텍스트 컨텍스트
 */
function extractTextContext(element) {
  const context = {
    headings: [],
    links: [],
    images: []
  };
  
  // 제목 추출
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  context.headings = Array.from(headings).map(h => ({
    level: h.tagName.toLowerCase(),
    text: h.textContent.trim()
  }));
  
  // 링크 추출
  const links = element.querySelectorAll('a[href]');
  context.links = Array.from(links).slice(0, 5).map(a => ({
    text: a.textContent.trim(),
    url: a.href
  }));
  
  // 이미지 추출
  const images = element.querySelectorAll('img');
  context.images = Array.from(images).slice(0, 3).map(img => ({
    src: img.src || img.dataset.src,
    alt: img.alt
  }));
  
  return context;
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

  // CSS 애니메이션 종료 후 제거
  feedback.addEventListener('animationend', () => {
    feedback.remove();
  });
}

// === 동영상 플랫폼별 메타데이터 추출 ===

/**
 * 동영상 제목을 플랫폼별로 추출합니다.
 * @returns {string|null} 동영상 제목
 */
function getVideoTitle() {
  // YouTube - 업데이트된 셀렉터들
  if (window.location.hostname.includes('youtube.com')) {
    const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                        document.querySelector('h1[data-title]') ||
                        document.querySelector('.ytd-watch-metadata h1') ||
                        document.querySelector('h1.ytd-video-primary-info-renderer') ||
                        document.querySelector('#video-title') ||
                        document.querySelector('h1.title');
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
  
  // YouTube 썸네일 - 여러 크기 옵션 시도
  if (window.location.hostname.includes('youtube.com')) {
    const videoId = getVideoId(element);
    if (videoId) {
      // maxresdefault가 없을 경우를 대비해 여러 옵션 제공
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    
    // DOM에서 썸네일 찾기 (새로운 방법)
    const thumbnailElement = document.querySelector('meta[property="og:image"]') ||
                            document.querySelector('link[itemprop="thumbnailUrl"]') ||
                            document.querySelector('.ytp-videowall-still-image') ||
                            document.querySelector('#movie_player .ytp-cued-thumbnail-overlay-image');
    if (thumbnailElement) {
      return thumbnailElement.getAttribute('content') || thumbnailElement.getAttribute('href') || thumbnailElement.src;
    }
  }
  
  // Vimeo 썸네일 (DOM에서 찾기)
  if (window.location.hostname.includes('vimeo.com')) {
    const thumbnail = document.querySelector('meta[property="og:image"]');
    if (thumbnail) return thumbnail.getAttribute('content');
  }
  
  return null;
}
