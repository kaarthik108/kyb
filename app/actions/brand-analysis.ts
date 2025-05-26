"use server";

import { createClient } from '@/lib/supabase-ssr';
import { Redis } from '@upstash/redis';
import { generateRandomId } from '@/lib/utils';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function generateCacheKey(brand: string, location: string, category: string): string {
  return `brand_analysis:${brand.toLowerCase()}:${location.toLowerCase()}:${category.toLowerCase()}`;
}

export async function startBrandAnalysis(brandData: { brand: string; location: string; category: string }) {
  try {
    const { brand: brandName, location: locationName, category: categoryName } = brandData;
    const brand = brandName.toLowerCase();
    const location = locationName.toLowerCase();
    const category = categoryName.toLowerCase();
    
    // Check if cached first
    // const cachedData = await redis.get(generateCacheKey(brand, location, category));
    // if (cachedData) {
    //   console.log('Returning cached data');
    //   return {
    //     success: true,
    //     data: cachedData,
    //     cached: true
    //   };
    // }
    
    // Check if there's an existing analysis in progress or completed
    const supabase = await createClient();
    const expectedQuestion = `analyze the brand ${brand} ${location} ${category}`;
    const { data: existingAnalysis, error } = await supabase
      .from('brand_analysis_requests')
      .select('*')
      .eq('question', expectedQuestion)
      .in('status', ['pending', 'running', 'completed', 'failed'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error checking existing analysis:', error);
    }
    console.log('Existing analysis:\n\n\n', JSON.stringify(existingAnalysis, null, 2));

    // If we have a completed analysis, return it
    if (existingAnalysis && existingAnalysis.length > 0) {
      const existing = existingAnalysis[0];
      
      if (existing.status === 'completed' && existing.results) {
        console.log('Found completed analysis, returning results');
        return {
          success: true,
          data: {
            results: existing.results,
            userId: existing.user_id,
            sessionId: existing.session_id
          },
          cached: true
        };
      }
      
      // If analysis is in progress, return the existing session IDs for polling
      if (existing.status === 'pending' || existing.status === 'running') {
        console.log('Found analysis in progress, returning session IDs for polling');
        return {
          success: true,
          data: { 
            userId: existing.user_id, 
            sessionId: existing.session_id 
          },
          cached: false
        };
      }
    }
    
    if (!process.env.ENDPOINT_URL) {
      return {
        success: false,
        error: 'Backend endpoint not configured. Please set ENDPOINT_URL in your environment variables.'
      };
    }

    // Generate new session IDs only if no existing analysis found
    const sessionId = `session-${generateRandomId()}`;
    const userId = `user-${generateRandomId()}`;
    const question = `analyze the brand ${brand} ${location} ${category}`;
    
    const endpointUrl = process.env.ENDPOINT_URL + '/query';
    
    // Fire and forget - start the analysis without waiting
    fetch(endpointUrl, {
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
    }).catch(error => {
      console.error('Background API call failed:', error);
    });
    
    // Return immediately with polling identifiers
    return {
      success: true,
      data: { userId, sessionId },
      cached: false
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function checkAnalysisStatus(userId: string, sessionId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('brand_analysis_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // If no rows found, return pending status
    if (!data || data.length === 0) {
      return { 
        success: true, 
        data: { 
          status: 'pending',
          user_id: userId,
          session_id: sessionId
        } 
      };
    }
    
    // Return the most recent row
    return { success: true, data: data[0] };
    
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

// export async function cacheResults(results: any, query: { brand: string; location: string; category: string }) {
//   try {
//     const { brand, location, category } = query;
//     const cacheKey = generateCacheKey(brand, location, category);
    
//     await redis.set(cacheKey, results, { ex: 86400 });
//     return { success: true };
    
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//   }
// }

export async function cleanupOldAnalyses() {
  try {
    const supabase = await createClient();
    
    // Delete failed analyses older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { error } = await supabase
      .from('brand_analysis_requests')
      .delete()
      .eq('status', 'failed')
      .lt('created_at', oneHourAgo);
    
    if (error) {
      console.error('Error cleaning up old analyses:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 