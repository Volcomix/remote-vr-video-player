import {
  Camera,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  VideoTexture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'

import { AnaglyphShader } from './anaglyphShader'
import { height, width } from './constants'
import { DistortionShader } from './distortionShader'

type Eye = {
  camera: PerspectiveCamera
  renderTarget: WebGLRenderTarget
}

const initVideoSphere = (
  scene: Scene,
  texture: VideoTexture,
  layer: 1 | 2
): Eye => {
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

  const camera = new PerspectiveCamera(67.5, width / height, 1, 2000)
  camera.layers.enable(layer)

  const renderTarget = new WebGLRenderTarget(width, height)

  return { camera, renderTarget }
}

const initStereo = (scene: Scene, video: HTMLVideoElement) => {
  const texture = new VideoTexture(video)
  return {
    left: initVideoSphere(scene, texture, 1),
    right: initVideoSphere(scene, texture, 2),
  }
}

const initLens = (scene: Scene, eye: Eye, x: number) => {
  const plane = new PlaneGeometry(width / 2, height, 16, 16)
  const material = new ShaderMaterial(DistortionShader)

  const mesh = new Mesh(plane, material)
  mesh.layers.set(3)
  mesh.position.x = x

  mesh.onBeforeRender = () => {
    material.uniforms.tDiffuse.value = eye.renderTarget.texture
  }

  scene.add(mesh)
}

const initDistortion = (scene: Scene, left: Eye, right: Eye) => {
  initLens(scene, left, -width / 4)
  initLens(scene, right, width / 4)

  const camera = new OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0,
    1
  )
  camera.layers.enable(3)

  return { camera }
}

const initAnaglyph = (scene: Scene, left: Eye, right: Eye) => {
  const plane = new PlaneGeometry(width, height, 16, 16)
  const material = new ShaderMaterial(AnaglyphShader)

  const mesh = new Mesh(plane, material)
  mesh.layers.set(3)

  mesh.onBeforeRender = () => {
    material.uniforms.tLeft.value = left.renderTarget.texture
    material.uniforms.tRight.value = right.renderTarget.texture
  }

  scene.add(mesh)

  const camera = new OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0,
    1
  )
  camera.layers.enable(3)

  return { camera }
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

export const start = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  const scene = new Scene()

  const { left, right } = initStereo(scene, video)
  // const distortion = initDistortion(scene, left, right)
  const anaglyph = initAnaglyph(scene, left, right)

  const renderer = new WebGLRenderer({ canvas })
  renderer.setSize(width, height)

  renderer.setAnimationLoop(() => {
    render(renderer, scene, left.camera, left.renderTarget)
    render(renderer, scene, right.camera, right.renderTarget)
    // render(renderer, scene, distortion.camera)
    render(renderer, scene, anaglyph.camera)
  })

  return renderer
}

export const stop = (renderer: WebGLRenderer | null) => {
  renderer?.setAnimationLoop(null)
}
