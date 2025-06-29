import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { Pin, X } from 'lucide-react';
import { TiptapEditor, TiptapEditorHandle } from './components/memo/tiptap-editor';
import './index.css';

const StickyNote: React.FC = () => {
    const [isPinned, setIsPinned] = useState(true);
    const [editorContent, setEditorContent] = useState(
        '<p># 스티키 노트</p><p>여기에 내용을 작성하세요...</p>'
    );
    const [isEditorDragOver, setIsEditorDragOver] = useState(false);
    const tiptapEditorRef = useRef<TiptapEditorHandle>(null);

    const handleTogglePin = () => {
        window.electron.togglePin();
        setIsPinned(!isPinned);
    };

    const handleClose = () => {
        window.electron.closeWindow();
    };

    const handleEditorDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsEditorDragOver(true);
    };

    const handleEditorDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsEditorDragOver(false);
    };

    const handleEditorDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditorDragOver(false);

            const editor = tiptapEditorRef.current?.editor;
            if (!editor) return;

            const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
            const position = pos?.pos;

            const insertContent = (content: string) => {
                if (position !== undefined) {
                    editor.chain().focus().insertContentAt(position, content).run();
                } else {
                    editor.chain().focus().insertContent(content).run();
                }
            };

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files);
                files.forEach((file) => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (readEvent) => {
                            if (readEvent.target?.result) {
                                const imageUrl = readEvent.target.result as string;
                                insertContent(
                                    `<img src="${imageUrl}" style="max-width: 100%; height: auto;" />`
                                );
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        insertContent(`<p>📄 ${file.name}</p>`);
                    }
                });
                return;
            }

            const plainText = e.dataTransfer.getData('text/plain');
            if (plainText) {
                try {
                    new URL(plainText);
                    insertContent(`<a href="${plainText}" target="_blank">${plainText}</a>`);
                } catch (_) {
                    insertContent(`<p>${plainText}</p>`);
                }
                return;
            }
        },
        [tiptapEditorRef.current]
    );

    return (
        <div className="flex flex-col h-screen bg-neutral-400/20 dark:bg-neutral-800/20 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-black/10 dark:border-white/10">
            {/* Draggable Header */}
            <div
                className="flex justify-end items-center p-1 bg-transparent"
                style={{ WebkitAppRegion: 'drag' }}
            >
                <div style={{ WebkitAppRegion: 'no-drag' }} className="flex items-center space-x-2">
                    <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        defaultValue="1.0"
                        className="w-20 h-1 bg-neutral-500/50 rounded-lg appearance-none cursor-pointer"
                        onChange={(e) => window.electron.setOpacity(parseFloat(e.target.value))}
                        title="투명도 조절"
                    />
                    <button
                        onClick={handleTogglePin}
                        className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${
                            isPinned ? 'text-blue-500' : 'text-gray-500'
                        }`}
                        title={isPinned ? 'Unpin' : 'Pin'}
                    >
                        <Pin size={14} />
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded text-zinc-900 dark:text-zinc-100 hover:bg-red-500 hover:text-white"
                        title="Close"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div
                className={`flex-grow p-2 overflow-y-auto transition-colors text-zinc-900 dark:text-zinc-100 ${
                    isEditorDragOver ? 'bg-white/20 dark:bg-black/20' : ''
                }`}
            >
                <TiptapEditor
                    ref={tiptapEditorRef}
                    content={editorContent}
                    onContentChange={setEditorContent}
                    onDragOver={handleEditorDragOver}
                    onDragLeave={handleEditorDragLeave}
                    onDrop={handleEditorDrop}
                />
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <StickyNote />
    </React.StrictMode>
);
