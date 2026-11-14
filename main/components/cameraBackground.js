// Camera backdrop projection.
//
// A normal camera image is a perspective view with a finite field of view.
// Mapping it straight onto the sphere's equirectangular UVs stretches those
// few degrees around the whole 360, which is what makes the feed feel zoomed
// in. This shader projects the feed by view direction instead, using a
// configurable horizontal field of view, so the image keeps its natural
// proportions and the zoom can be adjusted.
export const CAMERA_BG_SHADER = 'camera-background'
export const CAMERA_BASE_FOV = 70

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export const cameraFovForZoom = (zoom) => {
    const z = Number(zoom)
    return clamp(CAMERA_BASE_FOV * (isFinite(z) && z > 0 ? z : 1), 20, 360)
}

AFRAME.registerShader(CAMERA_BG_SHADER, {
    schema: {
        src: { type: 'map', is: 'uniform' },
        fov: { type: 'number', default: CAMERA_BASE_FOV, is: 'uniform' },
        aspect: { type: 'number', default: 16 / 9, is: 'uniform' },
        offset: { type: 'vec2', default: { x: 0, y: 0 }, is: 'uniform' },
        mirror: { type: 'number', default: 0, is: 'uniform' },
        dim: { type: 'number', default: 1, is: 'uniform' },
        bgColor: { type: 'color', default: '#808080', is: 'uniform' },
        feather: { type: 'number', default: 0.04, is: 'uniform' },
    },

    vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */ `
        uniform sampler2D src;
        uniform float fov;
        uniform float aspect;
        uniform vec2 offset;
        uniform float mirror;
        uniform float dim;
        uniform vec3 bgColor;
        uniform float feather;
        varying vec3 vDir;

        const float DEG2RAD = 0.017453292519943295;

        void main() {
            // 0 in front (-Z), positive to the right.
            float yaw = atan(vDir.x, -vDir.z);
            float pitch = asin(clamp(vDir.y, -1.0, 1.0));

            float hfov = max(fov * DEG2RAD, 0.001);
            float vfov = 2.0 * atan(tan(hfov * 0.5) / max(aspect, 0.001));

            vec2 q = vec2(yaw / hfov, pitch / vfov);
            if (mirror > 0.5) { q.x = -q.x; }

            vec2 uv = clamp(q + offset + 0.5, 0.0, 1.0);
            vec4 texel = texture2D(src, uv);

            // Soft edge instead of smearing the feed over the whole sphere.
            float edge = max(abs(q.x), abs(q.y));
            float soft = max(feather, 0.0001);
            float inside = 1.0 - smoothstep(0.5 - soft, 0.5, edge);

            vec3 color = mix(bgColor, texel.rgb * dim, inside);
            gl_FragColor = vec4(color, 1.0);
        }
    `,
})
