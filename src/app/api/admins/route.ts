import { NextRequest, NextResponse } from 'next/server';
import { getAllAdmins, addAdmin, removeAdmin, DEFAULT_ADMIN_EMAIL } from '@/lib/adminAuth';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

// Helper function to check if user is default admin
const isDefaultAdmin = (email: string | null): boolean => {
  return email === DEFAULT_ADMIN_EMAIL;
};

export async function GET() {
  try {
    const admins = await getAllAdmins();
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, currentUserEmail } = await request.json();

    // Check if current user is default admin
    if (!isDefaultAdmin(currentUserEmail)) {
      return NextResponse.json(
        { success: false, error: 'Only the default admin can add new admins' },
        { status: 403 }
      );
    }

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    if (email === DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Cannot add the default admin' },
        { status: 400 }
      );
    }

    const success = await addAdmin(email, name);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Admin added successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to add admin' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add admin' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email, currentUserEmail } = await request.json();

    // Check if current user is default admin
    if (!isDefaultAdmin(currentUserEmail)) {
      return NextResponse.json(
        { success: false, error: 'Only the default admin can remove admins' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (email === DEFAULT_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Cannot remove the default admin' },
        { status: 400 }
      );
    }

    const success = await removeAdmin(email);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Admin removed successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to remove admin' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error removing admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove admin' },
      { status: 500 }
    );
  }
} 