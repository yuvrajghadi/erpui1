import { NextRequest, NextResponse } from 'next/server';

// Mock session data for development
const mockSession = {
  user: {
    id: 'dev-user-1',
    name: 'Development User',
    email: 'dev@example.com',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  accessToken: 'mock-access-token-for-development',
};

// GET handler for session
export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Session API called');
    
    // In a real application, you would validate the session here
    // For development purposes, we'll return a mock session
    
    return NextResponse.json(mockSession, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Session API error:', error);
    
    return NextResponse.json({
      error: 'Session not found',
      message: 'No active session'
    }, { status: 401 });
  }
}

// POST handler for session updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔐 Session update requested:', body);
    
    // Return updated mock session
    return NextResponse.json({
      ...mockSession,
      lastUpdated: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Session update error:', error);
    
    return NextResponse.json({
      error: 'Session update failed',
      message: 'Could not update session'
    }, { status: 500 });
  }
}