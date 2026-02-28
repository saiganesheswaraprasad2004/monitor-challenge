export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { MongoClient } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
      genre,
    } = body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false });
    }

    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db("quizDB");

    await db.collection("participants").updateOne(
      { email },
      {
        $set: {
          name,
          phone,
          genre,
          payment_stat: true,
          score: 0,
          time_taken: 0,
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    await client.close();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
