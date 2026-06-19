import { defineConfig } from 'vite'

export default defineConfig({
    // ponytail: '/' for self-hosted, '/profile/' injected by build:pages for GitHub Pages
    base: process.env.VITE_BASE || '/',
})
