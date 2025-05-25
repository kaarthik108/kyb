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
    
    // Check cache first
    console.log('Checking cache for:', cacheKey);
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit! Returning cached data');
      return NextResponse.json(cachedData);
    }
    
    console.log('Cache miss. Making API request...');
    
    const sessionId = `session-${generateRandomId(12)}`;
    const userId = `user-${generateRandomId(8)}`;
    
    const question = `analyze the brand ${brand} ${location} ${category}`;
    
    console.log('Making API request with:', { userId, sessionId, question });
    
    const response = await fetch(process.env.ENDPOINT_URL + '/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'brand-analytics-dashboard/1.0',
      },
      body: JSON.stringify({
        userId,
        sessionId,
        question
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add metadata for dashboard tracking
    const enrichedData = {
      ...data,
      dashboardId: generateRandomId(16),
      generatedAt: new Date().toISOString(),
      query: { brand, location, category }
    };

    // Cache the result for 1 hour (3600 seconds)
    await redis.set(cacheKey, enrichedData, { ex: 3600 });
    console.log('Data cached successfully');

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze brand data' },
      { status: 500 }
    );
  }
} 