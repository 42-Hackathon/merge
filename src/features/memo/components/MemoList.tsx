import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Clock, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedMemo } from '../types';

interface MemoListProps {
  memos: SavedMemo[];
  currentMemoId: string | null;
  onSelectMemo: (memoId: string) => void;
  onDeleteMemo: (memoId: string) => void;
  onClose: () => void;
}

export const MemoList = memo(({
  memos,
  currentMemoId,
  onSelectMemo,
  onDeleteMemo,
  onClose
}: MemoListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Saved Memos</h3>
        <p className="text-sm text-white/60">{memos.length} memos</p>
      </div>
      
      <ScrollArea className="flex-1">
        <AnimatePresence>
          {memos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-white/40"
            >
              <FileText className="h-12 w-12 mb-3" />
              <p className="text-sm">No saved memos yet</p>
            </motion.div>
          ) : (
            <div className="p-2">
              {memos.map((memo, index) => (
                <motion.div
                  key={memo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onSelectMemo(memo.id);
                    onClose();
                  }}
                  className={`
                    group relative p-3 mb-2 rounded-lg cursor-pointer
                    ${currentMemoId === memo.id 
                      ? 'bg-blue-500/20 border border-blue-500/40' 
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }
                    transition-all duration-200
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        {memo.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(memo.createdAt)}
                        </span>
                        {memo.updatedAt !== memo.createdAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(memo.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMemo(memo.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity
                        p-1.5 rounded-md hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
});

MemoList.displayName = 'MemoList'; 