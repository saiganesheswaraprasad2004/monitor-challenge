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

    // 🔒 Verify Razorpay signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // 🛢 Connect MongoDB directly (no shared client to avoid crash)
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db("quizDB");

    await db.collection("participants").insertOne({
      name,
      email,
      phone,
      genre,
      score: 0,
      time_taken: 0,
      payment_stat: true,
      created_at: new Date(),
    });

    await client.close();

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
