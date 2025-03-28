import { env } from '@/env/env'
import { RabbitmqServer } from '@/services/rabbitmq-server'
import { processOrder } from '@/utils/process-order'

export async function startConsumer() {
  const rabbitmqServer = new RabbitmqServer(env.RABBITMQ_URL)
  await rabbitmqServer.start()

  console.log('📡 Aguardando pedidos na fila...')

  await rabbitmqServer.consume('orders', async message => {
    const { orderId } = JSON.parse(message.content.toString())

    console.log(`📦 Processando pedido: ${orderId}`)
    await processOrder(orderId)
    console.log(`✅ Pedido ${orderId} processado com sucesso!`)
  })
}
