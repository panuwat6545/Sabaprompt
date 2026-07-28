import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID || ''),
      'process.env.VITE_DISCORD_WEBHOOK_URL': JSON.stringify(env.VITE_DISCORD_WEBHOOK_URL || env.DISCORD_WEBHOOK_URL || ''),
      'process.env.VITE_PROMPTPAY_ID': JSON.stringify(env.VITE_PROMPTPAY_ID || env.PROMPTPAY_ID || '0812345678'),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY || env.GOOGLE_API_KEY || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '')
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
          privacy: 'privacy.html',
          terms: 'terms.html'
        }
      }
    }
  };
});
