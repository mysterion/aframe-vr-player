export const CHROMA_SHADER = 'chromakey'

AFRAME.registerShader(CHROMA_SHADER, {
    schema: {
        src: { type: 'map', is: 'uniform' },
        offset: { type: 'vec2', default: { x: 0, y: 0 }, is: 'uniform' },
        repeat: { type: 'vec2', default: { x: 1, y: 1 }, is: 'uniform' },
        keyColor: { type: 'color', default: '#00FF00', is: 'uniform' },
        similarity: { type: 'number', default: 0.35, is: 'uniform' },
        smoothness: { type: 'number', default: 0.12, is: 'uniform' },
        enabled: { type: 'number', default: 0, is: 'uniform' },
    },

    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */ `
        uniform sampler2D src;
        uniform vec2 offset;
        uniform vec2 repeat;
        uniform vec3 keyColor;
        uniform float similarity;
        uniform float smoothness;
        uniform float enabled;
        varying vec2 vUv;

        void main() {
            vec4 texel = texture2D(src, vUv * repeat + offset);

            float alpha = 1.0;
            if (enabled > 0.5) {
                float d = distance(texel.rgb, keyColor);
                float edge = max(smoothness, 0.0001);
                alpha = smoothstep(similarity, similarity + edge, d);
            }

            gl_FragColor = vec4(texel.rgb, texel.a * alpha);
        }
    `,
})
