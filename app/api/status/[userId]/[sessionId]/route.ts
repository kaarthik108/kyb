import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; sessionId: string } }
) {
  try {
    const { userId, sessionId } = params;
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing userId or sessionId' },
        { status: 400 }
      );
    }
    
    console.log('Checking status for:', { userId, sessionId });
    
    const response = await fetch(`${process.env.ENDPOINT_URL}/status/${userId}/${sessionId}`, {
      headers: {
        'User-Agent': 'brand-analytics-dashboard/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check analysis status', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 