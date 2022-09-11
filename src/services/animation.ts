import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  VideoTexture,
  WebGLRenderer,
} from 'three'

const width = 1920
const height = 1080

type Eye = 0 | 1

const init = (scene: Scene, texture: VideoTexture, eye: Eye) => {
  const layer = eye + 1

  const camera = new PerspectiveCamera(67.5, width / 2 / height, 1, 2000)
  camera.layers.enable(layer)

  const geometry = new SphereGeometry(500, 32, 32, undefined, Math.PI)
  geometry.scale(-1, 1, 1)

  const uvs = geometry.attributes.uv
  for (let i = 0; i < uvs.count; i++) {
    uvs.setX(i, (uvs.getX(i) + eye) * 0.5)
  }

  const material = new MeshBasicMaterial({ map: texture })

  const mesh = new Mesh(geometry, material)
  mesh.rotation.y = Math.PI
  mesh.layers.set(layer)
  scene.add(mesh)

  return camera
}

const render = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera,
  eye: 0 | 1
) => {
  renderer.setScissor(eye * (width / 2), 0, width / 2, height)
  renderer.setViewport(eye * (width / 2), 0, width / 2, height)
  renderer.render(scene, camera)
}

export const start = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  const scene = new Scene()
  const texture = new VideoTexture(video)

  const leftCamera = init(scene, texture, 0)
  const rightCamera = init(scene, texture, 1)

  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize(width, height)

  renderer.setAnimationLoop(() => {
    renderer.setScissorTest(true)
    render(renderer, scene, leftCamera, 0)
    render(renderer, scene, rightCamera, 1)
    renderer.setScissorTest(false)
  })
  return renderer
}

export const stop = (renderer: WebGLRenderer | null) => {
  renderer?.setAnimationLoop(null)
}
