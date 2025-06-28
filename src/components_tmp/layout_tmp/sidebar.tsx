import { motion } from "framer-motion";
import { 
  Folder, 
  FolderOpen, 
  Search, 
  Star, 
  Archive, 
  Tag,
  Plus,
  Settings,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Folder as FolderType } from "@/types/content";

interface SidebarProps {
  folders: FolderType[];
  selectedFolder?: string;
  onFolderSelect: (folderId: string) => void;
  onChatToggle: () => void;
  isChatOpen: boolean;
}

export function Sidebar({ folders, selectedFolder, onFolderSelect, onChatToggle, isChatOpen }: SidebarProps) {
  const defaultFolders = [
    { id: 'all', name: 'All Content', icon: Archive, count: 124 },
    { id: 'review', name: 'Review', icon: Star, count: 23 },
    { id: 'refine', name: 'Refine', icon: FolderOpen, count: 45 },
    { id: 'consolidate', name: 'Consolidate', icon: Folder, count: 56 },
  ];

  return (
    <motion.div
      className="w-72 h-full flex flex-col p-3 bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border-r border-black/10 dark:border-white/10"
      initial={{ x: -288 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Collections</h2>
        <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onChatToggle}
            className={`text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 h-8 w-8 rounded-lg ${isChatOpen ? 'bg-black/10 dark:bg-white/10' : ''}`}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 h-8 w-8 rounded-lg">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400 h-4 w-4" />
          <Input
            placeholder="Search collections..."
          className="pl-10 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-lg"
          />
        </div>

      <ScrollArea className="flex-1 -mr-3 pr-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 px-2">Quick Access</div>
            {defaultFolders.map((folder) => {
              const Icon = folder.icon;
            const isSelected = selectedFolder === folder.id;
              return (
                <Button
                  key={folder.id}
                variant="ghost"
                className={`w-full justify-start h-9 text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-md ${
                  isSelected ? 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-zinc-100' : ''
                  }`}
                  onClick={() => onFolderSelect(folder.id)}
                >
                <Icon className="h-4 w-4 mr-3 text-zinc-500 dark:text-zinc-400" />
                <span className="flex-1 text-left text-sm">{folder.name}</span>
                <Badge variant="secondary" className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-mono">
                    {folder.count}
                  </Badge>
                </Button>
              );
            })}

          <Separator className="my-3 bg-black/10 dark:bg-white/10" />

          <div className="flex items-center justify-between mb-2 px-2">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Custom Folders</div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10">
              <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

          {folders.map((folder) => {
            const isSelected = selectedFolder === folder.id;
            return (
              <Button
                key={folder.id}
              variant="ghost"
              className={`w-full justify-start h-9 text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-md ${
                isSelected ? 'bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-zinc-100' : ''
                }`}
                onClick={() => onFolderSelect(folder.id)}
              >
                <div 
                className="h-2 w-2 rounded-full mr-3"
                  style={{ backgroundColor: folder.color }}
                />
              <span className="flex-1 text-left text-sm">{folder.name}</span>
              <Badge variant="secondary" className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-mono">
                  {folder.itemCount}
                </Badge>
              </Button>
          )})}

          <Separator className="my-3 bg-black/10 dark:bg-white/10" />

          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 px-2">Smart Folders</div>
            <Button
              variant="ghost"
            className="w-full justify-start h-9 text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
            >
            <Tag className="h-4 w-4 mr-3 text-zinc-500 dark:text-zinc-400" />
            <span className="flex-1 text-left text-sm">Important</span>
            <Badge variant="secondary" className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-xs font-mono">
                12
              </Badge>
            </Button>
          </div>
        </ScrollArea>

      <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="flex -space-x-2 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white/30 dark:border-white/20 ring-1 ring-black/5"
                />
              ))}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">3 collaborators online</div>
        </div>
      </div>
    </motion.div>
  );
}