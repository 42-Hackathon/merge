import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Save, Settings, X, Code, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MonacoWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MonacoWorkspace({ isOpen, onClose }: MonacoWorkspaceProps) {
    const [content, setContent] = useState('// Type your code here...');
    const [editorTheme, setEditorTheme] = useState('vs-light');

    if (!isOpen) return null;

  return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-50 bg-zinc-100/60 backdrop-blur-2xl border border-black/10 rounded-2xl flex flex-col overflow-hidden"
          >
            <header className="flex items-center justify-between p-3 border-b border-black/10 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-zinc-600" />
                    <h2 className="text-zinc-800 font-medium text-sm">Code Editor</h2>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-zinc-600 hover:bg-black/10 w-8 h-8">
                    <Save className="h-4 w-4" />
                  </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-600 hover:bg-black/10 w-8 h-8">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-600 hover:bg-black/10 w-8 h-8">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-600 hover:bg-black/10 w-8 h-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
            </header>
            <main className="flex-grow flex p-3 gap-3 overflow-hidden">
                <Tabs defaultValue="editor" className="w-full flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <TabsList className="bg-black/5 border border-black/10 p-1 rounded-lg self-start">
                            <TabsTrigger value="editor" className="text-zinc-600 data-[state=active]:bg-white/80 data-[state=active]:text-zinc-800 rounded-md px-3 py-1 text-sm">
                      Editor
                    </TabsTrigger>
                            <TabsTrigger value="preview" className="text-zinc-600 data-[state=active]:bg-white/80 data-[state=active]:text-zinc-800 rounded-md px-3 py-1 text-sm">
                      Preview
                    </TabsTrigger>
                            <TabsTrigger value="settings" className="text-zinc-600 data-[state=active]:bg-white/80 data-[state=active]:text-zinc-800 rounded-md px-3 py-1 text-sm">
                      Settings
                    </TabsTrigger>
                  </TabsList>
                    </div>
                    <TabsContent value="editor" className="flex-grow rounded-lg overflow-hidden">
                     <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={content}
                            onChange={(value) => setContent(value || '')}
                        theme={editorTheme}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                  </TabsContent>
                    <TabsContent value="preview" className="flex-grow rounded-lg overflow-hidden">
                        <div className="h-full bg-black/5 rounded-lg p-4 text-zinc-800 overflow-auto">
                            <h3 className="font-bold text-lg mb-2">Preview</h3>
                            <pre className="text-sm text-zinc-700 whitespace-pre-wrap">{content}</pre>
                    </div>
                  </TabsContent>
                    <TabsContent value="settings" className="flex-grow rounded-lg overflow-hidden">
                        <div className="h-full bg-black/5 rounded-lg p-4 text-zinc-800">
                            <h3 className="font-bold text-lg mb-4">Editor Settings</h3>
                      <div className="space-y-4">
                        <div>
                                    <label className="text-sm text-zinc-700">Theme</label>
                                    <select
                                        className="w-full mt-1 bg-white/10 border border-black/10 rounded px-3 py-2 text-zinc-800"
                                        value={editorTheme}
                                        onChange={(e) => setEditorTheme(e.target.value)}
                                    >
                                        <option value="vs-light">Visual Studio Light</option>
                                        <option value="vs-dark">Visual Studio Dark</option>
                          </select>
                        </div>
                        <div>
                                    <label className="text-sm text-zinc-700">Font Size</label>
                                    <select className="w-full mt-1 bg-white/10 border border-black/10 rounded px-3 py-2 text-zinc-800">
                                        <option>12px</option>
                                        <option>14px</option>
                                        <option>16px</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
            </main>
          </motion.div>
  );
}