import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from './_errors/unauthorized-error'

interface GetOrdersUseCaseRequest {
  userId: string
}

export class GetOrdersUseCase {
  async execute({ userId }: GetOrdersUseCaseRequest) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        _count: {
          select: {
            items: true,
          },
        },

        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                createdAt: true,
              },
            },
          },
        },
        total: true,
        createdAt: true,
      },
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { orders }
  }
}
