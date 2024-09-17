import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macros from "vite-plugin-babel-macros"
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    define: {
        global: 'globalThis',
    },

    plugins: [
        nodePolyfills(),
        react({
            babel: {
                plugins: ["babel-plugin-macros"],
            },
        }),
        macros(),
    ],
    assetsInclude: ['**/*.bin', '**/*.glb', "**/*.dds"],
    server: {
        open: true,
        port: 3000,
    },
    worker: {
        format: 'es', // Ensures worker files are treated as ES modules
    },
})