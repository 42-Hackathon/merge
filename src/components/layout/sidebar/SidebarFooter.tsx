import { memo, useEffect, useState } from 'react';
import { Users, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '../../ui/button';
import type { SidebarFooterProps } from './types';

export const SidebarFooter = memo(
    ({
        isCollapsed,
        isCollabActive,
        onCollabToggle,
        cursorPosition,
    }: SidebarFooterProps) => {
        const [zoomLevel, setZoomLevel] = useState(100);

        // 초기 줌 레벨 가져오기
        useEffect(() => {
            const getInitialZoom = async () => {
                if (window.electronAPI?.getZoomLevel) {
                    const level = await window.electronAPI.getZoomLevel();
                    setZoomLevel(level);
                }
            };
            getInitialZoom();
        }, []);

        const handleZoomIn = async () => {
            if (window.electronAPI?.zoomIn) {
                const newLevel = await window.electronAPI.zoomIn();
                setZoomLevel(newLevel);
            }
        };

        const handleZoomOut = async () => {
            if (window.electronAPI?.zoomOut) {
                const newLevel = await window.electronAPI.zoomOut();
                setZoomLevel(newLevel);
            }
        };

        const handleZoomReset = async () => {
            if (window.electronAPI?.zoomReset) {
                const newLevel = await window.electronAPI.zoomReset();
                setZoomLevel(newLevel);
            }
        };

        return (
        <div
            className="flex-shrink-0 border-t border-white/[0.15]"
            style={{ padding: `8px`, rowGap: `8px` }}
        >
            {isCollapsed ? (
                <div className="flex items-center justify-center">
                    <Button
                        variant={isCollabActive ? 'secondary' : 'ghost'}
                        size="icon"
                        className={`transition-all duration-200 flex items-center justify-center ${
                            isCollabActive
                                ? 'bg-blue-500/50 text-white'
                                : 'text-white/70 hover:bg-white/10'
                        }`}
                        style={{ width: `32px`, height: `32px` }}
                        onClick={onCollabToggle}
                        title="Collaboration Mode"
                    >
                        <Users style={{ width: `18px`, height: `18px` }} />
                    </Button>
                </div>
            ) : (
                <>
                    <div className="space-y-1 text-white/70" style={{ fontSize: `12px` }}>
                        <div className="flex justify-between">
                            <span>Cloud Storage</span>
                            <span>15.7 / 50 GB</span>
                        </div>
                        <div
                            className="w-full bg-white/10 rounded-full"
                            style={{ height: `4px` }}
                        >
                            <div
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                style={{ width: `${(15.7 / 50) * 100}%`, height: `4px` }}
                            />
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-between text-white/70"
                        style={{ fontSize: `12px` }}
                    >
                        <Button
                            variant={isCollabActive ? 'secondary' : 'ghost'}
                            size="icon"
                            className={`transition-all duration-200 flex items-center justify-center ${
                                isCollabActive
                                    ? 'bg-blue-500/50 text-white'
                                    : 'text-white/70 hover:bg-white/10'
                            }`}
                            style={{ width: `28px`, height: `28px` }}
                            onClick={onCollabToggle}
                            title="Collaboration Mode"
                        >
                            <Users style={{ width: `16px`, height: `16px` }} />
                        </Button>
                        <div className="flex items-center" style={{ columnGap: `4px` }}>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center rounded-md"
                                style={{ width: `24px`, height: `24px` }}
                                onClick={handleZoomOut}
                                title="Zoom Out"
                            >
                                <ZoomOut style={{ width: `14px`, height: `14px` }} />
                            </Button>
                            <div
                                className="text-center tabular-nums cursor-pointer"
                                style={{ fontSize: `11px`, width: `35px` }}
                                onClick={handleZoomReset}
                                title="Reset to Default Size (100%)"
                            >
                                {zoomLevel}%
                            </div>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center rounded-md"
                                style={{ width: `24px`, height: `24px` }}
                                onClick={handleZoomIn}
                                title="Zoom In"
                            >
                                <ZoomIn style={{ width: `14px`, height: `14px` }} />
                            </Button>
                        </div>
                        <div className="text-right">
                            <span>
                                Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
        );
    }
);
