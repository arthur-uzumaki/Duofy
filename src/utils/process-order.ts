import { prisma } from '@/lib/prisma'
import { OrderLogService } from '@/services/order-log-service'
import { ResourceNotFound } from '@/use-cases/_errors/resource-not-found-error'

export async function processOrder(orderId: string) {
  const formattedOrderId = orderId.replace(/['"]+/g, '') // Remover aspas extras

  await OrderLogService.log({
    orderId: formattedOrderId,
    status: 'PROCESSANDO',
    message: 'Pedido recebido.',
  })

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: formattedOrderId },
    })
    console.log('Existing Order:', existingOrder)

    if (!existingOrder) {
      throw new ResourceNotFound(`Pedido ${formattedOrderId} não encontrado.`)
    }

    await prisma.order.update({
      where: { id: formattedOrderId },
      data: { status: 'PROCESSING' },
    })

    await new Promise(resolve => setTimeout(resolve, 3000))

    await prisma.order.update({
      where: { id: formattedOrderId },
      data: { status: 'COMPLETED' },
    })

    await OrderLogService.log({
      orderId: formattedOrderId,
      status: 'FINALIZADO',
      message: 'Pedido processado com sucesso.',
    })
  } catch (error) {
    await OrderLogService.log({
      orderId: formattedOrderId,
      status: 'ERRO',
      message: `Falha ao processar: ${error instanceof Error ? error.message : String(error)}`,
    })
  }
}
