import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@/models': '/src/models',
      '@/views': '/src/views',
      '@/controllers': '/src/controllers',
      '@/components': '/src/components',
      '@/utils': '/src/utils'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps in production for smaller files
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for external libraries
          vendor: ['@types/uuid'],
          // Utils chunk for common utilities
          utils: ['src/utils/icons.ts', 'src/utils/Router.ts', 'src/utils/FavoriteManager.ts']
        },
        // Better asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') ?? [];
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    // Optimize chunks
    chunkSizeWarningLimit: 500, // Warning for chunks > 500kb
    // Enable compression
    reportCompressedSize: true
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    modules: false
  },
  // Enable optimization features
  optimizeDeps: {
    include: ['@types/uuid']
  }
})
