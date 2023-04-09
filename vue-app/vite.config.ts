import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';

// https://vitejs.dev/config/
export default defineConfig({
  base:'app3',
  server: {
    port: 3003,
    cors: true,
    origin: 'http://localhost:3002'
  },
  plugins: [vue(), qiankun('app3', { // 配置qiankun插件
    useDevMode: true
  })],
})
