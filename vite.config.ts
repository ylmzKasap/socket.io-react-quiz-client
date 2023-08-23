import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import viteTsconfigPaths from 'vite-tsconfig-paths';
/* import svgrPlugin from 'vite-plugin-svgr'; */

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), /* svgrPlugin(),  */
      ],
  server: {
    port: 3003,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/media': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'ws://localhost:3002',
        ws: true,
      }
    },
  },
  publicDir: '/public'
});
