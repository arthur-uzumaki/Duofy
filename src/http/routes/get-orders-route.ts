import type { FastifyTypedInstance } from '@/@types/types'
import { GetOrdersUseCase } from '@/use-cases/get-orders-use-case'
import { authenticate } from '@/utils/authenticate'
import z from 'zod'

export async function getOrdersRoute(app: FastifyTypedInstance) {
  app.get(
    '/orders',
    {
      onRequest: [authenticate],
      schema: {
        tags: ['Order'],
        description: 'Get orders',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            orders: z
              .object({
                id: z.string(),
                status: z.string(),
                total: z.number().positive(),
                createdAt: z.date(),
                items: z
                  .object({
                    id: z.string(),
                    price: z.number().positive(),
                    quantity: z.number(),
                    product: z.object({
                      id: z.string(),
                      name: z.string(),
                      price: z.number().positive(),
                      createdAt: z.date(),
                    }),
                  })
                  .array(),
                _count: z.object({
                  items: z.number().int().positive(),
                }),
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const getOrdersUseCase = new GetOrdersUseCase()

      const { orders } = await getOrdersUseCase.execute({ userId })

      const formattedOrders = orders.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          price: item.price.toNumber(),
          product: {
            ...item.product,
            price: item.product.price.toNumber(),
          },
        })),
      }))

      return reply.status(200).send({ orders: formattedOrders })
    }
  )
}
