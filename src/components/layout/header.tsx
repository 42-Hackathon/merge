import { motion } from 'framer-motion';
import { Search, Settings, StickyNote, Sparkles, Minus, Square, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/content';

interface HeaderProps {
    onSearchToggle: () => void;
    onStickyNoteToggle: () => void;
    zoomLevel: number;
    openTabs?: ContentItem[];
    activeTabId?: string | null;
    onTabChange?: (tabId: string) => void;
    onTabClose?: (tabId: string) => void;
}

export function Header({
    onSearchToggle,
    onStickyNoteToggle,
    zoomLevel,
    openTabs = [],
    activeTabId,
    onTabChange,
    onTabClose,
}: HeaderProps) {
    const scale = (base: number) => base * (zoomLevel / 100);

    const handleMinimize = () => {
        if (window.electronAPI?.minimizeWindow) {
            window.electronAPI.minimizeWindow();
        }
    };

    const handleMaximize = () => {
        if (window.electronAPI?.maximizeWindow) {
            window.electronAPI.maximizeWindow();
        }
    };

    const handleClose = () => {
        if (window.electronAPI?.closeWindow) {
            window.electronAPI.closeWindow();
        }
    };

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center border-b bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border-black/10 dark:border-white/10"
            style={
                {
                    height: `${scale(40)}px`,
                    // @ts-ignore
                    WebkitAppRegion: 'drag',
                } as React.CSSProperties
            }
        >
            <div className="relative z-10 flex items-center w-full">
                {/* Left - App Title & Navigation */}
                <div className="flex-1 flex items-center">
                    <div
                        className="w-72 flex items-center border-r border-black/10 dark:border-white/10"
                        style={{
                            paddingLeft: `${scale(16)}px`,
                            paddingRight: `${scale(16)}px`,
                            height: '100%',
                        }}
                    >
                        <div className="flex items-center" style={{ columnGap: `${scale(8)}px` }}>
                            <div
                                className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-md flex items-center justify-center"
                                style={{
                                    width: `${scale(24)}px`,
                                    height: `${scale(24)}px`,
                                }}
                            >
                                <Sparkles
                                    style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                                    className="text-white"
                                />
                            </div>
                            <span
                                className="font-semibold text-zinc-800 dark:text-zinc-200"
                                style={{ fontSize: `${scale(14)}px` }}
                            >
                                FLux
                            </span>
                        </div>
                    </div>

                    {/* Tabs - feat/stickymemo에서 추가된 탭 기능 */}
                    {openTabs && openTabs.length > 0 && (
                        <div className="flex-1 flex items-end h-full">
                            {openTabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    onClick={() => onTabChange?.(tab.id)}
                                    className={`flex items-center border-r border-black/10 dark:border-white/10 cursor-pointer h-full transition-colors duration-200
                    ${
                        activeTabId === tab.id
                            ? 'bg-white/50 dark:bg-black/20'
                            : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                                    style={
                                        {
                                            padding: `0 ${scale(12)}px`,
                                            // @ts-ignore
                                            WebkitAppRegion: 'no-drag',
                                        } as React.CSSProperties
                                    }
                                >
                                    <div
                                        className="flex items-center"
                                        style={{ gap: `${scale(6)}px` }}
                                    >
                                        <FileText
                                            className="text-zinc-500 dark:text-zinc-400"
                                            style={{
                                                width: `${scale(14)}px`,
                                                height: `${scale(14)}px`,
                                            }}
                                        />
                                        <span
                                            className="truncate text-zinc-800 dark:text-zinc-200"
                                            style={{ fontSize: `${scale(12)}px` }}
                                        >
                                            {tab.title}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTabClose?.(tab.id);
                                        }}
                                        className="ml-2 rounded-md hover:bg-black/10 dark:hover:bg-white/20 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                        style={
                                            {
                                                width: `${scale(18)}px`,
                                                height: `${scale(18)}px`,
                                                // @ts-ignore
                                                WebkitAppRegion: 'no-drag',
                                            } as React.CSSProperties
                                        }
                                    >
                                        <X
                                            style={{
                                                width: `${scale(10)}px`,
                                                height: `${scale(10)}px`,
                                            }}
                                        />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Center - Enhanced Search */}
                <div
                    className="absolute left-1/2 transform -translate-x-1/2"
                    style={
                        {
                            // @ts-ignore
                            WebkitAppRegion: 'no-drag',
                        } as React.CSSProperties
                    }
                >
                    <Button
                        variant="glass"
                        size="sm"
                        onClick={onSearchToggle}
                        className="text-zinc-700 dark:text-zinc-300 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 backdrop-blur-xl rounded-full relative overflow-hidden group"
                        style={{
                            height: `${scale(32)}px`,
                            paddingLeft: `${scale(16)}px`,
                            paddingRight: `${scale(16)}px`,
                            fontSize: `${scale(12)}px`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div
                            className="relative z-10 flex items-center"
                            style={{ columnGap: `${scale(8)}px` }}
                        >
                            <Search style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />
                            <span>검색하기...</span>
                        </div>
                    </Button>
                </div>

                {/* Right - Enhanced Controls */}
                <div
                    className="flex items-center px-4 gap-1"
                    style={
                        {
                            // @ts-ignore
                            WebkitAppRegion: 'no-drag',
                        } as React.CSSProperties
                    }
                >
                    <button
                        onClick={onStickyNoteToggle}
                        className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{
                            height: `${scale(28)}px`,
                            width: `${scale(28)}px`,
                        }}
                        title="스티키 노트"
                    >
                        <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                        <StickyNote
                            className="relative z-10 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                            style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                        />
                    </button>

                    <button
                        className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{
                            height: `${scale(28)}px`,
                            width: `${scale(28)}px`,
                        }}
                        title="설정"
                    >
                        <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                        <Settings
                            className="relative z-10 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                            style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                        />
                    </button>

                    <div
                        className="w-px bg-black/10 dark:bg-white/20 mx-2"
                        style={{ height: `${scale(20)}px` }}
                    />

                    {/* Window Controls - Liquid Glass Style */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleMinimize}
                            className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                height: `${scale(28)}px`,
                                width: `${scale(28)}px`,
                            }}
                            title="최소화"
                        >
                            <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                            <Minus
                                className="relative z-10 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                                style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                            />
                        </button>

                        <button
                            onClick={handleMaximize}
                            className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                height: `${scale(28)}px`,
                                width: `${scale(28)}px`,
                            }}
                            title="최대화"
                        >
                            <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                            <Square
                                className="relative z-10 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200"
                                style={{ width: `${scale(12)}px`, height: `${scale(12)}px` }}
                            />
                        </button>

                        <button
                            onClick={handleClose}
                            className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                height: `${scale(28)}px`,
                                width: `${scale(28)}px`,
                            }}
                            title="닫기"
                        >
                            <div className="absolute inset-0 rounded-full bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                            <X
                                className="relative z-10 text-zinc-700 dark:text-zinc-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200"
                                style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
