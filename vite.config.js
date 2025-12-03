import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export default defineConfig({
    server: {
        port: 3000,
        open: true,
        host: true,
        cors: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        minify: 'terser',
        target: 'es2020',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor chunks
                    if (id.includes('node_modules')) {
                        if (id.includes('wagmi') || id.includes('viem')) {
                            return 'web3-vendor'
                        }
                        if (id.includes('@reown') || id.includes('@walletconnect')) {
                            return 'wallet-vendor'
                        }
                        if (id.includes('chart.js')) {
                            return 'chart-vendor'
                        }
                        return 'vendor'
                    }

                    // Component chunks
                    if (id.includes('/src/components/')) {
                        return 'components'
                    }

                    // Page chunks
                    if (id.includes('/src/pages/')) {
                        return 'pages'
                    }

                    // Utility chunks
                    if (id.includes('/src/utils/')) {
                        return 'utils'
                    }
                },
                // Optimize chunk names
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
            }
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@components': resolve(__dirname, './src/components'),
            '@utils': resolve(__dirname, './src/utils'),
            '@pages': resolve(__dirname, './src/pages'),
            '@styles': resolve(__dirname, './src/styles'),
            '@contracts': resolve(__dirname, './src/contracts')
        }
    },
    optimizeDeps: {
        include: ['wagmi', 'viem', '@reown/appkit', 'chart.js'],
        exclude: []
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
})

