import type { FastifyTypedInstance } from '@/@types/types'
import { AuthenticateUseCase } from '@/use-cases/authenticate-use-case'
import { RegisterUserUseCase } from '@/use-cases/register-user-use-case'
import z from 'zod'

export async function authenticateRoute(app: FastifyTypedInstance) {
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['User'],
        description: 'Authenticate user in the system',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            access_token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const authenticateUseCase = new AuthenticateUseCase(app)

      const result = await authenticateUseCase.execute({ email, password })

      const { accessToken } = result

      return reply.status(200).send({ access_token: accessToken })
    }
  )
}
