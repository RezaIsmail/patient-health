import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@patient-health/types': path.resolve(__dirname, '../../packages/types/src/api.ts'),
      '@patient-health/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(''),
  },
})
