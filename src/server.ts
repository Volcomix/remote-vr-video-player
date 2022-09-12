import websocketPlugin from '@fastify/websocket'
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true,
})

await fastify.register(websocketPlugin)

fastify.get('/', { websocket: true }, async (connection) => {
  connection.socket.send(JSON.stringify({ hello: 'world' }))
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
