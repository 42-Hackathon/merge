import React, { useState, useEffect, useRef } from 'react';
import { Pin, X } from 'lucide-react';
import { TiptapEditor, TiptapEditorHandle } from './components/memo/tiptap-editor';

const StickyNote: React.FC = () => {
    const [isPinned, setIsPinned] = useState(false);
    const [isEditorDragOver, setIsEditorDragOver] = useState(false);
    const editorRef = useRef<TiptapEditorHandle>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const [backgroundOpacity, setBackgroundOpacity] = useState(80);

    const handleTogglePin = () => {
        window.electron?.togglePin();
        setIsPinned(!isPinned);
    };

    const handleClose = () => {
        window.electron?.closeWindow();
    };

    const handleEditorDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsEditorDragOver(true);
    };

    const handleEditorDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsEditorDragOver(false);
    };

    const handleEditorDrop = (e: React.DragEvent) => {
            e.preventDefault();
            setIsEditorDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            // Handle file drop
                } else {
            const text = e.dataTransfer.getData('text/plain');
            if (text && editorRef.current?.editor) {
                const { from, to } = editorRef.current.editor.state.selection;
                editorRef.current.editor.chain().focus().insertContentAt({ from, to }, text).run();
                            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div
            className="flex flex-col h-screen backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-black/10"
            style={{
                backgroundColor: `rgba(248, 250, 252, ${backgroundOpacity / 100})`,
            }}
            onDragOver={handleEditorDragOver}
            onDragLeave={handleEditorDragLeave}
        >
            {/* Draggable Header */}
            <div
                className="h-8 flex-shrink-0 flex items-center justify-between px-2"
                style={{ '--webkit-app-region': 'drag' } as React.CSSProperties}
            >
                {/* Left side: Controls */}
                <div className="flex items-center gap-1" style={{ '--webkit-app-region': 'no-drag' } as React.CSSProperties}>
                    <input
                        type="range"
                        min="30"
                        max="100"
                        value={backgroundOpacity}
                        onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                        className="w-16 h-1 accent-blue-500"
                    />
                </div>

                {/* Right side: Window controls */}
                <div className="flex items-center gap-1" style={{ '--webkit-app-region': 'no-drag' } as React.CSSProperties}>
                    <button
                        onClick={handleTogglePin}
                        title="Pin"
                        className={`p-1 rounded hover:bg-black/10 ${
                            isPinned ? 'bg-blue-200 text-blue-800' : 'text-zinc-900'
                        }`}
                    >
                        <Pin className={`w-3 h-3 transition-transform ${isPinned ? 'rotate-45' : ''}`} />
                    </button>
                    <button onClick={handleClose} title="Close" className="p-1 rounded text-zinc-900 hover:bg-red-500 hover:text-white">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>
            {/* Content Area */}
            <div
                ref={editorContainerRef}
                className={`flex-grow p-2 overflow-y-auto overflow-x-visible transition-colors text-zinc-900 ${
                    isEditorDragOver ? 'bg-white/30' : ''
                }`}
                style={{ position: 'relative' }}
                onDrop={handleEditorDrop}
            >
                <TiptapEditor
                    ref={editorRef}
                    content=""
                    onContentChange={() => {
                        // Handle content change if needed
                    }}
                />
            </div>
        </div>
    );
};

export default StickyNote;
