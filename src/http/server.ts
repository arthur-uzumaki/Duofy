import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { env } from '@/env/env'
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { authenticateRoute } from './routes/authenticate-route'
import { createOrdersRoute } from './routes/create-orders-route'
import { getOrdersRoute } from './routes/get-orders-route'
import { registerUserRoute } from './routes/register-user-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, request, reply) => {
  console.error(error)
  reply.status(500).send({ message: 'Internal Server Error' })
})
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Teste Técnico Duofy',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors, {
  origin: env.BASE_URL_WEB,
})

app.register(registerUserRoute)
app.register(authenticateRoute)
app.register(getOrdersRoute)
app.register(createOrdersRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('Running server http://localhost:3333')
})

app.ready().then(() => {
  const spec = app.swagger()

  writeFile(
    resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(spec),
    'utf-8'
  )
})
