import { MongoClient, type Db } from "mongodb";

import { config } from "../config.js";

let client: MongoClient | undefined;
let database: Db | undefined;

export async function connectToDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  client = new MongoClient(config.mongodbUri);
  await client.connect();
  database = client.db(config.mongodbDb);
  await database.command({ ping: 1 });

  return database;
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error("MongoDB has not been connected yet");
  }

  return database;
}

export async function closeDatabase(): Promise<void> {
  await client?.close();
  client = undefined;
  database = undefined;
}
