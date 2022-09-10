import CssBaseline from '@mui/material/CssBaseline'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles'

import VideoDropzone from 'features/VideoDropzone'

import styles from './App.module.css'

const App = () => {
  return (
    <>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <CssVarsProvider>
          <div className={styles.root}>
            <VideoDropzone />
          </div>
        </CssVarsProvider>
      </StyledEngineProvider>
    </>
  )
}

export default App
