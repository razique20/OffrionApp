import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import APIKey from '@/models/APIKey';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = await APIKey.findOneAndDelete({ _id: id, partnerId: userId });
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'API Key deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = req.headers.get('x-user-id');
    const { id } = await params;
    const { isActive } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = await APIKey.findOneAndUpdate(
      { _id: id, partnerId: userId },
      { isActive },
      { new: true }
    );

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'API Key updated successfully', apiKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
