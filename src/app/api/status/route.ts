import { NextResponse } from 'next/server';

export async function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY?.trim());
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

  return NextResponse.json({
    aiConfigured: hasKey,
    model: hasKey ? model : 'Demo Mode (Local Heuristic Engine)',
    mode: hasKey ? 'live_ai' : 'demo'
  });
}
