import dbConnect from './mongodb';
import User from '@/models/User';

/**
 * Checks if a user has a specific administrative permission.
 * Super Admins automatically bypass all checks.
 */
export async function checkAdminPermission(userId: string | null, requiredPermission: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    await dbConnect();
    const user = await User.findById(userId);
    
    if (!user) return false;
    
    // 1. Super Admin Bypass
    if (user.role === 'super_admin') return true;
    
    // 2. Standard Admin Check
    if (user.role !== 'admin') return false;
    
    // 3. Permission Array Check
    return user.permissions?.includes(requiredPermission) || false;
    
  } catch (error) {
    console.error('Permission Check Error:', error);
    return false;
  }
}
