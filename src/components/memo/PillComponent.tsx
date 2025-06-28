import React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { GripVertical, FileText, Image, Link as LinkIcon, Film, Music, Camera, Clipboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ContentType = 'text' | 'image' | 'link' | 'video' | 'audio' | 'clipboard' | 'screenshot' | 'other';

const PillIcon = ({ type }: { type: ContentType }) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'video': return <Film className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'clipboard': return <Clipboard className="h-4 w-4" />;
      case 'screenshot': return <Camera className="h-4 w-4" />;
      case 'text':
      default:
        return <FileText className="h-4 w-4" />;
    }
};

const getPillStyleClass = (type: ContentType) => {
    const baseStyle = 'bg-black/20';
    switch (type) {
        case 'link':
            return `${baseStyle} border-blue-500/80 text-blue-300`;
        case 'image':
            return `${baseStyle} border-purple-500/80 text-purple-300`;
        case 'video':
            return `${baseStyle} border-red-500/80 text-red-300`;
        case 'audio':
            return `${baseStyle} border-orange-500/80 text-orange-300`;
        case 'clipboard':
            return `${baseStyle} border-yellow-500/80 text-yellow-300`;
        case 'screenshot':
            return `${baseStyle} border-cyan-500/80 text-cyan-300`;
        case 'text':
            return `${baseStyle} border-green-500/80 text-green-300`;
        case 'other':
        default: 
            return `${baseStyle} border-gray-500/80 text-gray-300`;
    }
};

export const PillComponent: React.FC<NodeViewProps> = ({ node, selected }) => {
    const { id, type, title, content } = node.attrs;

    const handleClick = () => {
        const event = new CustomEvent('openContentFromPill', { 
            detail: { id, type, title, content } 
        });
        window.dispatchEvent(event);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <NodeViewWrapper
                        as="span"
                        className={`
                            react-node-view
                            inline-flex items-center
                            rounded-full pl-2 pr-2 py-1 text-xs font-medium
                            border transition-all
                            backdrop-blur-xl
                            cursor-pointer
                            hover:bg-black/30
                            mx-0.5
                            ${getPillStyleClass(type)}
                        `}
                        onClick={handleClick}
                        title={title}
                        draggable="true"
                        data-drag-handle
                    >
                        <PillIcon type={type} />
                        <span className="truncate flex-1 mx-1.5">{title}</span>
                    </NodeViewWrapper>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}; 