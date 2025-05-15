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
      
    })
  ],

})
