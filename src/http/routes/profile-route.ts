import type { FastifyTypedInstance } from '@/@types/types'
import { ProfileUseCase } from '@/use-cases/profile-use-case'
import { authenticate } from '@/utils/authenticate'
import z from 'zod'

export function profileRoute(app: FastifyTypedInstance) {
  app.get(
    '/me',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['User'],
        description: 'profile user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string().email(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const profileUseCase = new ProfileUseCase()
      const result = await profileUseCase.execute({ userId })

      const { user } = result

      return reply.status(200).send({ user })
    }
  )
}
