import type { FastifyTypedInstance } from '@/@types/types'
import { RegisterUserUseCase } from '@/use-cases/register-user-use-case'
import z from 'zod'

export async function registerUserRoute(app: FastifyTypedInstance) {
  app.post(
    '/accounts',
    {
      schema: {
        tags: ['User'],
        description: 'Register user in the system',
        body: z.object({
          name: z.string().min(3, 'At least 3 characters.'),
          email: z.string().email('E-mail invalid.'),
          password: z.string().min(6, 'At least 6 characters.'),
        }),
        response: {
          201: z.unknown(),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body

      const registerUseCase = new RegisterUserUseCase()

      await registerUseCase.execute({ email, name, password })

      return reply.status(204).send({})
    }
  )
}
