import { Db, Logger, MongoClient } from "mongodb";

let db: Db = null;

export async function initDb(): Promise<void> {
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  db = client.db();
  console.log("Connected succesfully to MongoDB database...");
}

export function getDb(): Db {
  if (!db) {
    throw Error("Db is not initialized. Initialize with initDb()");
  }
  return db;
}
