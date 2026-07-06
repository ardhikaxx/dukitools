import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ code: 'NO_INPUT', error: 'Mohon lengkapi seluruh field.' }, { status: 400 });
    }

    // In production: send email via Resend/SendGrid/etc.
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json({ success: true, message: 'Pesan berhasil dikirim.' });
  } catch {
    return NextResponse.json({ code: 'PROCESSING_FAILED', error: 'Gagal mengirim pesan.' }, { status: 500 });
  }
}
