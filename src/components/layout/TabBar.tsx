import { FileText, X, Image, Video, File } from 'lucide-react';

interface TabBarProps {
    openTabs: FileNode[];
    activeTabId: string | null;
    onTabChange: (tabId: string) => void;
    onTabClose: (tabId: string) => void;
}

const getFileIcon = (type?: string) => {
    switch (type) {
        case 'image':
            return Image;
        case 'video':
            return Video;
        case 'text':
        case 'markdown':
            return FileText;
        default:
            return File;
    }
};

export function TabBar({ openTabs, activeTabId, onTabChange, onTabClose }: TabBarProps) {
    if (openTabs.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center border-b border-white/[0.15] bg-transparent overflow-x-auto h-10">
            <div className="flex items-center h-full">
                {openTabs.map((tab) => {
                    const Icon = getFileIcon(tab.type);
                    const isActive = activeTabId === tab.id;

                    return (
                        <div
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                flex items-center gap-2 border-r border-white/[0.1] cursor-pointer transition-colors duration-200 relative h-full
                                ${
                                    isActive
                                        ? 'text-white bg-white/[0.2]'
                                        : 'text-white/80 hover:text-white hover:bg-white/[0.12]'
                                }
                            `}
                            style={{
                                paddingLeft: '8px',
                                paddingRight: '32px',
                            }}
                            title={tab.name}
                        >
                            <Icon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate text-xs max-w-[120px]">{tab.name}</span>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTabClose(tab.id);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200"
                                style={{
                                    width: '16px',
                                    height: '16px',
                                }}
                                title="Close Tab"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
