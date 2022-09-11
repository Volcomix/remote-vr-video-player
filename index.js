import { build } from 'esbuild'

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
        await fastify.close()

        // FIXME Reload after first request
        /** @type {import('./src/server')} */
        const { serve } = await import(`./out/server.js?ts=${Date.now()}`)
        fastify = await serve()
      }
    },
  },
})

console.log('watching...')

/** @type {import('./src/server')} */
const { serve } = await import(`./out/server.js?ts=${Date.now()}`)
let fastify = await serve()
