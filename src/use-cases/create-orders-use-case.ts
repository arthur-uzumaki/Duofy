import { env } from '@/env/env'
import { prisma } from '@/lib/prisma'
import { RabbitmqServer } from '@/services/rabbitmq-server'
import { ResourceNotFound } from './_errors/resource-not-found-error'
import { UnauthorizedError } from './_errors/unauthorized-error'

interface CreateOrdersUseCaseRequest {
  userId: string
  items: {
    productId: string
    quantity: number
  }[]
}

interface CreateOrdersUseCaseResponse {
  orderId: string
}

export class CreateOrdersUseCase {
  async execute({
    items,
    userId,
  }: CreateOrdersUseCaseRequest): Promise<CreateOrdersUseCaseResponse> {
    let total = 0
    const orderItems = []

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      })

      if (!product) {
        throw new ResourceNotFound(
          `Product with ID ${item.productId} not found`
        )
      }
      if (product.stock < item.quantity) {
        throw new ResourceNotFound(
          `Insufficient stock for product ${product.name}`
        )
      }
      total += product.price.toNumber() * item.quantity

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      })
    }
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    const rabbitmqServer = new RabbitmqServer(env.RABBITMQ_URL)
    await rabbitmqServer.start()

    await rabbitmqServer.publishInQueue(
      'orders',
      JSON.stringify({ orderId: order.id })
    )

    return { orderId: order.id }
  }
}
