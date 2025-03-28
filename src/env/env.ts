import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string(),

  PORT: z.coerce.number().positive().default(3333),

  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  BASE_URL_WEB: z.string().url(),

  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
  RABBITMQ_URL: z.string().url(),

  MONGODB_ROOT_USER: z.string(),
  MONGODB_ROOT_PASSWORD: z.string(),
  MONGODB_DATABASE: z.string(),
  MONGODB_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
