import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CssBaseline from '@mui/material/CssBaseline'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles'
import { useCallback, useRef, useState } from 'react'
import { WebGLRenderer } from 'three'

import VideoDropzone from 'features/VideoDropzone'
import * as animation from 'services/animation'

import styles from './App.module.css'

// TODO Use it and extract URL
const webSocket = new WebSocket('ws://localhost:3000')

const App = () => {
  const [videoUrl, setVideoUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)

  const updateVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || !canvas) {
        animation.stop(rendererRef.current)
        rendererRef.current = null
        return
      }
      rendererRef.current = animation.start(video, canvas)
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
                  ref={updateVideo}
                  src={videoUrl}
                  controls
                />
                <div className={styles.player}>
                  <canvas className={styles.canvas} ref={setCanvas} />
                  <div className={styles.controls}>
                    <button className={styles.control}>
                      <PlayArrowIcon />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CssVarsProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
