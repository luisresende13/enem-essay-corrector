import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteImage } from '@/lib/services/storage';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
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

    // Get essay ID from params
    const { id: essayId } = await context.params;

    // Fetch essay to get image URL
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

    // Extract file path from image URL
    const imageUrl = essay.image_url;
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex((part: string) => part === 'essay-images');
    
    if (bucketIndex !== -1 && urlParts.length > bucketIndex + 1) {
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      // Delete image from storage
      try {
        await deleteImage(filePath);
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete essay from database (this will cascade delete evaluations)
    const { error: deleteError } = await supabase
      .from('essays')
      .delete()
      .eq('id', essayId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting essay:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete essay' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Essay deleted successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete essay API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to delete essay',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
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

    // Get essay ID from params
    const { id: essayId } = await context.params;

    // Fetch essay
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

    return NextResponse.json(essay, { status: 200 });
  } catch (error) {
    console.error('Get essay API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch essay',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}