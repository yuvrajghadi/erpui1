import { NextRequest, NextResponse } from 'next/server';
import { debugLogsEnabled } from '@/config';

const log = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.log(...args);
};

// Types for the admin login request
interface AdminLoginRequest {
  admin_username: string;
  admin_password: string;
}

interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: {
    admin_id: string;
    admin_username: string;
    admin_email: string;
    admin_roles: string;
    status: string;
    token?: string;
    last_login: string;
  };
  error?: string;
}

// POST handler for admin login
export async function POST(request: NextRequest) {
  try {
    log('🔐 Admin Login API called');
    
    // Parse request body
    const body: AdminLoginRequest = await request.json();
    
    // Validate required fields
    const { admin_username, admin_password } = body;
    
    if (!admin_username || !admin_password) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        error: 'Both admin_username and admin_password are required'
      } as AdminLoginResponse, { status: 400 });
    }
    
    // Validate username format (can be email or username)
    if (admin_username.length < 3) {
      return NextResponse.json({
        success: false,
        message: 'Invalid username',
        error: 'Username must be at least 3 characters long'
      } as AdminLoginResponse, { status: 400 });
    }
    
    // Validate password
    if (admin_password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Invalid password',
        error: 'Password must be at least 6 characters long'
      } as AdminLoginResponse, { status: 400 });
    }
    
    log('✅ Authenticating admin:', { admin_username });
    
    // TODO: In a real application, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Check if admin exists in database
    // 3. Verify admin status (active/inactive)
    // 4. Generate JWT token
    // 5. Update last_login timestamp
    // 6. Log login attempt
    
    // For demo purposes, check against demo credentials
    const isDemoLogin = (
      (admin_username === 'admin@erp.com' || admin_username === 'admin') && 
      admin_password === 'admin123'
    ) || (
      (admin_username === 'superadmin@erp.com' || admin_username === 'superadmin') && 
      admin_password === 'super123'
    );
    
    if (!isDemoLogin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
        error: 'Username or password is incorrect'
      } as AdminLoginResponse, { status: 401 });
    }
    
    // Determine admin role based on username
    const isSuper = admin_username.includes('super');
    
    // Mock successful login data
    const mockAdminData = {
      admin_id: isSuper ? 'admin_super_001' : 'admin_001',
      admin_username: admin_username,
      admin_email: admin_username.includes('@') ? admin_username : `${admin_username}@erp.com`,
      admin_roles: isSuper ? 'superadmin' : 'admin',
      status: 'active',
      token: `mock_jwt_token_${Date.now()}`, // In real app, generate proper JWT
      last_login: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    log('✅ Admin login successful:', {
      admin_id: mockAdminData.admin_id,
      admin_username: mockAdminData.admin_username,
      admin_roles: mockAdminData.admin_roles
    });
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: mockAdminData
    } as AdminLoginResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Admin Login API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to process login. Please try again later.'
    } as AdminLoginResponse, { status: 500 });
  }
}

// GET handler for checking login status (optional)
export async function GET(request: NextRequest) {
  try {
    log('📋 Check Admin Login Status API called');
    
    // TODO: In a real application, you would:
    // 1. Verify JWT token from Authorization header
    // 2. Check if token is valid and not expired
    // 3. Return admin info if authenticated
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized',
        error: 'No valid authorization token provided'
      }, { status: 401 });
    }
    
    // For demo, just return mock data if token exists
    const token = authHeader.replace('Bearer ', '');
    
    if (token.startsWith('mock_jwt_token_')) {
      return NextResponse.json({
        success: true,
        message: 'Admin is authenticated',
        data: {
          admin_id: 'admin_001',
          admin_username: 'admin',
          admin_email: 'admin@erp.com',
          admin_roles: 'admin',
          status: 'active',
          last_login: new Date().toISOString()
        }
      }, { status: 200 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid token',
      error: 'Token is invalid or expired'
    }, { status: 401 });
    
  } catch (error) {
    console.error('❌ Check Admin Login Status API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to check login status. Please try again later.'
    }, { status: 500 });
  }
}
