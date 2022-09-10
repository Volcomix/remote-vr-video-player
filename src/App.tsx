import CssBaseline from '@mui/material/CssBaseline'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles'
import { useState } from 'react'

import VideoDropzone from 'features/VideoDropzone'

import styles from './App.module.css'

const App = () => {
  const [videoUrl, setVideoUrl] = useState<string>()

  return (
    <>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <CssVarsProvider>
          <div className={styles.root}>
            <VideoDropzone
              onDrop={(file) => setVideoUrl(URL.createObjectURL(file))}
            />
            <video className={styles.video} src={videoUrl} controls />
          </div>
        </CssVarsProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
