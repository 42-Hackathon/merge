import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig(async () => {
  const { default: tailwindcss } = await import('@tailwindcss/vite');
  const { default: react } = await import('@vitejs/plugin-react');
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
       },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-avatar', '@radix-ui/react-tabs', '@radix-ui/react-select'],
            editor: ['@monaco-editor/react', '@tiptap/react', '@tiptap/core'],
            utils: ['clsx', 'tailwind-merge', 'framer-motion']
          }
        }
      }
    },
  };
});
