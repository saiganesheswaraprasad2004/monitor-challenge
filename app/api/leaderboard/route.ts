export const runtime = "nodejs";

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("quizDB");

  const users = await db
    .collection("participants")
    .find({ payment_stat: true })
    .sort({ score: -1, time_taken: 1 })
    .toArray();

  return NextResponse.json(users);
}
