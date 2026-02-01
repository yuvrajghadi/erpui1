import { NextRequest, NextResponse } from 'next/server';
import { debugLogsEnabled } from '@/config';

const log = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.log(...args);
};

// Types for the create admin request
interface CreateAdminRequest {
  admin_username: string;
  admin_password: string;
  admin_email: string;
  status: 'active' | 'inactive';
  admin_roles: 'admin' | 'superadmin';
}

interface CreateAdminResponse {
  success: boolean;
  message: string;
  data?: {
    admin_id: string;
    admin_username: string;
    admin_email: string;
    status: string;
    admin_roles: string;
    created_at: string;
  };
  error?: string;
}

// POST handler for creating admin
export async function POST(request: NextRequest) {
  try {
    log('🔐 Create Admin API called');
    
    // Parse request body
    const body: CreateAdminRequest = await request.json();
    
    // Validate required fields
    const { admin_username, admin_password, admin_email, status, admin_roles } = body;
    
    if (!admin_username || !admin_password || !admin_email || !status || !admin_roles) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        error: 'All fields are required: admin_username, admin_password, admin_email, status, admin_roles'
      } as CreateAdminResponse, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(admin_email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format',
        error: 'Please provide a valid email address'
      } as CreateAdminResponse, { status: 400 });
    }
    
    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status',
        error: 'Status must be either "active" or "inactive"'
      } as CreateAdminResponse, { status: 400 });
    }
    
    // Validate admin roles
    if (!['admin', 'superadmin'].includes(admin_roles)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid admin role',
        error: 'Admin role must be either "admin" or "superadmin"'
      } as CreateAdminResponse, { status: 400 });
    }
    
    // Validate password strength (minimum 8 characters)
    if (admin_password.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'Password too weak',
        error: 'Password must be at least 8 characters long'
      } as CreateAdminResponse, { status: 400 });
    }
    
    log('✅ Creating admin with data:', {
      admin_username,
      admin_email,
      status,
      admin_roles
    });
    
    // TODO: In a real application, you would:
    // 1. Hash the password
    // 2. Check if username/email already exists
    // 3. Save to database
    // 4. Send confirmation email
    
    // For now, simulate successful creation
    const mockAdminData = {
      admin_id: `admin_${Date.now()}`,
      admin_username,
      admin_email,
      status,
      admin_roles,
      created_at: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      data: mockAdminData
    } as CreateAdminResponse, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Create Admin API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to create admin. Please try again later.'
    } as CreateAdminResponse, { status: 500 });
  }
}

// GET handler for retrieving admin list (optional)
export async function GET(request: NextRequest) {
  try {
    log('📋 Get Admins API called');
    
    // TODO: In a real application, you would fetch from database
    // For now, return empty array as placeholder
    
    return NextResponse.json({
      success: true,
      message: 'Admins retrieved successfully',
      data: []
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Get Admins API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to retrieve admins. Please try again later.'
    }, { status: 500 });
  }
}
