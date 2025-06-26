import { useState, useCallback, useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";

export function useSidebarResize() {
  const sidebarWidth = useMotionValue(288);
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      const minWidth = 240;
      const maxWidth = 500;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        sidebarWidth.set(newWidth);
      }
    }
  }, [isResizing, sidebarWidth]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
    } else {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  const handleResetWidth = () => {
    animate(sidebarWidth, 288, { type: "spring", stiffness: 400, damping: 30 });
  };
  
  const isLeftSidebarOpen = sidebarWidth.get() > 70;

  return { sidebarWidth, isLeftSidebarOpen, handleResizeMouseDown, handleResetWidth };
} 