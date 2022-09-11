import { GLSL3, ShaderMaterialParameters } from 'three'

import { width } from './constants'

export const DistortionShader: ShaderMaterialParameters = {
  glslVersion: GLSL3,

  uniforms: {
    tDiffuse: { value: null },
  },

  vertexShader: /* glsl */ `
    out vec2 vUv;

    void main() {
      vUv = uv;
      vec2 p = position.xy / ${width}.0;
      float d = 1.0 - dot(p, p) * 1.7;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position * d, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;

    in vec2 vUv;

    out vec4 fragColor;

    void main() {
      fragColor = texture2D(tDiffuse, vUv);
    }
  `,
}
