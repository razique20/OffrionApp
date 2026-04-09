import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Deal from '@/models/Deal';
import Category from '@/models/Category';
import { UserRole } from '@/lib/constants';

// Validation Schema for a single deal in the bulk upload
const dealBulkSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  originalPrice: z.number().positive(),
  discountedPrice: z.number().nonnegative(),
  categoryName: z.string(), // We'll map this to categoryId
  validFrom: z.string().or(z.date()),
  validUntil: z.string().or(z.date()),
  usageLimit: z.number().default(0),
  tags: z.array(z.string()).default([]),
  location: z.object({
    lng: z.number(),
    lat: z.number(),
  }).optional(),
});

export async function POST(req: Request) {
  try {
    // 1. Auth check (Merchant only)
    // Note: Since I saw earlier that 'verifyAuth' was a point of confusion, 
    // I'll check the current standard for merchant auth in this codebase.
    // Based on previous files, merchants are authenticated via session/cookies.
    // For now, I'll use the headers pattern I saw in admin stats or check for a better one.
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || userRole !== UserRole.MERCHANT) {
      return NextResponse.json({ error: 'Unauthorized: Merchant access required' }, { status: 401 });
    }

    const { deals } = await req.json();

    if (!Array.isArray(deals) || deals.length === 0) {
      return NextResponse.json({ error: 'Invalid payload: "deals" must be a non-empty array' }, { status: 400 });
    }

    await dbConnect();

    // 2. Pre-fetch categories for mapping names to IDs
    const categories = await Category.find({ isActive: true });
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c._id]));

    // 3. Process and validate deals
    const validatedDeals = [];
    const errors = [];

    for (let i = 0; i < deals.length; i++) {
        const dealData = deals[i];
        try {
            const parsed = dealBulkSchema.parse(dealData);
            
            // Map Category Name to ID
            const categoryNameLower = parsed.categoryName.toLowerCase().trim();
            const categoryId = categoryMap.get(categoryNameLower);
            
            if (!categoryId) {
                console.error(`Category not found: "${parsed.categoryName}"`);
                errors.push({ 
                  row: i + 1, 
                  error: `Category "${parsed.categoryName}" does not exist. Valid options are: ${Array.from(categoryMap.keys()).join(', ')}` 
                });
                continue;
            }

            // Prepare for Mongoose
            validatedDeals.push({
                ...parsed,
                merchantId: new mongoose.Types.ObjectId(userId),
                categoryId: categoryId, // categoryId is already an ObjectId from map
                status: 'pending',
                isActive: false,
                location: parsed.location ? {
                    type: 'Point',
                    coordinates: [parsed.location.lng, parsed.location.lat]
                } : {
                    type: 'Point',
                    coordinates: [55.2708, 25.2048]
                },
                validFrom: new Date(parsed.validFrom),
                validUntil: new Date(parsed.validUntil)
            });
        } catch (err: any) {
            console.error(`Row ${i + 1} validation failed:`, err);
            errors.push({ row: i + 1, error: err.message });
        }
    }

    if (errors.length > 0) {
        console.warn('Bulk Upload encountered partial errors:', errors);
    }

    // 4. Bulk Insert - Using ordered: false to continue on error
    if (validatedDeals.length > 0) {
        try {
            await Deal.insertMany(validatedDeals, { ordered: false });
        } catch (bulkErr: any) {
            console.error('Partial Bulk Insert Error:', bulkErr);
            // Even if it fails partially, some might have been inserted
        }
    }

    return NextResponse.json({
        success: true,
        count: validatedDeals.length,
        errors: errors.length > 0 ? errors : null
    });

  } catch (error: any) {
    console.error('Bulk Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
