import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  // 本地开发/本地预览时把 /api 转发到本地后端；
  // Docker 部署时由 Nginx 反向代理，前端与后端同源，无需该配置。
  const apiProxy = {
    '/api': {
      target: env.VITE_API_PROXY || 'http://localhost:4000',
      changeOrigin: true,
    },
  }

  return {
    plugins: [react()],
    // GitHub Pages 使用仓库子路径；本地开发与 Docker 部署都从根路径启动。
    base: env.VITE_BASE_PATH || '/',
    server: {
      port: 5173,
      open: false,
      proxy: apiProxy,
    },
    preview: {
      port: 4173,
      proxy: apiProxy,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
    },
  }
})
