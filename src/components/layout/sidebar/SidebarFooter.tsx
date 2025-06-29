import { memo } from 'react';
import { Users, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { SidebarFooterProps } from './types';

export const SidebarFooter = memo(
    ({
        isCollapsed,
        isCollabActive,
        onCollabToggle,
        scale,
        zoomLevel,
        onZoomIn,
        onZoomOut,
        cursorPosition,
    }: SidebarFooterProps) => (
        <div
            className="flex-shrink-0 border-t border-white/[0.15]"
            style={{ padding: `${scale(8)}px`, rowGap: `${scale(8)}px` }}
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
                        style={{ width: `${scale(32)}px`, height: `${scale(32)}px` }}
                        onClick={onCollabToggle}
                        title="협업 모드"
                    >
                        <Users style={{ width: `${scale(18)}px`, height: `${scale(18)}px` }} />
                    </Button>
                </div>
            ) : (
                <>
                    <div className="space-y-1 text-white/70" style={{ fontSize: `${scale(12)}px` }}>
                        <div className="flex justify-between">
                            <span>클라우드 용량</span>
                            <span>15.7 / 50 GB</span>
                        </div>
                        <div
                            className="w-full bg-white/10 rounded-full"
                            style={{ height: `${scale(4)}px` }}
                        >
                            <div
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                style={{ width: `${(15.7 / 50) * 100}%`, height: `${scale(4)}px` }}
                            />
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-between text-white/70"
                        style={{ fontSize: `${scale(12)}px` }}
                    >
                        <Button
                            variant={isCollabActive ? 'secondary' : 'ghost'}
                            size="icon"
                            className={`transition-all duration-200 flex items-center justify-center ${
                                isCollabActive
                                    ? 'bg-blue-500/50 text-white'
                                    : 'text-white/70 hover:bg-white/10'
                            }`}
                            style={{ width: `${scale(28)}px`, height: `${scale(28)}px` }}
                            onClick={onCollabToggle}
                            title="협업 모드"
                        >
                            <Users style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }} />
                        </Button>
                        <div className="flex items-center" style={{ columnGap: `${scale(4)}px` }}>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center rounded-md"
                                style={{ width: `${scale(24)}px`, height: `${scale(24)}px` }}
                                onClick={onZoomOut}
                            >
                                <ZoomOut
                                    style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                                />
                            </Button>
                            <div
                                className="text-center tabular-nums"
                                style={{ fontSize: `${scale(11)}px`, width: `${scale(35)}px` }}
                            >
                                {Math.round(zoomLevel)}%
                            </div>
                            <Button
                                variant="ghost"
                                className="flex items-center justify-center rounded-md"
                                style={{ width: `${scale(24)}px`, height: `${scale(24)}px` }}
                                onClick={onZoomIn}
                            >
                                <ZoomIn
                                    style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                                />
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
    )
);
