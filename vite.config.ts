import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 纯前端项目，不需要任何环境变量与后端代理配置
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 使用仓库子路径；本地开发仍从根路径启动。
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
})
