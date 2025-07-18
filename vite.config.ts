import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Set base to '/kids/' for GitHub Pages deployment
export default defineConfig({
  base: '/kids/',
  plugins: [react()],
});
