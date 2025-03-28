import { MongoDatabase } from '@/lib/mongo-database'

interface LogProps {
  orderId: string
  status: string
  message: string
}

export class OrderLogService {
  static async log({ orderId, status, message }: LogProps) {
    const db = await MongoDatabase.connect()
    const logs = db.collection('order_logs')

    await logs.insertOne({
      orderId,
      status,
      message,
      timestamp: new Date(),
    })
  }
}
