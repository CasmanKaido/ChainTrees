import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['@reown/appkit', 'wagmi', 'viem'],
                    'charts': ['chart.js']
                }
            }
        }
    },
    optimizeDeps: {
        include: ['@reown/appkit', 'wagmi', 'viem']
    }
})
