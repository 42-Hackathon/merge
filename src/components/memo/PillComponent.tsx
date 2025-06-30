import React, { useState, useEffect } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { GripVertical, FileText, Image, Link as LinkIcon, Film, Music, Camera, Clipboard, ImageOff } from 'lucide-react';
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
    const [imageError, setImageError] = useState(false);
    const [localImageData, setLocalImageData] = useState<string | null>(null);
    const [isLoadingLocalImage, setIsLoadingLocalImage] = useState(false);

    const handleClick = () => {
        const event = new CustomEvent('openContentFromPill', { 
            detail: { id, type, title, content } 
        });
        window.dispatchEvent(event);
    };

    const isValidImageUrl = (url: string) => {
        try {
            new URL(url);
            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.startsWith('data:image/');
        } catch {
            return false;
        }
    };

    const isLocalFile = (path: string) => {
        return path.startsWith('file://') || (!path.startsWith('http://') && !path.startsWith('https://'));
    };

    // 로컬 이미지 파일을 base64로 변환
    useEffect(() => {
        if (type === 'image' && content && isLocalFile(content) && !localImageData && !isLoadingLocalImage) {
            setIsLoadingLocalImage(true);
            
            const loadLocalImage = async () => {
                try {
                    let filePath = content;
                    
                    // file:// 프로토콜 제거
                    if (filePath.startsWith('file://')) {
                        filePath = filePath.replace('file://', '');
                    }
                    
                    // Electron API를 통해 파일 읽기
                    if ((window as any).electronAPI?.readFile) {
                        const response = await (window as any).electronAPI.readFile(filePath);
                        if (response?.success && response?.data?.content) {
                            // 이미 data URL 형태로 받음 (data:image/jpeg;base64,...)
                            setLocalImageData(response.data.content);
                        } else {
                            console.error('Failed to read file:', response?.error);
                            setImageError(true);
                        }
                    } else {
                        // Electron API가 없으면 직접 파일 URL 시도 (개발 환경용)
                        setLocalImageData(content.startsWith('file://') ? content : `file://${content}`);
                    }
                } catch (error) {
                    console.error('Error loading local image:', error);
                    setImageError(true);
                }
                setIsLoadingLocalImage(false);
            };
            
            loadLocalImage();
        }
    }, [type, content, localImageData, isLoadingLocalImage]);

    const getImageSource = () => {
        if (type !== 'image' || !content) return null;
        
        if (isLocalFile(content)) {
            return localImageData;
        }
        
        return isValidImageUrl(content) ? content : null;
    };

    const renderTooltipContent = () => {
        if (type === 'image') {
            const imageSource = getImageSource();
            
            return (
                <div className="space-y-2">
                    <div className="text-xs font-medium text-white/90">{title}</div>
                    
                    {isLoadingLocalImage ? (
                        <div className="flex items-center justify-center h-20 bg-white/5 rounded-md border border-white/10">
                            <div className="text-center">
                                <div className="animate-spin h-4 w-4 border-2 border-white/40 border-t-white/80 rounded-full mx-auto mb-1"></div>
                                <div className="text-xs text-white/50">이미지 로딩 중...</div>
                            </div>
                        </div>
                    ) : imageSource && !imageError ? (
                        <div className="rounded-md overflow-hidden border border-white/10">
                            <img 
                                src={imageSource} 
                                alt={title}
                                className="w-full h-32 object-cover"
                                onError={() => setImageError(true)}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-20 bg-white/5 rounded-md border border-white/10">
                            <div className="text-center">
                                <ImageOff className="h-6 w-6 text-white/40 mx-auto mb-1" />
                                <div className="text-xs text-white/50">
                                    {content ? '이미지를 불러올 수 없습니다' : '이미지가 없습니다'}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-xs text-white/50 italic">클릭하여 자세히 보기</div>
                </div>
            );
        }

        // 기존 텍스트 기반 컨텐츠
        return (
            <div className="space-y-1.5">
                <div className="text-xs font-medium text-white/90">{title}</div>
                {content && (
                    <div className="text-xs text-white/70 leading-relaxed line-clamp-3">
                        {content.length > 150 ? content.substring(0, 150) + '...' : content}
                    </div>
                )}
                <div className="text-xs text-white/50 italic">클릭하여 자세히 보기</div>
            </div>
        );
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
                <TooltipContent 
                    side="bottom"
                    hideArrow={true}
                    className="max-w-xs p-3 bg-black/70 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl text-white"
                    sideOffset={8}
                >
                    {renderTooltipContent()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}; 