import { useState, useCallback } from "react";
import { ContentItem } from "@/types/content";

export function useTabManager(initialTabs: ContentItem[] = []) {
  const [openTabs, setOpenTabs] = useState<ContentItem[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(initialTabs.length > 0 ? initialTabs[0].id : null);

  const handleItemSelect = useCallback((item: ContentItem) => {
    if (!openTabs.find(tab => tab.id === item.id)) {
      setOpenTabs(prevTabs => [...prevTabs, item]);
    }
    setActiveTabId(item.id);
  }, [openTabs]);

  const handleCloseTab = useCallback((tabId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else {
        setActiveTabId(null);
      }
    }
  }, [activeTabId, openTabs]);
  
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  return { openTabs, activeTabId, handleItemSelect, handleCloseTab, handleTabChange };
} 