import { NextRequest, NextResponse } from 'next/server';

// POST handler for auth logging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Auth log received:', body);
    
    // Simply acknowledge the log request
    return NextResponse.json({
      success: true,
      message: 'Log received',
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Auth log error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Log processing failed'
    }, { status: 500 });
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: 'Auth logging endpoint is active',
    timestamp: new Date().toISOString()
  });
}