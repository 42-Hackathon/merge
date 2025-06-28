import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PillComponent } from './PillComponent.tsx';

export interface PillOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pill: {
      /**
       * Add a pill
       */
      setPill: (attributes: {
        id: string;
        type: 'text' | 'image' | 'link' | 'video' | 'audio' | 'clipboard' | 'screenshot' | 'other';
        title: string;
        content: string;
        metadata?: { url?: string; domain?: string; favicon?: string };
      }) => ReturnType;
    };
  }
}

export const Pill = Node.create<PillOptions>({
  name: 'pill',
  group: 'inline',
  inline: true,
  atom: true,
  content: ' ',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      type: { default: 'text' },
      title: { default: 'Untitled' },
      content: { default: '' },
      metadata: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="pill"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'pill' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PillComponent);
  },

  addCommands() {
    return {
      setPill:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
}); 