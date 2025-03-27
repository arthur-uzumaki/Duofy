import type { FastifyTypedInstance } from '@/@types/types'
import { GetOrderDetailsUseCase } from '@/use-cases/get-order-details-use-case'
import { authenticate } from '@/utils/authenticate'
import z from 'zod'

export async function getOrderDetailsRoute(app: FastifyTypedInstance) {
  app.get(
    '/orders/:orderId',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Order'],
        description: 'Get order details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          orderId: z.string(),
        }),
        response: {
          200: z.object({
            order: z.object({
              id: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              status: z.string(),
              total: z.number(),
              _count: z.number(),
              items: z
                .object({
                  product: z.object({
                    name: z.string(),
                    price: z.number(),
                  }),
                })
                .array(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params
      const userId = request.user.sub

      const getOrderDetailsUseCase = new GetOrderDetailsUseCase()

      const result = await getOrderDetailsUseCase.execute({ orderId, userId })

      const { order } = result

      return reply.status(200).send({ order })
    }
  )
}
