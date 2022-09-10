import Typography from '@mui/material/Typography'
import cx from 'classnames'
import { useDropzone } from 'react-dropzone'

import styles from './VideoDropzone.module.css'

type VideoDropzoneProps = {
  onDrop?: (file: File) => void
}

const VideoDropzone = ({ onDrop }: VideoDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => acceptedFiles.forEach((file) => onDrop?.(file)),
  })

  return (
    <div
      className={cx(styles.root, { [styles.dragActive]: isDragActive })}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Typography className={cx(styles.message, styles.dragMessage)}>
        {`Drag 'n' drop a video file here, or click to select file`}
      </Typography>
      <Typography className={cx(styles.message, styles.dropMessage)}>
        {`Drop the file here...`}
      </Typography>
    </div>
  )
}

export default VideoDropzone
