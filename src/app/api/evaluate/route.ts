import { NextRequest, NextResponse } from 'next/server';
import { PRACTICE_SCENARIOS } from '@/data/scenarios';
import { evaluatePracticeResponse } from '@/lib/evaluator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, userResponse, contextChoice } = body;

    if (!scenarioId || typeof userResponse !== 'string') {
      return NextResponse.json(
        { error: 'Missing scenarioId or userResponse in request body' },
        { status: 400 }
      );
    }

    const scenario = PRACTICE_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: `Scenario with id "${scenarioId}" not found` },
        { status: 404 }
      );
    }

    const feedback = await evaluatePracticeResponse(
      scenario,
      userResponse,
      contextChoice || ''
    );

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error: any) {
    console.error('Error in /api/evaluate:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to evaluate response' },
      { status: 500 }
    );
  }
}
