"use server";

import { createClient } from '@/lib/supabase-ssr';
import { Redis } from '@upstash/redis';
import { generateRandomId, logWithContext, logEnvironmentInfo } from '@/lib/utils';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function generateCacheKey(brand: string, location: string, category: string): string {
  return `brand_analysis:${brand.toLowerCase()}:${location.toLowerCase()}:${category.toLowerCase()}`;
}

function logWithTimestamp(message: string, data?: any) {
  logWithContext('BRAND_ANALYSIS', message, data);
}

const Endpoint = process.env.ENDPOINT_URL!;

async function createSession(userId: string, sessionId: string) {
  const endpoint = `${Endpoint}/apps/mcp_brand_agent/users/${userId}/sessions/${sessionId}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ additionalProp1: {} }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 400 && errorText.includes('Session already exists')) {
      logWithTimestamp('Session already exists, continuing...');
      return true;
    }
    throw new Error(`Session creation failed: ${response.status}`);
  }

  const sessionData = await response.json();
  logWithTimestamp('Session created', { sessionId: sessionData.id });
  return true;
}

async function runAnalysis(userId: string, sessionId: string, brand: string) {
  const endpoint = `${Endpoint}/run`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'insomnia/11.2.0',
    },
    body: JSON.stringify({
      appName: "mcp_brand_agent",
      userId: userId,
      sessionId: sessionId,
      newMessage: {
        parts: [{ text: `analyze the brand ${brand}` }],
        role: "USER"
      },
      streaming: false
    }),
  });

  logWithTimestamp('Analysis started', { 
    status: response.status, 
    userId, 
    sessionId 
  });
  
  return response.ok;
}

async function getSessionStatus(userId: string, sessionId: string) {
  const endpoint = `${Endpoint}/apps/mcp_brand_agent/users/${userId}/sessions/${sessionId}`;
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'accept': 'application/json' }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  
  const hasResults = data.state && (
    data.state.final_news_results || 
    data.state.final_reddit_results || 
    data.state.final_twitter_results || 
    data.state.final_linkedin_results
  );

  if (hasResults) {
    const parseJson = (result: any) => {
      if (typeof result === 'string') {
        try { return JSON.parse(result); } 
        catch { return result; }
      }
      return result;
    };

    return {
      status: 'completed',
      results: {
        analysis_results_news: parseJson(data.state.final_news_results || data.state.news_results),
        analysis_results_reddit: parseJson(data.state.final_reddit_results || data.state.reddit_results),
        analysis_results_twitter: parseJson(data.state.final_twitter_results || data.state.twitter_results),
        analysis_results_linkedin: parseJson(data.state.final_linkedin_results || data.state.linkedin_results),
        userId: data.userId,
        sessionId: data.id
      }
    };
  }

  return { status: 'running' };
}



export async function startBrandAnalysis(brandData: { brand: string; location: string; category: string }) {
  const { brand: brandName, location, category } = brandData;
  const brand = brandName.toLowerCase();
  const loc = location.toLowerCase();
  const cat = category.toLowerCase();
  
  logWithTimestamp('Starting analysis', { brand, location, category });

  const predefinedBrands = ['tesla', 'apple', 'microsoft'];
  const isPredefined = predefinedBrands.includes(brand);

  if (isPredefined) {
    logWithTimestamp('Predefined brand - searching Supabase directly');
    
    try {
      const supabase = await createClient();
      const question = `analyze the brand ${brand} ${loc} ${cat}`;
      
      logWithTimestamp('Searching for question', { question });
      
      const { data, error } = await supabase
        .from('brand_analysis_requests')
        .select('*')
        .eq('question', question)
        .eq('status', 'completed')
        .order('updated_at', { ascending: true })
        .limit(1);

      if (error) {
        logWithTimestamp('Supabase error', { error: error.message });
        return { success: false, error: error.message };
      }

      if (data && data.length > 0) {
        const cached = data[0];
        logWithTimestamp('Found cached data', { 
          userId: cached.user_id, 
          sessionId: cached.session_id 
        });
        
        return {
          success: true,
          data: {
            results: cached.results,
            userId: cached.user_id,
            sessionId: cached.session_id
          },
          cached: true
        };
      }

      logWithTimestamp('No data found for question', { question });
      return {
        success: false,
        error: `${brandName} analysis not found in database`
      };
      
    } catch (error) {
      logWithTimestamp('Database error', { error: error instanceof Error ? error.message : 'Unknown' });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error'
      };
    }
  }

  const sessionId = `test_session_${generateRandomId(7)}`;
  const userId = `test_user_${generateRandomId(3)}`;

  try {
    await createSession(userId, sessionId);
    
    runAnalysis(userId, sessionId, brand).catch(error => {
      logWithTimestamp('Analysis error', { error: error.message });
    });

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
  logWithTimestamp('Checking status', { userId, sessionId });

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
      logWithTimestamp('Supabase error', { error: error.message });
      return { success: false, error: error.message };
    }

    if (data?.length > 0) {
      logWithTimestamp('Found record', { status: data[0].status });
      return { success: true, data: data[0] };
    }

    // Try API for new requests
    try {
      const apiStatus = await getSessionStatus(userId, sessionId);
      if (apiStatus) {
        return {
          success: true,
          data: {
            status: apiStatus.status,
            user_id: userId,
            session_id: sessionId,
            results: apiStatus.results,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      }
    } catch (apiError) {
      logWithTimestamp('API failed', { error: apiError instanceof Error ? apiError.message : 'Unknown' });
    }

    return {
      success: true,
      data: {
        status: 'pending',
        user_id: userId,
        session_id: sessionId
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function clearCache(brand: string, location: string, category: string) {
  logWithTimestamp('🗑️ Clearing cache', { brand, location, category });
  
  try {
    const cacheKey = generateCacheKey(brand, location, category);
    logWithTimestamp('🔑 Generated cache key', { cacheKey });
    
    await redis.del(cacheKey);
    logWithTimestamp('✅ Cache cleared successfully');
    
    return { success: true };
  } catch (error) {
    logWithTimestamp('❌ Failed to clear cache', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function cleanupOldAnalyses() {
  logWithTimestamp('🧹 Starting cleanup of old analyses');
  
  try {
    const supabase = await createClient();
    
    // Delete failed analyses older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    logWithTimestamp('🕐 Cleaning up failed analyses older than', { oneHourAgo });
    
    const { error } = await supabase
      .from('brand_analysis_requests')
      .delete()
      .eq('status', 'failed')
      .lt('created_at', oneHourAgo);
    
    if (error) {
      logWithTimestamp('❌ Error cleaning up old analyses', error);
      return { success: false, error: error.message };
    }
    
    logWithTimestamp('✅ Successfully cleaned up old analyses');
    return { success: true };
    
  } catch (error) {
    logWithTimestamp('💥 Cleanup failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 