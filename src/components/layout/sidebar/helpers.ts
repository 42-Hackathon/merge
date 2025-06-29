import type { FolderItem } from './types';

export const addFolderToFolder = (
    items: FolderItem[],
    parentId: string,
    newFolder: Omit<FolderItem, 'id' | 'depth'>
): { updatedItems: FolderItem[]; newFolderId: string | null } => {
    let newFolderId: string | null = null;
    const newItems = items.map((item) => {
        if (item.id === parentId) {
            if (!item.children) {
                item.children = [];
            }
            const folderWithId: FolderItem = {
                ...newFolder,
                id: crypto.randomUUID(),
                depth: item.depth + 1,
                children: [],
            };
            newFolderId = folderWithId.id;
            return {
                ...item,
                children: [...item.children, folderWithId],
            };
        }
        if (item.children) {
            const result = addFolderToFolder(item.children, parentId, newFolder);
            if (result.newFolderId) {
                newFolderId = result.newFolderId;
            }
            return { ...item, children: result.updatedItems };
        }
        return item;
    });

    return { updatedItems: newItems, newFolderId };
};

export const generateUniqueName = (baseName: string, siblings: FolderItem[]): string => {
    let newName = baseName;
    let counter = 1;
    const siblingNames = new Set(siblings.map((s) => s.name));
    while (siblingNames.has(newName)) {
        newName = `${baseName} (${counter})`;
        counter++;
    }
    return newName;
};

export const getAllExpandableIds = (items: FolderItem[]): string[] => {
    const ids: string[] = [];
    items.forEach((item) => {
        if (item.children && item.children.length > 0) {
            ids.push(item.id, ...getAllExpandableIds(item.children));
        }
    });
    return ids;
};

export const findSiblings = (nodes: FolderItem[], itemId: string): FolderItem[] | null => {
    for (const node of nodes) {
        if (node.id === itemId) {
            // This is a root item, its siblings are the other root items
            return nodes.filter((n) => n.id !== itemId);
        }
        if (node.children) {
            if (node.children.some((child) => child.id === itemId)) {
                return node.children;
            }
            const result = findSiblings(node.children, itemId);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

export const removeFolderRecursively = (folders: FolderItem[], id: string): FolderItem[] => {
    return folders
        .filter((folder) => folder.id !== id)
        .map((folder) => {
            if (folder.children) {
                return { ...folder, children: removeFolderRecursively(folder.children, id) };
            }
            return folder;
        });
};

export const addFileToFolder = (
    items: FolderItem[],
    parentId: string,
    newFile: Omit<FolderItem, 'id' | 'depth'>
): { updatedItems: FolderItem[] } => {
    const newItems = items.map((item) => {
        if (item.id === parentId) {
            if (!item.children) {
                item.children = [];
            }
            const fileWithId: FolderItem = {
                ...newFile,
                id: crypto.randomUUID(),
                depth: item.depth + 1,
                children: undefined, // Files don't have children
            };
            return {
                ...item,
                children: [...item.children, fileWithId],
            };
        }
        if (item.children) {
            return {
                ...item,
                children: addFileToFolder(item.children, parentId, newFile).updatedItems,
            };
        }
        return item;
    });
    return { updatedItems: newItems };
};

export const renameItemRecursively = (
    items: FolderItem[],
    itemId: string,
    newName: string
): FolderItem[] => {
    return items.map((item) => {
        if (item.id === itemId) {
            return { ...item, name: newName };
        }
        if (item.children) {
            return { ...item, children: renameItemRecursively(item.children, itemId, newName) };
        }
        return item;
    });
};
