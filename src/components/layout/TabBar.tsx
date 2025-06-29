import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabBarProps {
    openTabs: FileNode[];
    activeTabId: string | null;
    onTabChange: (tabId: string) => void;
    onTabClose: (tabId: string) => void;
}

export function TabBar({ openTabs, activeTabId, onTabChange, onTabClose }: TabBarProps) {
    if (openTabs.length === 0) {
        return null; // Don't render anything if there are no tabs
    }

    return (
        <div className="flex items-center border-b bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border-black/10 dark:border-white/10 overflow-x-auto">
            <div className="flex items-center h-full">
                {openTabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-shrink-0 flex items-center border-r border-black/10 dark:border-white/10 cursor-pointer h-full transition-colors duration-200
                          ${
                              activeTabId === tab.id
                                  ? 'bg-white/50 dark:bg-black/20'
                                  : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        style={{
                            padding: `0 12px`,
                            height: '36px',
                        }}
                    >
                        <div className="flex items-center gap-1.5">
                            <FileText className="text-zinc-500 dark:text-zinc-400 h-3.5 w-3.5" />
                            <span className="truncate text-zinc-800 dark:text-zinc-200 text-xs max-w-[150px]">
                                {tab.name}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.id);
                            }}
                            className="ml-2 rounded-md hover:bg-black/10 dark:hover:bg-white/20 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 h-5 w-5"
                        >
                            <X className="h-2.5 w-2.5" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
