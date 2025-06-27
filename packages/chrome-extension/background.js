console.log("Flux Collector background script loaded.");

// 메시지 수신 리스너 설정
chrome.runtime.onMessage.addListener((request) => {
  // 메시지 타입이 'COLLECT_DATA'인지 확인합니다.
  if (request.type === 'COLLECT_DATA') {
    console.log("=== Flux Data Received in Background ===");
    console.log(request.payload);

    const dataToStore = request.payload;

    // 1. 스토리지에서 기존 데이터를 가져옵니다.
    chrome.storage.local.get({ fluxCollections: [] }, (result) => {
      // 2. 새 데이터를 배열에 추가합니다.
      const updatedCollections = [...result.fluxCollections, dataToStore];

      // 3. 업데이트된 배열을 다시 스토리지에 저장합니다.
      chrome.storage.local.set({ fluxCollections: updatedCollections }, () => {
        console.log("Flux: Data stored. Total items:", updatedCollections.length);
        // 응답을 보내는 코드를 제거했습니다. content.js가 더 이상 기다리지 않습니다.
      });
    });
  }
});
