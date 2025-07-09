import { useEffect } from 'react';
import { useFileStore } from '../../hooks/useFileStore';
import { useTabStore } from '../../hooks/useTabStore';
import { AnimatePresence, motion } from 'framer-motion';

export function FileViewer() {
    const { activeTabId, tabs } = useTabStore();
    const { content, type, isLoading, loadFile, clearContent, error } = useFileStore();

    const activeTab = tabs.find((tab: FileNode) => tab.id === activeTabId);

    useEffect(() => {
        if (activeTab) {
            // 가상 파일(목데이터)인 경우 직접 처리
            if (activeTab.isVirtual && activeTab.contentItem) {
                clearContent();
                // 가상 파일 데이터 설정
                const { contentItem } = activeTab;
                let content = contentItem.content;
                let type: 'text' | 'image' | 'markdown' | 'pdf' | 'html' | 'unsupported' = 'text';

                if (contentItem.type === 'image') {
                    // 이미지의 경우 path 사용 (가상 이미지일 수 있음)
                    content = contentItem.path || contentItem.id;
                    type = 'image';
                } else if (contentItem.type === 'text') {
                    content = contentItem.content;
                    type = 'text';
                }

                // 직접 상태 설정
                    useFileStore.setState({
                        content,
                        type,
                        isLoading: false,
                        error: null,
                    });
            } else {
                // 실제 파일인 경우 기존 로직 사용
                loadFile(activeTab.path);
            }
        } else {
            clearContent();
        }
    }, [activeTab, loadFile, clearContent]);

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-8">Loading...</div>;
        }

        if (error) {
            return <div className="text-center p-8 text-red-500">{error}</div>;
        }

        if (!content) {
            return null; // Don't show anything if there's no active tab or content
        }

        switch (type) {
            case 'image':
                return (
                    <div className="flex justify-center items-center w-full h-full p-4">
                        <img
                            src={content}
                            alt={activeTab?.name || 'Image'}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                );
            case 'pdf':
            case 'html':
                return (
                    <iframe
                        src={content}
                        title={activeTab?.name || 'File'}
                        className="w-full h-full border-none bg-white"
                    />
                );
            case 'markdown':
            case 'text':
                return <pre className="whitespace-pre-wrap break-words p-4">{content}</pre>;
            default:
                return (
                    <div className="text-center p-8 text-red-500">
                        Unsupported file type: {type}
                    </div>
                );
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTabId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    );
}
