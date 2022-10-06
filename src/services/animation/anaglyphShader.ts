import { GLSL3, Matrix3, ShaderMaterialParameters } from 'three'

export const AnaglyphShader: ShaderMaterialParameters = {
  glslVersion: GLSL3,

  uniforms: {
    tLeft: { value: null },
    tRight: { value: null },

    // Dubois matrices from https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.7.6968&rep=rep1&type=pdf#page=4
    colorMatrixLeft: {
      value: new Matrix3().fromArray([
        0.4561, -0.0400822, -0.0152161, 0.500484, -0.0378246, -0.0205971,
        0.176381, -0.0157589, -0.00546856,
      ]),
    },
    colorMatrixRight: {
      value: new Matrix3().fromArray([
        -0.0434706, 0.378476, -0.0721527, -0.0879388, 0.73364, -0.112961,
        -0.00155529, -0.0184503, 1.2264,
      ]),
    },
  },

  vertexShader: /* glsl */ `
    out vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tLeft;
    uniform sampler2D tRight;
    uniform mat3 colorMatrixLeft;
    uniform mat3 colorMatrixRight;

    in vec2 vUv;

    out vec4 fragColor;

    // These functions implement sRGB linearization and gamma correction

    float lin(float c) {
    	return c <= 0.04045 ? c * 0.0773993808 : pow(c * 0.9478672986 + 0.0521327014, 2.4);
    }

    vec4 lin(vec4 c) {
    	return vec4(lin(c.r), lin(c.g), lin(c.b), c.a);
    }

    float dev(float c) {
    	return c <= 0.0031308 ? c * 12.92 : pow(c, 0.41666) * 1.055 - 0.055;
    }

    void main() {
      vec4 colorLeft = lin(texture2D(tLeft, vUv));
      vec4 colorRight = lin(texture2D(tRight, vUv));

      vec3 color = clamp(
        colorMatrixLeft * colorLeft.rgb +
        colorMatrixRight * colorRight.rgb, 0., 1.
      );

      fragColor = vec4(
        dev(color.r), dev(color.g), dev(color.b),
        max(colorLeft.a, colorRight.a)
      );
    }
  `,
}
