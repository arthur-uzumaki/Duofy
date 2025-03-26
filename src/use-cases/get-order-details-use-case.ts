import { prisma } from '@/lib/prisma'
import { ResourceNotFound } from './_errors/resource-not-found-error'
import { UnauthorizedError } from './_errors/unauthorized-error'

interface GetOrderDetailsUseCaseRequest {
  userId: string
  orderId: string
}

interface GetOrderDetailsUseCaseResponse {
  order: {
    id: string
    createdAt: Date
    updatedAt: Date
    status: string
    total: number
    _count: number
    items: {
      product: {
        name: string
        price: number
      }
    }[]
  }
}

export class GetOrderDetailsUseCase {
  async execute({
    orderId,
    userId,
  }: GetOrderDetailsUseCaseRequest): Promise<GetOrderDetailsUseCaseResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    const order = await prisma.order.findUnique({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        total: true,
        _count: true,
        items: {
          select: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      where: {
        id: orderId,
      },
    })

    if (!order) {
      throw new ResourceNotFound('Order not found.')
    }

    return {
      order: {
        id: order.id,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        status: order.status.toString(),
        total: Number(order.total),
        _count: order._count.items,
        items: order.items.map(item => ({
          product: {
            name: item.product.name,
            price: Number(item.product.price),
          },
        })),
      },
    }
  }
}
