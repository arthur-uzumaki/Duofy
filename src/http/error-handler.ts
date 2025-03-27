import { ResourceNotFound } from '@/use-cases/_errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/_errors/unauthorized-error'
import { UserAlreadyExistsError } from '@/use-cases/_errors/user-already-exists-error'
import { WrongCredentialsError } from '@/use-cases/_errors/wrong-credentials-error'
import type { FastifyInstance } from 'fastify'

type FastifyErrorHandle = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandle = (error, request, reply) => {
  if (error instanceof UnauthorizedError || error.statusCode === 401) {
    return reply.status(401).send({
      error: error.message,
    })
  }

  if (error instanceof ResourceNotFound) {
    return reply.status(404).send({
      error: error.message,
    })
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(400).send({
      error: error.message,
    })
  }

  if (error instanceof WrongCredentialsError) {
    return reply.status(404).send({
      error: error.message,
    })
  }
  return reply.status(500).send({ message: 'Internal server error!' })
}
