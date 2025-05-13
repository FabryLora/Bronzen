import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),
    VitePWA({
      // Configurar opciones PWA
      manifest: {
        name: 'Bronzen App',
        short_name: 'Bronzen',
        description: "Descripción de tu aplicación",
        theme_color: '#ffffff',
        display: "standalone",
        icons: [
          {
            src: './icon-192x192.png', // Usa rutas relativas
            sizes: '192x192',
            type: 'image/png',
            purpose: "any maskable"
          },
          {
            src: './icon-512x512.png', // Usa rutas relativas
            sizes: '512x512',
            type: 'image/png',
            purpose: "any maskable"
          }
        ]
      },
      // Configuración importante: asegura que los activos estén correctamente ubicados
      includeAssets: ['*.ico', '*.png', '*.svg'],
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.bronzen\.osole\.com\.ar\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 semana
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],

  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Asegura que los recursos estáticos no sean procesados por el router
    assetsInlineLimit: 0
  }
})
