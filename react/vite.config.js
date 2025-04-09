import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),
    VitePWA({
      // Configurar opciones PWA
      manifest: {
        name: 'Bronzen App',
        short_name: 'Bronzen App',
        theme_color: '#ffffff',
        display: "standalone",
        icons: [
          {
            src: './icon-192x192.png', // Usa rutas relativas
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './icon-512x512.png', // Usa rutas relativas
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Configuración importante: asegura que los activos estén correctamente ubicados
      includeAssets: ['*.ico', '*.png', '*.svg'],
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
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
