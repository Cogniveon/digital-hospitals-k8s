import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      //   '/foo': 'http://localhost:4567',
      //   '/api': {
      //     target: 'http://jsonplaceholder.typicode.com',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      //   // with RegEx: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      //   '^/fallback/.*': {
      //     target: 'http://jsonplaceholder.typicode.com',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/fallback/, ''),
      //   },
      //   // Using the proxy instance
      //   '/api': {
      //     target: 'http://jsonplaceholder.typicode.com',
      //     changeOrigin: true,
      //     configure: (proxy, options) => {
      //       // proxy will be an instance of 'http-proxy'
      //     },
      //   },
      //   // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      //   '/socket.io': {
      //     target: 'ws://localhost:5174',
      //     ws: true,
      //   },
    },
  },
});
