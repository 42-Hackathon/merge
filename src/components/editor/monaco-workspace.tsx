import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Save, 
  Download, 
  Upload,
  FileText,
  Code,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MonacoWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MonacoWorkspace({ isOpen, onClose }: MonacoWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("editor");
  const [content, setContent] = useState("// Welcome to the Monaco Editor\n// Start typing your code here...\n\nfunction hello() {\n  console.log('Hello, World!');\n}");
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setEditorTheme(isDark ? "vs-dark" : "vs");

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? "vs-dark" : "vs");
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Editor Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed inset-4 z-50 bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl flex flex-col overflow-hidden"
          >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-black/10 dark:border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3 px-2">
                  <Code className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  <h2 className="text-zinc-800 dark:text-zinc-200 font-medium text-sm">Code Editor</h2>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 w-8 h-8">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 w-8 h-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 w-8 h-8">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 w-8 h-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
                  <TabsList className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 p-1 rounded-lg self-start">
                    <TabsTrigger value="editor" className="text-zinc-600 dark:text-zinc-300 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-black/20 data-[state=active]:text-zinc-800 dark:data-[state=active]:text-zinc-100 rounded-md px-3 py-1 text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-zinc-600 dark:text-zinc-300 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-black/20 data-[state=active]:text-zinc-800 dark:data-[state=active]:text-zinc-100 rounded-md px-3 py-1 text-sm">
                      <Code className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-zinc-600 dark:text-zinc-300 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-black/20 data-[state=active]:text-zinc-800 dark:data-[state=active]:text-zinc-100 rounded-md px-3 py-1 text-sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="flex-1 mt-4 overflow-hidden rounded-lg">
                     <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={content}
                        onChange={(value) => setContent(value || "")}
                        theme={editorTheme}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'off',
                          glyphMargin: false,
                          folding: false,
                          lineDecorationsWidth: 0,
                          lineNumbersMinChars: 0,
                          wordWrap: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="flex-1 mt-4 overflow-hidden">
                    <div className="h-full bg-black/5 dark:bg-white/5 rounded-lg p-4 text-zinc-800 dark:text-zinc-200 overflow-auto">
                      <h3 className="text-lg font-medium mb-4">Preview</h3>
                      <pre className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {content}
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="flex-1 mt-4 overflow-hidden">
                    <div className="h-full bg-black/5 dark:bg-white/5 rounded-lg p-4 text-zinc-800 dark:text-zinc-200">
                      <h3 className="text-lg font-medium mb-4">Editor Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-zinc-700 dark:text-zinc-300">Theme</label>
                          <select className="w-full mt-1 bg-white/10 border border-black/10 dark:border-white/20 rounded px-3 py-2 text-zinc-800 dark:text-zinc-200">
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-zinc-700 dark:text-zinc-300">Font Size</label>
                          <select className="w-full mt-1 bg-white/10 border border-black/10 dark:border-white/20 rounded px-3 py-2 text-zinc-800 dark:text-zinc-200">
                            <option value="12">12px</option>
                            <option value="14">14px</option>
                            <option value="16">16px</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}