import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Configuración de Vite para el frontend de Jesus Italian Food.
 *
 * - Servidor de desarrollo en el puerto 3001 (puerto fijo).
 * - Proxy: las peticiones a /api se reenvían al backend Express
 *   (http://localhost:3000) para que todo funcione sin bloqueos de CORS.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: false, // falla si el 3001 está ocupado, en vez de cambiar de puerto
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
