import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const data = await backendResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
