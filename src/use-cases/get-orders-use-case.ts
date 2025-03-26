import { prisma } from '@/lib/prisma'
import { UserAlreadyExistsError } from './_errors/user-already-exists-error'

interface GetOrdersUseCaseRequest {
  userId: string
}

export class GetOrdersUseCase {
  async execute({ userId }: GetOrdersUseCaseRequest) {
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
