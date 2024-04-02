import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
    const config = {
        plugins: [
            basicSsl(),
        ],
        build: {
            assetsDir: 'static',
        },
    }
    if (mode === "web") {
        config['base'] = '/aframe-vr-player/'

    }
    return config
})