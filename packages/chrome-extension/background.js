console.log("Flux Collector background script loaded.");

// HTTP 통신 설정
const ELECTRON_APP_URL = 'http://localhost:3737';
let isConnected = false;

/**
 * Electron 앱 연결 상태를 확인합니다.
 */
async function checkElectronConnection() {
  try {
    const response = await fetch(`${ELECTRON_APP_URL}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const status = await response.json();
      isConnected = true;
      console.log('✅ Electron app connected:', status);
      return true;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    isConnected = false;
    console.warn('❌ Electron app not available:', error.message);
    return false;
  }
}

/**
 * Electron 앱으로 데이터를 전송합니다.
 * @param {Object} data - 전송할 데이터
 * @param {string} source - 데이터 소스 ('click' 또는 'drag')
 */
async function sendToElectronApp(data, source) {
  try {
    const response = await fetch(`${ELECTRON_APP_URL}/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'FLUX_DATA',
        source: source,
        data: data,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Sent ${source} data to Electron app:`, result);
      return true;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Failed to send to Electron app:', error);
    return false;
  }
}

// 주기적으로 연결 상태 확인 (5초마다)
setInterval(checkElectronConnection, 5000);

// 초기 연결 확인
checkElectronConnection();

// 메시지 수신 리스너 설정
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Alt+클릭 데이터 처리
  if (request.type === 'COLLECT_DATA') {
    console.log("=== Flux Click Data Received ===");
    console.log(request.payload);
    storeData(request.payload, 'click').then((success) => {
      sendResponse({ success });
    });
    return true; // 비동기 응답을 위해 true 반환
  }
  
  // 드래그 앤 드롭 데이터 처리
  if (request.type === 'COLLECT_DRAG_DATA') {
    console.log("=== Flux Drag Data Received ===");
    console.log(`Type: ${request.payload.type}`);
    console.log(request.payload);
    storeData(request.payload, 'drag').then((success) => {
      sendResponse({ success });
    });
    return true; // 비동기 응답을 위해 true 반환
  }
});

/**
 * 데이터를 Chrome Storage에 저장하고 Electron 앱으로 전송합니다.
 * @param {Object} data - 저장할 데이터
 * @param {string} source - 데이터 수집 방식 ('click' 또는 'drag')
 */
async function storeData(data, source) {
  // 수집 방식 정보 추가
  const dataToStore = {
    ...data,
    collection_method: source,
    id: Date.now() + Math.random() // 고유 ID 생성
  };

  try {
    // 1. 스토리지에서 기존 데이터를 가져옵니다.
    const result = await chrome.storage.local.get({ fluxCollections: [] });
    
    // 2. 새 데이터를 배열에 추가합니다.
    const updatedCollections = [...result.fluxCollections, dataToStore];

    // 3. 업데이트된 배열을 다시 스토리지에 저장합니다.
    await chrome.storage.local.set({ fluxCollections: updatedCollections });
    
    console.log(`Flux: ${source} data stored. Total items:`, updatedCollections.length);
    
    // 데이터 요약 로깅
    if (data.type) {
      console.log(`✓ Collected ${data.type} from ${new URL(data.source_url).hostname}`);
    }
    
    // Electron 앱으로 데이터 전송 (연결된 경우에만)
    if (isConnected) {
      await sendToElectronApp(dataToStore, source);
    } else {
      console.log('💾 Data stored locally (Electron app not connected)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to store data:', error);
    return false;
  }
}
