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
    
    if (!process.env.ENDPOINT_URL) {
      return {
        success: false,
        error: 'Backend endpoint not configured. Please set ENDPOINT_URL in your environment variables.'
      };
    }
    // check if cached
    const cachedData = await redis.get(generateCacheKey(brand, location, category));
    if (cachedData) {
      console.log('Returning cached data')
      return {
        success: true,
        data: cachedData,
        cached: true
      };
    }
    const sessionId = `session-${Math.random().toString(36).substring(2, 14)}`;
    const userId = `user-${Math.random().toString(36).substring(2, 10)}`;
    const question = `analyze the brand ${brand} ${location} ${category}`;
    

    const endpointUrl = process.env.ENDPOINT_URL + '/query';
    
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
    
    const responseData = await response.json();
    console.log('REsponse data', JSON.stringify(responseData, null, 2))
    // add to cache
    await cacheResults(responseData, brandData);
    return {
      success: true,
      data: responseData
    };
    
  } catch (error) {
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

export async function clearCache(brand: string, location: string, category: string) {
  try {
    const cacheKey = generateCacheKey(brand, location, category);
    await redis.del(cacheKey);
    return { success: true };
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
    
    await redis.set(cacheKey, results, { ex: 86400 });
    return { success: true };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 