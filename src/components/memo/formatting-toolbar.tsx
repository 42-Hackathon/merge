import { Editor } from '@tiptap/react';
import { Bold, Italic, Underline, Strikethrough, Code, Palette } from 'lucide-react';
import { Toggle } from '../ui/toggle';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';

interface FormattingToolbarProps {
    editor: Editor;
}

const textColors = [
    '#ffffff',
    '#e5e7eb',
    '#9ca3af',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
];

const highlightColors = [
    '#374151',
    '#7f1d1d',
    '#92400e',
    '#365314',
    '#064e3b',
    '#0c4a6e',
    '#1e3a8a',
    '#581c87',
    '#9d174d',
];

export function FormattingToolbar({ editor }: FormattingToolbarProps) {
    const [showColorPalette, setShowColorPalette] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
                setShowColorPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleClass =
        'data-[state=on]:bg-background data-[state=on]:text-foreground hover:bg-background/40 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-muted';

    const activeTextColor = textColors.find((color) => editor.isActive('textStyle', { color }));
    const activeHighlightColor = highlightColors.find((color) =>
        editor.isActive('highlight', { color })
    );
    const isPaletteActive = !!activeTextColor || !!activeHighlightColor;

    return (
        <div
            ref={toolbarRef}
            className="relative flex items-center gap-0.5 p-1 bg-muted rounded-md shadow-xl"
        >
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().toggleBold().run()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Toggle bold"
                className={toggleClass}
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().toggleItalic().run()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Toggle italic"
                className={toggleClass}
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('underline')}
                onPressedChange={() => editor.chain().toggleUnderline().run()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Toggle underline"
                className={toggleClass}
            >
                <Underline className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().toggleStrike().run()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Toggle strikethrough"
                className={toggleClass}
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('code')}
                onPressedChange={() => editor.chain().toggleCode().run()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Toggle code"
                className={toggleClass}
            >
                <Code className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-4 bg-background/50 mx-1.5" />

            {/* Unified Color Palette */}
            <div className="relative">
                <Toggle
                    size="sm"
                    pressed={isPaletteActive}
                    onPressedChange={() => setShowColorPalette((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={toggleClass}
                >
                    <Palette className="h-4 w-4" />
                </Toggle>
                {showColorPalette && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute top-full mt-2 p-2 bg-muted rounded-lg shadow-xl z-10 w-48"
                    >
                        <Tabs defaultValue="text" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-8 bg-background/30">
                                <TabsTrigger
                                    value="text"
                                    className="h-6 text-xs data-[state=active]:bg-muted data-[state=active]:text-foreground"
                                >
                                    Text
                                </TabsTrigger>
                                <TabsTrigger
                                    value="highlight"
                                    className="h-6 text-xs data-[state=active]:bg-muted data-[state=active]:text-foreground"
                                >
                                    Highlight
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="text">
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {textColors.map((color) => (
                                        <button
                                            key={`text-${color}`}
                                            onClick={() => {
                                                editor.chain().setColor(color).run();
                                                setShowColorPalette(false);
                                            }}
                                            onMouseDown={(e) => e.preventDefault()}
                                            className={cn(
                                                'w-6 h-6 rounded-md',
                                                (color === '#ffffff'
                                                    ? !activeTextColor || activeTextColor === color
                                                    : activeTextColor === color) &&
                                                    'ring-2 ring-ring'
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <button
                                        onClick={() => {
                                            editor.chain().unsetColor().run();
                                            setShowColorPalette(false);
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className={cn(
                                            'w-6 h-6 rounded-md border flex items-center justify-center',
                                            !activeTextColor && 'ring-2 ring-ring'
                                        )}
                                        title="기본값"
                                    >
                                        <div className="w-4 h-0.5 bg-red-500 transform rotate-45" />
                                    </button>
                                </div>
                            </TabsContent>
                            <TabsContent value="highlight">
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {highlightColors.map((color) => (
                                        <button
                                            key={`bg-${color}`}
                                            onClick={() => {
                                                editor.chain().toggleHighlight({ color }).run();
                                                setShowColorPalette(false);
                                            }}
                                            onMouseDown={(e) => e.preventDefault()}
                                            className={cn(
                                                'w-6 h-6 rounded-md',
                                                activeHighlightColor === color && 'ring-2 ring-ring'
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <button
                                        onClick={() => {
                                            editor.chain().unsetHighlight().run();
                                            setShowColorPalette(false);
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className={cn(
                                            'w-6 h-6 rounded-md border flex items-center justify-center',
                                            !activeHighlightColor && 'ring-2 ring-ring'
                                        )}
                                    >
                                        <div className="w-4 h-0.5 bg-red-500 transform rotate-45" />
                                    </button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
