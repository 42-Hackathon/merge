import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Type,
    CheckSquare,
    Minus,
} from 'lucide-react';
import React from 'react';
import { SuggestionKeyDownProps } from '@tiptap/suggestion';

export interface SlashCommand {
    name: string;
    action: string;
    icon: React.ElementType;
    description: string;
}

export const commands: SlashCommand[] = [
    { name: 'Text', action: 'text', icon: Type, description: 'Start writing with plain text.' },
    { name: 'Heading 1', action: 'heading1', icon: Heading1, description: 'Big section heading.' },
    {
        name: 'Heading 2',
        action: 'heading2',
        icon: Heading2,
        description: 'Medium section heading.',
    },
    {
        name: 'Heading 3',
        action: 'heading3',
        icon: Heading3,
        description: 'Small section heading.',
    },
    {
        name: 'Bulleted List',
        action: 'bullet',
        icon: List,
        description: 'Create a simple bulleted list.',
    },
    {
        name: 'Numbered List',
        action: 'numbered',
        icon: ListOrdered,
        description: 'Create a list with numbering.',
    },
    {
        name: 'To-do List',
        action: 'todo',
        icon: CheckSquare,
        description: 'Track tasks with a to-do list.',
    },
    { name: 'Bold', action: 'bold', icon: Bold, description: 'Make your text bold.' },
    { name: 'Italic', action: 'italic', icon: Italic, description: 'Italicize your text.' },
    {
        name: 'Strikethrough',
        action: 'strikethrough',
        icon: Strikethrough,
        description: 'Cross out text.',
    },
    { name: 'Code', action: 'code', icon: Code, description: 'Capture a code snippet.' },
    { name: 'Divider', action: 'divider', icon: Minus, description: 'Visually divide blocks.' },
];

interface SlashCommandMenuProps {
    items: SlashCommand[];
    command: (command: SlashCommand) => void;
}

export const SlashCommandMenu = forwardRef<any, SlashCommandMenuProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: SuggestionKeyDownProps) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    if (props.items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.1 }}
            className="w-72 rounded-xl bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 shadow-2xl overflow-hidden p-2"
        >
            <div className="text-xs text-gray-400 font-medium px-2 pb-1.5">Commands</div>
            {props.items.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                    <button
                        key={item.action}
                        onClick={() => selectItem(index)}
                        className={`w-full flex items-center text-left p-2 rounded-lg transition-colors duration-150 ${
                            isSelected ? 'bg-gray-700/60' : 'hover:bg-gray-800/50'
                        }`}
                    >
                        <div
                            className={`mr-3 p-1.5 rounded-md ${
                                isSelected ? 'bg-gray-600' : 'bg-gray-700/50'
                            }`}
                        >
                            <Icon
                                className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-300'}`}
                            />
                        </div>
                        <div>
                            <div
                                className={`font-medium ${
                                    isSelected ? 'text-white' : 'text-gray-200'
                                }`}
                            >
                                {item.name}
                            </div>
                            <div
                                className={`text-sm ${
                                    isSelected ? 'text-gray-300' : 'text-gray-400'
                                }`}
                            >
                                {item.description}
                            </div>
                        </div>
                    </button>
                );
            })}
        </motion.div>
    );
});
