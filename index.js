import { spawn } from 'child_process'

import { build } from 'esbuild'

const serve = () => spawn('node', ['./out/server.js'], { stdio: 'inherit' })

await build({
  entryPoints: ['src/server.ts'],
  outdir: 'out',
  watch: {
    onRebuild: async (error) => {
      if (error) {
        console.error('watch build failed:', error)
        return
      } else {
        console.log('watch build succeeded')
        server.kill()
        server = serve()
      }
    },
  },
})

console.log('watching...')
let server = serve()
