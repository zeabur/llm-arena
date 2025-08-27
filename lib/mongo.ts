import 'server-only';
import { MongoClient } from 'mongodb';

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as GlobalWithMongo;

const getMongoClient = async (): Promise<MongoClient> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI not set');
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri, { maxIdleTimeMS: 30000 });
    globalForMongo._mongoClientPromise = client.connect();
  }

  return globalForMongo._mongoClientPromise!;
};

export default getMongoClient;

export async function getDb(dbName: string = 'arena') {
  const client = await getMongoClient();

  return client.db(dbName);
}
