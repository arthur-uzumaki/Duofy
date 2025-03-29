import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  const user = await prisma.user.create({
    data: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: await hash('123456', 8),
    },
  })
  const productData = Array.from({ length: 10 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 10, max: 500, dec: 2 }),
    stock: faker.number.int({ min: 1, max: 100 }),
  }))

  await prisma.product.createMany({ data: productData })
  const products = await prisma.product.findMany()

  const ordersToInsert = []
  const orderItemsToInsert: {
    orderId: string
    productId: string
    price: number
    quantity: number
  }[] = []

  for (let i = 0; i < 50; i++) {
    const orderProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 3,
    })
    let total = 0

    const order = {
      userId: user.id,
      status: faker.helpers.arrayElement([
        'PENDING',
        'PROCESSING',
        'COMPLETED',
        'CANCELLED',
        'FAILED',
      ]),
      total: 0,
    }

    const createdOrder = await prisma.order.create({ data: order })

    // biome-ignore lint/complexity/noForEach: <explanation>
    orderProducts.forEach(product => {
      const quantity = faker.number.int({ min: 1, max: 3 })
      const price = Number.parseFloat(product.price.toString())
      total += price * quantity

      orderItemsToInsert.push({
        orderId: createdOrder.id,
        productId: product.id,
        price,
        quantity,
      })
    })
    await prisma.order.update({
      where: { id: createdOrder.id },
      data: { total },
    })
  }
  await prisma.orderItem.createMany({ data: orderItemsToInsert })

  console.log('Database seeded successfully!')
}

seed()
  .catch(e => {
    console.log(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
