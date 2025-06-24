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
  };
});
