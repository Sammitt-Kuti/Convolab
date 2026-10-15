import { NextRequest, NextResponse } from 'next/server';
import {
  saveResearchSession,
  getAllResearchSessions,
  getAggregatedMetrics,
  deleteResearchSession
} from '@/lib/storage';
import { ResearchSessionRecord } from '@/types';

function verifyAdminPasscode(req: NextRequest): boolean {
  const configuredPasscode = process.env.RESEARCH_PASSCODE?.trim() || 'convolab2025';
  const headerCode = req.headers.get('x-research-passcode')?.trim();
  const queryCode = req.nextUrl.searchParams.get('passcode')?.trim();

  return headerCode === configuredPasscode || queryCode === configuredPasscode;
}

export async function GET(req: NextRequest) {
  if (!verifyAdminPasscode(req)) {
    return NextResponse.json(
      { error: 'Unauthorized. Valid research passcode required.' },
      { status: 401 }
    );
  }

  const format = req.nextUrl.searchParams.get('format');
  const metrics = await getAggregatedMetrics();
  const sessions = await getAllResearchSessions();

  if (format === 'csv') {
    // Generate CSV for researchers to download directly
    const header = 'ParticipantId,Consented,CreatedAt,OnboardingCompleted,AssessmentCompleted,PracticesCompleted,RetriesCount\n';
    const rows = sessions
      .map(
        (s) =>
          `"${s.participantId}",${s.consented},"${s.createdAt}",${s.onboardingCompleted},${s.assessmentCompleted},${s.practiceAttempts?.length || 0},${s.retryCount || 0}`
      )
      .join('\n');

    return new NextResponse(header + rows, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="convolab_research_data.csv"'
      }
    });
  }

  return NextResponse.json({
    metrics,
    sessions
  });
}

export async function POST(req: NextRequest) {
  try {
    const session: ResearchSessionRecord = await req.json();

    if (!session || !session.participantId) {
      return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 });
    }

    // Only persist if participant consented
    if (session.consented) {
      await saveResearchSession(session);
    }

    return NextResponse.json({ success: true, stored: session.consented });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save session' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const participantId = req.nextUrl.searchParams.get('participantId');
    if (!participantId) {
      return NextResponse.json({ error: 'participantId is required' }, { status: 400 });
    }

    const deleted = await deleteResearchSession(participantId);
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete session' }, { status: 500 });
  }
}
