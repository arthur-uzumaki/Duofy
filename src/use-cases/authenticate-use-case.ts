import type { FastifyTypedInstance } from '@/@types/types'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'
import { WrongCredentialsError } from './_errors/wrong-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
}

export class AuthenticateUseCase {
  constructor(private readonly app: FastifyTypedInstance) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new WrongCredentialsError()
    }

    const isPassword = await compare(password, user.password)

    if (!isPassword) {
      throw new WrongCredentialsError()
    }

    const accessToken = this.app.jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      {
        sub: user.id,
      }
    )
    return { accessToken }
  }
}
