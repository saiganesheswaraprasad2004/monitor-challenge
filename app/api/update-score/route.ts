export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req: Request) {
  try {
    const { email, score, time_taken } = await req.json();

    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db("quizDB");

    await db.collection("participants").updateOne(
      { email },
      { $set: { score, time_taken } }
    );

    await client.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
