console.log("Flux Collector content script loaded.");

// --- 이벤트 리스너 설정 ---
document.addEventListener('mousedown', handleMouseDown, true);

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

    // 3. 백그라운드로 데이터를 보내기만 하고 응답은 기다리지 않습니다. (Fire and Forget)
    try {
      chrome.runtime.sendMessage({
        type: 'COLLECT_DATA',
        payload: collectedData
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
