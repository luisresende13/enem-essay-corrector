import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processEssayOCR } from '@/lib/services/ocr';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { essayId } = body;

    if (!essayId) {
      return NextResponse.json(
        { error: 'Essay ID is required' },
        { status: 400 }
      );
    }

    // Fetch essay from database
    const { data: essay, error: fetchError } = await supabase
      .from('essays')
      .select('*')
      .eq('id', essayId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !essay) {
      return NextResponse.json(
        { error: 'Essay not found' },
        { status: 404 }
      );
    }

    // Check if already transcribed
    if (essay.transcription) {
      return NextResponse.json(
        { 
          message: 'Essay already transcribed',
          transcription: essay.transcription 
        },
        { status: 200 }
      );
    }

    // Process OCR
    console.log('Starting two-step OCR processing for essay:', essayId);
    const { rawTranscription, reconstructedTranscription } =
      await processEssayOCR(essayId, essay.image_url);
    console.log('OCR and reconstruction completed.');
    console.log('Raw transcription length:', rawTranscription.length);
    console.log(
      'Reconstructed transcription length:',
      reconstructedTranscription.length
    );

    // Update essay with both transcriptions
    console.log('Updating essay with raw and reconstructed transcriptions...');
    const { error: updateError } = await supabase
      .from('essays')
      .update({
        raw_transcription: rawTranscription, // Save the raw text
        transcription: reconstructedTranscription, // Save the corrected text
        status: 'transcribed',
      })
      .eq('id', essayId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Update transcription error:', updateError);
      throw new Error(
        `Failed to update transcription: ${updateError.message}`
      );
    }

    console.log('Database update completed successfully');

    return NextResponse.json(
      {
        success: true,
        transcription: reconstructedTranscription,
        message: 'Text extracted and reconstructed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OCR API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'OCR processing failed',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}