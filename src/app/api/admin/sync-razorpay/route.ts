import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user is admin (you can customize this check)
    // For now, we'll assume any authenticated user can trigger sync
    // In production, you should verify admin role from Firestore
    
    const body = await request.json();
    const { startDate, endDate, orderId, importMissing } = body;

    // Call Firebase Function for sync
    const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-butterflyauthentique33.cloudfunctions.net';
    const syncUrl = `${functionsUrl}/syncOrdersWithRazorpay`;

    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ startDate, endDate, orderId, importMissing }),
    });

    const contentType = response.headers.get('content-type') || '';
    let result: any = null;
    let rawText: string | null = null;

    try {
      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        rawText = await response.text();
      }
    } catch (e) {
      rawText = rawText || '[non-JSON response]';
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: (result && result.error) || 'Sync failed', details: rawText || result },
        { status: response.status }
      );
    }

    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Sync endpoint returned non-JSON response', details: (rawText || '').slice(0, 400) },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin sync API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
