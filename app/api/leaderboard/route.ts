export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();

  const db = client.db("quizDB");

  const users = await db
    .collection("participants")
    .find({ payment_stat: true })
    .sort({ score: -1, time_taken: 1 })
    .toArray();

  await client.close();

  return NextResponse.json(users);
}
