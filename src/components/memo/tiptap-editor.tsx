import React, { forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react';
import { NodeSelection } from 'prosemirror-state';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Pill } from './pill-extension';
import SlashCommandExtension from './slash-command-extension';
import { FormattingToolbar } from './formatting-toolbar';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';

export interface TiptapEditorHandle {
    editor: Editor | null;
}

interface TiptapEditorProps {
    content: string;
    onContentChange: (content: string) => void;
    onDragOver?: React.DragEventHandler<HTMLDivElement>;
    onDragLeave?: React.DragEventHandler<HTMLDivElement>;
    onDrop?: React.DragEventHandler<HTMLDivElement>;
}

export const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
    ({ content, onContentChange, onDragOver, onDragLeave, onDrop }, ref) => {
        const editor = useEditor({
            extensions: [
                StarterKit.configure({
                    heading: { levels: [1, 2, 3] },
                    // Manually control formatting options to avoid conflicts
                    bold: false,
                    italic: false,
                    strike: false,
                    code: false,
                }),
                // Re-add them as individual extensions
                Bold,
                Italic,
                Strike,
                Code,
                Underline,
                TextStyle,
                Color,
                Highlight.configure({ multicolor: true }),
                Placeholder.configure({
                    placeholder: ({ node }) => {
                        if (node.type.name === 'heading') {
                            return '제목...';
                        }
                        return '여기에 내용을 작성하세요...';
                    },
                }),
                Pill,
                SlashCommandExtension,
            ],
            content: content,
            onUpdate: ({ editor }) => {
                onContentChange(editor.getHTML());
            },
            editorProps: {
                attributes: {
                    spellcheck: 'false',
                },
            },
        });

        useImperativeHandle(ref, () => ({
            editor,
        }));

        return (
            <div
                className="relative flex-1 flex flex-col h-full"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {editor && (
                    <BubbleMenu
                        editor={editor}
                        tippyOptions={{ duration: 100 }}
                        shouldShow={({ state }) => {
                            const { selection } = state;

                            // 1. Don't show for NodeSelections (e.g. when a Pill is clicked)
                            if (selection instanceof NodeSelection) {
                                return false;
                            }

                            // 2. Don't show for empty selections
                            if (selection.empty) {
                                return false;
                            }

                            // All checks passed, it's a valid text selection.
                            return true;
                        }}
                    >
                        <FormattingToolbar editor={editor} />
                    </BubbleMenu>
                )}
                <EditorContent editor={editor} className="flex-1 overflow-y-auto p-4 h-full" />
            </div>
        );
    }
);
