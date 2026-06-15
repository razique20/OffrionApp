import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Read config at RUNTIME (not build time). In Docker standalone, these come
// from env_file / the container environment when `node server.js` starts.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getCloudinaryConfig() {
  // IMPORTANT: do NOT read process.env.NEXT_PUBLIC_* here. Next.js statically
  // inlines NEXT_PUBLIC_* at build time (even in server code), so in Docker
  // standalone the value is frozen to whatever was present during `npm run
  // build` — empty if build args weren't passed. Use server-only vars, read
  // via the env object so they resolve at true runtime from the container env.
  const env = process.env;
  const cloudName =
    env.CLOUDINARY_CLOUD_NAME || env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'];
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  return { cloudName, apiKey, apiSecret };
}

export async function POST(request: NextRequest) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    // Logs the precise missing key server-side without leaking secrets.
    console.error('Cloudinary server config missing:', {
      hasCloudName: !!cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    });
    return NextResponse.json(
      { error: 'Image upload is not configured on the server.' },
      { status: 500 }
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get('file') as File | null;
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  // 5MB limit (matches the UI hint).
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 413 });
  }

  // Build a signed (authenticated) upload — no unsigned preset required.
  const timestamp = Math.round(Date.now() / 1000).toString();
  const paramsToSign = `timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  const uploadForm = new FormData();
  uploadForm.append('file', file);
  uploadForm.append('api_key', apiKey);
  uploadForm.append('timestamp', timestamp);
  uploadForm.append('signature', signature);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('Cloudinary upload failed:', data?.error);
      return NextResponse.json(
        { error: data?.error?.message || 'Upload failed.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ secure_url: data.secure_url }, { status: 200 });
  } catch (err) {
    console.error('Error proxying upload to Cloudinary:', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 502 });
  }
}
