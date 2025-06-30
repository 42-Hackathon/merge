import { motion } from 'framer-motion';
import { Search, Settings, StickyNote, Sparkles, Minus, Square, X, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { ContentItem } from '../../types/content';

interface HeaderProps {
    onSearchToggle: () => void;
    onStickyNoteToggle: () => void;
    openTabs?: ContentItem[];
    activeTabId?: string | null;
    onTabChange?: (tabId: string) => void;
    onTabClose?: (tabId: string) => void;
}

export function Header({
    onSearchToggle,
    onStickyNoteToggle,
    openTabs = [],
    activeTabId,
    onTabChange,
    onTabClose,
}: HeaderProps) {

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
            className="flex items-center border-b bg-zinc-800/80 backdrop-blur-2xl border-white/[0.15]"
            style={
                {
                    height: `40px`,
                    // @ts-expect-error Electron WebkitAppRegion property
                    WebkitAppRegion: 'drag',
                } as React.CSSProperties
            }
        >
            <div className="relative z-10 flex items-center w-full">
                {/* Left - App Title & Navigation */}
                <div className="flex-1 flex items-center">
                                            <div
                            className="w-72 flex items-center border-r border-white/[0.15]"
                        style={{
                            paddingLeft: `16px`,
                            paddingRight: `16px`,
                            height: '100%',
                        }}
                    >
                        <div className="flex items-center" style={{ columnGap: `8px` }}>
                            <div
                                className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-md flex items-center justify-center"
                                style={{
                                    width: `24px`,
                                    height: `24px`,
                                }}
                            >
                                <Sparkles
                                    style={{ width: `14px`, height: `14px` }}
                                    className="text-white"
                                />
                            </div>
                            <span
                                className="font-semibold text-white/90"
                                style={{ fontSize: `14px` }}
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
                                    className={`flex items-center border-r border-white/[0.15] cursor-pointer h-full transition-colors duration-200
                    ${
                        activeTabId === tab.id
                            ? 'bg-white/[0.2] text-white'
                            : 'bg-transparent hover:bg-white/[0.12] text-white/80 hover:text-white'
                    }`}
                                    style={
                                        {
                                            padding: `0 12px`,
                                            // @ts-expect-error Electron WebkitAppRegion property
                                            WebkitAppRegion: 'no-drag',
                                        } as React.CSSProperties
                                    }
                                >
                                    <div
                                        className="flex items-center"
                                        style={{ gap: `6px` }}
                                    >
                                        <FileText
                                            className="text-white/60"
                                            style={{
                                                width: `14px`,
                                                height: `14px`,
                                            }}
                                        />
                                        <span
                                            className="truncate"
                                            style={{ fontSize: `12px` }}
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
                                        className="ml-2 rounded-md hover:bg-black/10 hover:bg-white/20 text-zinc-500 text-zinc-400 hover:text-zinc-800 hover:text-zinc-200"
                                        style={
                                            {
                                                width: `18px`,
                                                height: `18px`,
                                                // @ts-expect-error Electron WebkitAppRegion property
                                                WebkitAppRegion: 'no-drag',
                                            } as React.CSSProperties
                                        }
                                    >
                                        <X
                                            style={{
                                                width: `10px`,
                                                height: `10px`,
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
                            // @ts-expect-error Electron WebkitAppRegion property
                            WebkitAppRegion: 'no-drag',
                        } as React.CSSProperties
                    }
                >
                    <Button
                        variant="glass"
                        size="sm"
                        onClick={onSearchToggle}
                        className="text-white/80 hover:text-white border border-white/20 hover:bg-white/[0.12] backdrop-blur-xl rounded-full relative overflow-hidden group"
                        style={{
                            height: `32px`,
                            paddingLeft: `16px`,
                            paddingRight: `16px`,
                            fontSize: `12px`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div
                            className="relative z-10 flex items-center"
                            style={{ columnGap: `8px` }}
                        >
                            <Search style={{ width: `14px`, height: `14px` }} />
                            <span>검색하기...</span>
                        </div>
                    </Button>
                </div>

                {/* Right - Enhanced Controls */}
                <div
                    className="flex items-center px-4 gap-1"
                    style={
                        {
                            // @ts-expect-error Electron WebkitAppRegion property
                            WebkitAppRegion: 'no-drag',
                        } as React.CSSProperties
                    }
                >
                    <motion.button
                        onClick={onStickyNoteToggle}
                        className="group relative flex items-center justify-center"
                        style={{
                            height: `28px`,
                            width: `28px`,
                        }}
                        title="스티키 노트"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                            mass: 0.6
                        }}
                    >
                        <motion.div 
                            className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm"
                                                         initial={{ opacity: 0 }}
                             whileHover={{ opacity: 1 }}
                             transition={{ 
                                 type: 'tween',
                                 duration: 0.25,
                                 ease: 'easeOut'
                             }}
                        />
                        <motion.div
                                                         initial={{ color: 'rgba(255,255,255,0.7)' }}
                             whileHover={{ color: 'rgba(255,255,255,1)' }}
                             transition={{ 
                                 type: 'tween',
                                 duration: 0.2,
                                 ease: 'easeOut'
                             }}
                        >
                            <StickyNote style={{ width: `14px`, height: `14px` }} />
                        </motion.div>
                    </motion.button>

                    <button
                        className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{
                            height: `28px`,
                            width: `28px`,
                        }}
                        title="설정"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                        <Settings
                            className="relative z-10 text-white/70 group-hover:text-white transition-colors duration-200"
                            style={{ width: `14px`, height: `14px` }}
                        />
                    </button>

                    <div
                        className="w-px bg-white/20 mx-2"
                        style={{ height: `20px` }}
                    />

                    {/* Window Controls - Liquid Glass Style */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleMinimize}
                            className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                height: `28px`,
                                width: `28px`,
                            }}
                            title="최소화"
                        >
                            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                            <Minus
                                className="relative z-10 text-white/70 group-hover:text-white transition-colors duration-200"
                                style={{ width: `14px`, height: `14px` }}
                            />
                        </button>

                        <button
                            onClick={handleMaximize}
                            className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                height: `28px`,
                                width: `28px`,
                            }}
                            title="최대화"
                        >
                            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                            <Square
                                className="relative z-10 text-white/70 group-hover:text-white transition-colors duration-200"
                                style={{ width: `12px`, height: `12px` }}
                            />
                        </button>

                        <button
                            onClick={handleClose}
                            className="group relative flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                height: `28px`,
                                width: `28px`,
                            }}
                            title="닫기"
                        >
                            <div className="absolute inset-0 rounded-full bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
                            <X
                                className="relative z-10 text-white/70 group-hover:text-red-500 transition-colors duration-200"
                                style={{ width: `14px`, height: `14px` }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
