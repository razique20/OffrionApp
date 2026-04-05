import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { UserRole } from '@/lib/constants';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all admins and super_admins
    const admins = await User.find({ 
      role: { $in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] } 
    }).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, role, permissions } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      isActive: true
    });

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({ message: 'Admin account initialized', user: userObj }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
