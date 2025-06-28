import { ReactRenderer } from '@tiptap/react'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance as TippyInstance } from 'tippy.js'

import { SlashCommandMenu, commands, SlashCommand } from './slash-command-menu'

export const suggestion = {
  items: ({ query }: { query: string }): SlashCommand[] => {
    return commands.filter(item => item.name.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
  },

  render: () => {
    let component: ReactRenderer<any, any>
    let popup: TippyInstance[]

    return {
      onStart: (props: SuggestionProps<SlashCommand>) => {
        component = new ReactRenderer(SlashCommandMenu, {
          props: {
            ...props,
            onCommand: (command: SlashCommand) => props.command(command),
          },
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as any,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: SuggestionProps<SlashCommand>) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }
        
        popup[0].setProps({
          getReferenceClientRect: props.clientRect as any,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }
        return (component.ref as any)?.onKeyDown(props)
      },

      onExit() {
        if (popup && popup.length) popup[0].destroy()
        if (component) component.destroy()
      },
    }
  },
} 