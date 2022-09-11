import { GLSL3, ShaderMaterialParameters } from 'three'

import { width } from './constants'

const diameter = width / 2
const radius = diameter / 2

export const DistortionShader: ShaderMaterialParameters = {
  glslVersion: GLSL3,

  uniforms: {
    tDiffuse: { value: null },
  },

  vertexShader: /* glsl */ `
    out vec2 vUv;

    const float k1 = 0.1;
    const float k2 = 0.03;

    void main() {
      vUv = uv;
      vec2 p = position.xy;
      float r2 = dot(p, p) / ${radius * radius}.0;
      float r4 = r2 * r2;
      vec2 d = p / (1.0 + k1 * r2 + k2 * r4);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(d, position.z, 1.0);
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
