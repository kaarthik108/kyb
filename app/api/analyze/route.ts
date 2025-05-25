import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function generateRandomId(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateCacheKey(brand: string, location: string, category: string): string {
  return `brand_analysis:${brand.toLowerCase()}:${location.toLowerCase()}:${category.toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const { brand, location, category } = await request.json();
    
    const cacheKey = generateCacheKey(brand, location, category);
    
    console.log('Checking cache for:', cacheKey);
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit! Returning cached data');
      return NextResponse.json(cachedData);
    }
    
    console.log('Cache miss. Starting analysis...');
    
    const sessionId = `session-${generateRandomId(12)}`;
    const userId = `user-${generateRandomId(8)}`;
    
    const question = `analyze the brand ${brand} ${location} ${category}`;
    
    console.log('Starting analysis with:', { userId, sessionId, question });
    
    const response = await fetch(process.env.ENDPOINT_URL + '/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'brand-analytics-dashboard/1.0',
      },
      body: JSON.stringify({
        userId,
        sessionId,
        question,
        brand_name: brand
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start analysis: ${response.status}`);
    }

    const startResponse = await response.json();
    console.log('Analysis started:', startResponse);
    
    return NextResponse.json({
      userId,
      sessionId,
      status: 'started',
      message: 'Analysis started. Use polling to check progress.',
      cacheKey
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to start brand analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 