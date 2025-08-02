import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay with environment variables
const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_AaXoLwVs0isbmk";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "07tAIwsgvSam2leJPhNA74tR";

console.log('🔧 [API] Razorpay Configuration:', {
  keyId: keyId,
  keySecret: keySecret ? `${keySecret.substring(0, 8)}...` : 'undefined',
  isProduction: keyId.startsWith('rzp_live_'),
  env: process.env.NODE_ENV
});

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate required fields
    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency,
      receipt: receipt,
      notes: notes || {},
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 