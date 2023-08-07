import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
    // Required for Github-Pages:
    base: "/React-Notes",
    plugins: [react()],
    css: {
        devSourcemap: true,
        postcss: {
            plugins: [autoprefixer]
        }
    }
})
