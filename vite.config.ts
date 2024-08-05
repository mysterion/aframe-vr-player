import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
    const config = {
        plugins: [
            basicSsl(),
        ],
        build: {
            assetsDir: 'static',

            rollupOptions: {
                output: {
                    manualChunks: () => null,
                    entryFileNames: 'static/[name].js',
                    chunkFileNames: 'static/[name].js',
                    assetFileNames: 'static/[name].[ext]',
                },
            }
        },
    }
    if (mode === "web") {
        config['base'] = '/aframe-vr-player/'

    }
    return config
})