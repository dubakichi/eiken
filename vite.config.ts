/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages では https://dubakichi.github.io/eiken/ で公開する
export default defineConfig({
  base: '/eiken/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'えいけん4きゅう れんしゅう',
        short_name: 'えいけん4きゅう',
        description: '英検4級合格をめざす小学生向けの練習アプリ',
        lang: 'ja',
        theme_color: '#8e5ee0',
        background_color: '#f4f1ff',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
