import { useEffect } from 'react';
import { useFileStore } from '../../hooks/useFileStore';
import { useTabStore } from '../../hooks/useTabStore';
import { AnimatePresence, motion } from 'framer-motion';
import React, { RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

interface FileNode {
    id: string; // Unique identifier for UI state (e.g., expansion, selection)
    path: string; // The real, absolute path in the file system
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    count: number;
    children?: FileNode[];
    isExpanded?: boolean;
    depth?: number;
}

export function FileViewer() {
    const { activeTabId, tabs } = useTabStore();
    const { content, type, isLoading, loadFile, clearContent, error } = useFileStore();

    const activeTab = tabs.find((tab: FileNode) => tab.id === activeTabId);

    useEffect(() => {
        if (activeTab) {
            loadFile(activeTab.path);
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
