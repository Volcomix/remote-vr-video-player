import {
  Camera,
  GLSL3,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  ShaderMaterialParameters,
  SphereGeometry,
  VideoTexture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'

const width = 1920
const height = 1080

const init = (scene: Scene, texture: VideoTexture, layer: 1 | 2) => {
  const geometry = new SphereGeometry(500, 32, 32, undefined, Math.PI)
  geometry.scale(-1, 1, 1)

  const uvs = geometry.attributes.uv
  for (let i = 0; i < uvs.count; i++) {
    uvs.setX(i, (uvs.getX(i) + layer - 1) * 0.5)
  }

  const material = new MeshBasicMaterial({ map: texture })

  const mesh = new Mesh(geometry, material)
  mesh.rotation.y = Math.PI
  mesh.layers.set(layer)
  scene.add(mesh)

  const camera = new PerspectiveCamera(67.5, width / 2 / height, 1, 2000)
  camera.layers.enable(layer)

  return camera
}

const render = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  renderTarget: WebGLRenderTarget | null = null
) => {
  renderer.setRenderTarget(renderTarget)
  renderer.render(scene, camera)
}

const DistortionShader: ShaderMaterialParameters = {
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

export const start = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  const scene = new Scene()
  const texture = new VideoTexture(video)

  const leftCamera = init(scene, texture, 1)
  const rightCamera = init(scene, texture, 2)

  const leftRenderTarget = new WebGLRenderTarget(width / 2, height)
  const rightRenderTarget = new WebGLRenderTarget(width / 2, height)

  const leftPlane = new PlaneGeometry(width / 2, height, 16, 16)
  const leftMaterial = new ShaderMaterial(DistortionShader)
  const leftMesh = new Mesh(leftPlane, leftMaterial)
  leftMesh.layers.set(3)
  leftMesh.position.x = -width / 4
  leftMesh.onBeforeRender = () => {
    leftMaterial.uniforms.tDiffuse.value = leftRenderTarget.texture
  }
  scene.add(leftMesh)

  const rightPlane = new PlaneGeometry(width / 2, height, 16, 16)
  const rightMaterial = new ShaderMaterial(DistortionShader)
  const rightMesh = new Mesh(rightPlane, rightMaterial)
  rightMesh.layers.set(3)
  rightMesh.position.x = width / 4
  rightMesh.onBeforeRender = () => {
    rightMaterial.uniforms.tDiffuse.value = rightRenderTarget.texture
  }
  scene.add(rightMesh)

  const camera = new OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0,
    1
  )
  camera.layers.enable(3)

  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize(width, height)

  renderer.setAnimationLoop(() => {
    render(renderer, scene, leftCamera, leftRenderTarget)
    render(renderer, scene, rightCamera, rightRenderTarget)
    render(renderer, scene, camera)
  })
  return renderer
}

export const stop = (renderer: WebGLRenderer | null) => {
  renderer?.setAnimationLoop(null)
}
