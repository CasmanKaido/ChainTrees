import { defineConfig } from 'vitest/config'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules/',
                'tests/',
                'dist/',
                'build/',
                '*.config.js',
                '*.config.cjs',
                'hardhat.config.cjs',
                'contracts/test/**',
                'contracts/scripts/**',
                'src/contracts/abis/**',
                '.eslintrc.js',
                'coverage/**'
            ],
            include: [
                'src/**/*.js'
            ],
            all: true,
            lines: 80,
            functions: 80,
            branches: 75,
            statements: 80,
            skipFull: false,
            clean: true
        },
        testTimeout: 10000,
        hookTimeout: 10000
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
    }
})
