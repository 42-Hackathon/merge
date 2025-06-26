import { useState, useCallback, useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";

// 사이드바의 크기 관련 상수를 정의
const SIDEBAR_DEFAULT_WIDTH = 280;
const SIDEBAR_MIN_WIDTH = 240;
const SIDEBAR_MAX_WIDTH = 500;
const SIDEBAR_COLLAPSED_WIDTH = 70; // 아이콘만 보이는 좁은 상태의 기준 너비

// 사이드바의 리사이즈 로직을 관리하는 커스텀 훅
export function useSidebarResize() {
  // 사이드바의 너비를 저장하고 애니메이션을 적용하기 위한 MotionValue.
  const sidebarWidth = useMotionValue(SIDEBAR_DEFAULT_WIDTH);
  
  // 현재 사용자가 리사이즈 중인지 여부를 추적하는 상태
  const [isResizing, setIsResizing] = useState(false);

  // 리사이즈 핸들러를 마우스로 클릭했을 때 호출되는 함수
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 브라우저 동작(예: 텍스트 선택)을 막음
    setIsResizing(true); // 리사이즈 시작 상태로 변경
  };

  // 마우스를 움직일 때 사이드바 너비를 업데이트하는 함수
  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;

      // 너비가 최소/최대 범위 안에 있을 때만 값을 업데이트
      if (newWidth >= SIDEBAR_MIN_WIDTH && newWidth <= SIDEBAR_MAX_WIDTH) {
        sidebarWidth.set(newWidth);
      }
    }
  }, [isResizing, sidebarWidth]);

  // 마우스 버튼에서 손을 뗐을 때 리사이즈를 종료하는 함수
  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // isResizing 상태에 따라 마우스 이벤트 리스너를 추가하거나 제거하는 Effect
  useEffect(() => {
    if (isResizing) {
      // 리사이즈가 시작되면 'mousemove'과 'mouseup' 이벤트를 window에 등록
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
    } else {
      // 리사이즈가 끝나면 이벤트 리스너를 제거
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    }
    
    // 컴포넌트가 언마운트될 때 메모리 누수를 방지하기 위해 리스너를 정리
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  // 사이드바 너비를 기본값으로 되돌리는 함수
  const handleResetWidth = () => {
    animate(sidebarWidth, SIDEBAR_DEFAULT_WIDTH, { type: "spring", stiffness: 400, damping: 30 });
  };
  
  // 사이드바가 '열려있다'고 간주할 수 있는지 여부를 판단
  const isLeftSidebarOpen = sidebarWidth.get() > SIDEBAR_COLLAPSED_WIDTH;

  // 훅이 외부로 노출하는 값과 함수들
  return { sidebarWidth, isLeftSidebarOpen, handleResizeMouseDown, handleResetWidth };
} 