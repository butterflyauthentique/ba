import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify signature using environment variable
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "07tAIwsgvSam2leJPhNA74tR";
    
    console.log('🔧 [API] Payment Verification:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      keySecret: keySecret ? `${keySecret.substring(0, 8)}...` : 'undefined',
      isProduction: keySecret !== "07tAIwsgvSam2leJPhNA74tR",
      env: process.env.NODE_ENV
    });
    
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isAuthentic = signature === razorpay_signature;

    if (isAuthentic) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Payment verification failed',
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 