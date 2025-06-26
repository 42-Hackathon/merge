import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Folder, 
  FileText, 
  Image, 
  Link, 
  Calendar,
  Clock,
  Tag,
  Users,
  Settings
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface WorkspaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceSidebar({ isOpen, onClose }: WorkspaceSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 z-50"
          >
            <GlassCard className="h-full m-4 p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Workspace</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {/* Recent Activity */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/80 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">Added new note</p>
                          <p className="text-white/50 text-xs">2 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4 bg-white/20" />

                {/* Quick Stats */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/80 mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-white text-sm">Notes</span>
                      </div>
                      <p className="text-white font-semibold">124</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Image className="h-4 w-4 text-green-400" />
                        <span className="text-white text-sm">Images</span>
                      </div>
                      <p className="text-white font-semibold">67</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Link className="h-4 w-4 text-purple-400" />
                        <span className="text-white text-sm">Links</span>
                      </div>
                      <p className="text-white font-semibold">89</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Folder className="h-4 w-4 text-orange-400" />
                        <span className="text-white text-sm">Folders</span>
                      </div>
                      <p className="text-white font-semibold">12</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-white/20" />

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/80 mb-3">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['design', 'development', 'research', 'ideas', 'important'].map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-4 bg-white/20" />

                {/* Team */}
                <div>
                  <h3 className="text-sm font-medium text-white/80 mb-3">Team Members</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
                        <div className="flex-1">
                          <p className="text-white text-sm">Team Member {i + 1}</p>
                          <p className="text-white/50 text-xs">Online</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}