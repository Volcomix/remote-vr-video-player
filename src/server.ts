import Fastify from 'fastify'

export const serve = async () => {
  const fastify = Fastify({
    logger: true,
  })

  fastify.get('/', async () => {
    return { hello: 'world' }
  })

  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  return fastify
}
