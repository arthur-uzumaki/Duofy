import { env } from '@/env/env'
import { MongoClient } from 'mongodb'

export class MongoDatabase {
  private static client: MongoClient

  static async connect() {
    if (!this.client) {
      this.client = new MongoClient(env.MONGODB_URL)
      await this.client.connect()
    }

    return this.client.db(env.MONGODB_DATABASE)
  }
}
