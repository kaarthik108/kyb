"use server";

import { createClient } from '@/lib/supabase-ssr';
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

export async function startBrandAnalysis(brandData: { brand: string; location: string; category: string }) {
  try {
    const { brand, location, category } = brandData;
    const cacheKey = generateCacheKey(brand, location, category);
    
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return { success: true, data: cachedData, cached: true };
    }
    
    // Check if ENDPOINT_URL is configured
    if (!process.env.ENDPOINT_URL) {
      console.error('ENDPOINT_URL not configured');
      return {
        success: false,
        error: 'Backend endpoint not configured. Please set ENDPOINT_URL in your environment variables.'
      };
    }
    
    const sessionId = `session-${generateRandomId(12)}`;
    const userId = `user-${generateRandomId(8)}`;
    const question = `analyze the brand ${brand} ${location} ${category}`;
    
    const endpointUrl = process.env.ENDPOINT_URL + '/query';
    console.log('Calling backend:', endpointUrl);
    
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'brand-analytics-dashboard/1.0',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify({
        userId,
        sessionId,
        question,
        brand_name: brand
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    await response.json();
    
    return {
      success: true,
      data: { userId, sessionId, status: 'started' },
      cached: false
    };
    
  } catch (error) {
    console.error('startBrandAnalysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function checkDatabaseStatus(userId: string, sessionId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('brand_analysis_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function cacheResults(results: any, query: { brand: string; location: string; category: string }) {
  try {
    const { brand, location, category } = query;
    const cacheKey = generateCacheKey(brand, location, category);
    
    await redis.set(cacheKey, results, { ex: 3600 });
    return { success: true };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 