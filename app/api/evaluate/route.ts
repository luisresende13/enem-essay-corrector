import { NextRequest, NextResponse } from 'next/server';
import { evaluateEssay } from '@/lib/services/evaluation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { essayId } = body;

    if (!essayId || typeof essayId !== 'string') {
      return NextResponse.json(
        { error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    // Evaluate the essay
    const evaluation = await evaluateEssay(essayId);

    return NextResponse.json({
      success: true,
      evaluation: {
        id: evaluation.id,
        essayId: evaluation.essay_id,
        overallScore: evaluation.overall_score,
        competencies: [
          {
            number: 1,
            title: 'Domínio da língua portuguesa',
            score: evaluation.competency_1_score,
            feedback: evaluation.competency_1_feedback,
          },
          {
            number: 2,
            title: 'Compreensão do tema',
            score: evaluation.competency_2_score,
            feedback: evaluation.competency_2_feedback,
          },
          {
            number: 3,
            title: 'Organização de informações',
            score: evaluation.competency_3_score,
            feedback: evaluation.competency_3_feedback,
          },
          {
            number: 4,
            title: 'Mecanismos linguísticos',
            score: evaluation.competency_4_score,
            feedback: evaluation.competency_4_feedback,
          },
          {
            number: 5,
            title: 'Proposta de intervenção',
            score: evaluation.competency_5_score,
            feedback: evaluation.competency_5_feedback,
          },
        ],
        generalFeedback: evaluation.general_feedback,
        createdAt: evaluation.created_at,
      },
    });
  } catch (error) {
    console.error('Evaluation API error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to evaluate essay';

    // Determine appropriate status code
    let statusCode = 500;
    if (errorMessage.includes('not authenticated')) {
      statusCode = 401;
    } else if (
      errorMessage.includes('not found') ||
      errorMessage.includes('access denied')
    ) {
      statusCode = 404;
    } else if (errorMessage.includes('must be transcribed')) {
      statusCode = 400;
    }

    return NextResponse.json(
      {
        error: 'Evaluation failed',
        message: errorMessage,
      },
      { status: statusCode }
    );
  }
}