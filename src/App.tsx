import CssBaseline from '@mui/material/CssBaseline'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles'
import { useCallback, useRef, useState } from 'react'
import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  VideoTexture,
  WebGLRenderer,
} from 'three'

import VideoDropzone from 'features/VideoDropzone'

import styles from './App.module.css'

const width = 1920
const height = 1080

const App = () => {
  const [videoUrl, setVideoUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const renderer = useRef<WebGLRenderer | null>(null)

  const init = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || !canvas) {
        renderer.current?.setAnimationLoop(null)
        renderer.current = null
        return
      }

      const scene = new Scene()
      const camera = new PerspectiveCamera(67.5, width / height, 1, 2000)

      const texture = new VideoTexture(video)

      const leftGeometry = new SphereGeometry(500, 64, 32)
      leftGeometry.scale(-1, 1, 1)
      const leftMaterial = new MeshBasicMaterial({ map: texture })
      const leftMesh = new Mesh(leftGeometry, leftMaterial)
      leftMesh.rotation.y = Math.PI
      scene.add(leftMesh)

      renderer.current = new WebGLRenderer({ canvas })
      renderer.current.setSize(width, height)

      renderer.current.setAnimationLoop(() => {
        renderer.current?.render(scene, camera)
      })
    },
    [canvas]
  )

  return (
    <>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <CssVarsProvider>
          <div className={styles.root}>
            <VideoDropzone
              onDrop={(file) => setVideoUrl(URL.createObjectURL(file))}
            />
            {videoUrl && (
              <>
                <video
                  className={styles.video}
                  ref={init}
                  src={videoUrl}
                  controls
                />
                <canvas className={styles.canvas} ref={setCanvas} />
              </>
            )}
          </div>
        </CssVarsProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
