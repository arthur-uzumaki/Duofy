import type { FastifyTypedInstance } from '@/@types/types'
import { CreateOrdersUseCase } from '@/use-cases/create-orders-use-case'
import { authenticate } from '@/utils/authenticate'
import z from 'zod'

export async function createOrdersRoute(app: FastifyTypedInstance) {
  app.post(
    '/orders',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Order'],
        description: 'Create orders ',
        body: z.object({
          items: z
            .object({
              productId: z.string(),
              quantity: z.number().int().positive(),
            })
            .array(),
        }),
        response: {
          201: z.object({
            orderId: z.string().cuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { items } = request.body

      const createOrdersUseCase = new CreateOrdersUseCase()

      const result = await createOrdersUseCase.execute({ userId, items })
      const { orderId } = result

      return reply.status(201).send({ orderId })
    }
  )
}
