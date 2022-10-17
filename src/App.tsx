import FullscreenIcon from '@mui/icons-material/Fullscreen'
import PauseIcon from '@mui/icons-material/Pause'
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
  const video = useRef<HTMLVideoElement | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const renderer = useRef<WebGLRenderer | null>(null)
  const [playing, setPlaying] = useState(false)

  const updateVideo = useCallback(
    (element: HTMLVideoElement | null) => {
      video.current = element
      if (!element || !canvas) {
        animation.stop(renderer.current)
        renderer.current = null
        return
      }
      renderer.current = animation.start(element, canvas)
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
                    {playing ? (
                      <button
                        className={styles.control}
                        onClick={() => {
                          video.current?.pause()
                          setPlaying(false)
                        }}
                      >
                        <PauseIcon />
                      </button>
                    ) : (
                      <button
                        className={styles.control}
                        onClick={() => {
                          video.current?.play()
                          setPlaying(true)
                        }}
                      >
                        <PlayArrowIcon />
                      </button>
                    )}
                    <div></div>
                    <button className={styles.control}>
                      <FullscreenIcon />
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
