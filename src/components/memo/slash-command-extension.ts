import { Editor, Extension, Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { Suggestion, SuggestionOptions } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { EditorState } from 'prosemirror-state';

import { SlashCommandMenu, commands as allCommands, SlashCommand } from './slash-command-menu';

const extensionName = 'slashCommand';

let popup: any;

type ExtendedSuggestionOptions = SuggestionOptions & {
    shouldRender?: (props: { state: EditorState }) => boolean;
};

const SlashCommandExtension = Extension.create({
    name: extensionName,

    addProseMirrorPlugins() {
        const suggestionOptions: ExtendedSuggestionOptions = {
            editor: this.editor,
            char: '/',
            command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
                props.action({ editor, range });
            },
            items: ({ query }) => {
                return allCommands
                    .filter((item) => item.name.toLowerCase().startsWith(query.toLowerCase()))
                    .slice(0, 10);
            },
            render: () => {
                let component: any;

                return {
                    onStart: (props) => {
                        component = new ReactRenderer(SlashCommandMenu, {
                            editor: props.editor,
                            props: {
                                ...props,
                                command: (cmd: SlashCommand) => {
                                    const { editor, range } = props;
                                    const { action } = cmd;
                                    switch (action) {
                                        case 'heading1':
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange(range)
                                                .setNode('heading', { level: 1 })
                                                .run();
                                            break;
                                        case 'heading2':
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange(range)
                                                .setNode('heading', { level: 2 })
                                                .run();
                                            break;
                                        case 'heading3':
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange(range)
                                                .setNode('heading', { level: 3 })
                                                .run();
                                            break;
                                        case 'bullet':
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange(range)
                                                .toggleBulletList()
                                                .run();
                                            break;
                                        case 'numbered':
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange(range)
                                                .toggleOrderedList()
                                                .run();
                                            break;
                                        case 'bold':
                                            editor
                                                .chain()
                                                .focus()
                                                .deleteRange(range)
                                                .toggleBold()
                                                .run();
                                            break;
                                        // Add other cases here
                                        default:
                                            break;
                                    }
                                },
                            },
                        });

                        popup = tippy('body', {
                            getReferenceClientRect: props.clientRect as any,
                            appendTo: () => document.body,
                            content: component.element,
                            showOnCreate: true,
                            interactive: true,
                            trigger: 'manual',
                            placement: 'bottom-start',
                        });
                    },
                    onUpdate(props) {
                        component.updateProps(props);
                        popup[0].setProps({
                            getReferenceClientRect: props.clientRect as any,
                        });
                    },
                    onKeyDown(props) {
                        return component.ref?.onKeyDown(props);
                    },
                    onExit() {
                        popup[0].destroy();
                        component.destroy();
                    },
                };
            },
        } as ExtendedSuggestionOptions;

        return [Suggestion(suggestionOptions)];
    },
});

export default SlashCommandExtension;
