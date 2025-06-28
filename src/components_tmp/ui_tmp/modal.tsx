import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  position?: 'center' | 'top';
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className = "max-w-md",
  position = 'center'
}: ModalProps) {

  const positionClasses = {
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    top: "top-20 left-1/2 transform -translate-x-1/2"
  };

  const animationVariants = {
    center: {
      initial: { opacity: 0, scale: 0.9, y: 50 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 50 },
    },
    top: {
      initial: { opacity: 0, scale: 0.9, y: -50 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: -50 },
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={animationVariants[position].initial}
            animate={animationVariants[position].animate}
            exit={animationVariants[position].exit}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed w-full z-50 ${positionClasses[position]} ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 