import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, AlertCircle } from 'lucide-react';
import { SaveStatus } from '../types';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

export const SaveStatusIndicator = memo(({ 
  status, 
  className = '' 
}: SaveStatusIndicatorProps) => {
  return (
    <AnimatePresence mode="wait">
      {status !== 'idle' && (
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${className}`}
        >
          {status === 'saving' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="h-4 w-4 text-blue-400" />
              </motion.div>
              <span className="text-blue-400">Saving...</span>
            </>
          )}
          {status === 'saved' && (
            <>
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-green-400">Saved</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400">Error</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SaveStatusIndicator.displayName = 'SaveStatusIndicator'; 