import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from './_errors/unauthorized-error'

interface ProfileUseCaseRequest {
  userId: string
}

interface ProfileUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
  }
}

export class ProfileUseCase {
  async execute({
    userId,
  }: ProfileUseCaseRequest): Promise<ProfileUseCaseResponse> {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    return { user }
  }
}
