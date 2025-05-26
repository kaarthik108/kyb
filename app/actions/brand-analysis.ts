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

export async function startBrandAnalysis(brandData: { brand: string; location: string; category: string }) {
  const startTime = Date.now();
  
  // Log environment info on first call
  logEnvironmentInfo();
  
  logWithTimestamp('🚀 Starting brand analysis', { 
    brandData, 
    environment: process.env.NODE_ENV,
    endpointUrl: process.env.ENDPOINT_URL ? 'configured' : 'missing',
    apiToken: process.env.API_TOKEN ? 'configured' : 'missing'
  });

  try {
    const { brand: brandName, location: locationName, category: categoryName } = brandData;
    const brand = brandName.toLowerCase();
    const location = locationName.toLowerCase();
    const category = categoryName.toLowerCase();
    
    logWithTimestamp('📝 Processed input data', { brand, location, category });
    
    // Check if there's an existing analysis in progress or completed
    logWithTimestamp('🔍 Creating Supabase client...');
    const supabase = await createClient();
    logWithTimestamp('✅ Supabase client created successfully');
    
    const expectedQuestion = `analyze the brand ${brand} ${location} ${category}`;
    logWithTimestamp('🔎 Checking for existing analysis', { expectedQuestion });
    
    const queryStart = Date.now();
    const { data: existingAnalysis, error } = await supabase
      .from('brand_analysis_requests')
      .select('*')
      .eq('question', expectedQuestion)
      .in('status', ['pending', 'running', 'completed', 'failed'])
      .order('updated_at', { ascending: false })
      .limit(1);
    
    const queryTime = Date.now() - queryStart;
    logWithTimestamp(`📊 Database query completed in ${queryTime}ms`);

    if (error) {
      logWithTimestamp('❌ Error checking existing analysis', error);
    } else {
      logWithTimestamp('✅ Successfully checked existing analysis', { 
        foundRecords: existingAnalysis?.length || 0,
        records: existingAnalysis 
      });
    }

    // If we have a completed analysis, return it
    if (existingAnalysis && existingAnalysis.length > 0) {
      const existing = existingAnalysis[0];
      logWithTimestamp('📋 Found existing analysis', { 
        status: existing.status, 
        hasResults: !!existing.results,
        userId: existing.user_id,
        sessionId: existing.session_id,
        createdAt: existing.created_at
      });
      
      if (existing.status === 'completed' && existing.results) {
        logWithTimestamp('🎉 Returning completed analysis results');
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
        logWithTimestamp('⏳ Analysis in progress, returning session IDs for polling');
        return {
          success: true,
          data: { 
            userId: existing.user_id, 
            sessionId: existing.session_id 
          },
          cached: false
        };
      }
      
      if (existing.status === 'failed') {
        logWithTimestamp('💥 Found failed analysis, will create new one', { 
          errorMessage: existing.error_message,
          failedAt: existing.updated_at 
        });
      }
    }
    
    if (!process.env.ENDPOINT_URL) {
      logWithTimestamp('❌ Backend endpoint not configured');
      return {
        success: false,
        error: 'Backend endpoint not configured. Please set ENDPOINT_URL in your environment variables.'
      };
    }

    // Generate new session IDs only if no existing analysis found
    const sessionId = `session-${generateRandomId()}`;
    const userId = `user-${generateRandomId()}`;
    const question = `analyze the brand ${brand} ${location} ${category}`;
    
    logWithTimestamp('🆔 Generated new session identifiers', { userId, sessionId, question });
    
    const endpointUrl = process.env.ENDPOINT_URL + '/query';
    logWithTimestamp('🌐 Preparing API call', { 
      endpointUrl,
      hasApiToken: !!process.env.API_TOKEN,
      payload: { userId, sessionId, question, brand_name: brand }
    });

    // Test basic connectivity first
    try {
      logWithTimestamp('🔍 Testing basic connectivity to endpoint...');
      const testResponse = await fetch(process.env.ENDPOINT_URL, {
        method: 'GET',
        headers: {
          'User-Agent': 'brand-analytics-test/1.0',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      logWithTimestamp('✅ Basic connectivity test result', {
        status: testResponse.status,
        statusText: testResponse.statusText,
        ok: testResponse.ok
      });
    } catch (testError) {
      logWithTimestamp('❌ Basic connectivity test failed', {
        error: testError instanceof Error ? testError.message : 'Unknown error',
        name: testError instanceof Error ? testError.name : undefined
      });
    }
    
    // Fire and forget - start the analysis without waiting
    const apiCallStart = Date.now();
    logWithTimestamp('🚀 Initiating background API call', { 
      endpointUrl,
      method: 'POST',
      hasAuth: !!process.env.API_TOKEN
    });
    
    // Use a more robust fetch with explicit error handling
    const makeApiCall = async () => {
      try {
        logWithTimestamp('📡 Making fetch request to backend...');
        
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
        
        const apiCallTime = Date.now() - apiCallStart;
        logWithTimestamp(`📡 API call completed in ${apiCallTime}ms`, { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          logWithTimestamp('⚠️ API call returned non-OK status', { 
            status: response.status, 
            statusText: response.statusText 
          });
        }
        
        const responseText = await response.text();
        logWithTimestamp('📄 API response received', { 
          responseLength: responseText.length,
          responsePreview: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
          fullResponse: responseText.length < 500 ? responseText : 'Response too long to log'
        });
        
        return response;
        
      } catch (error) {
        const apiCallTime = Date.now() - apiCallStart;
        logWithTimestamp(`❌ Background API call failed after ${apiCallTime}ms`, { 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined,
          type: typeof error
        });
        throw error;
      }
    };
    
    // Execute the API call in the background
    makeApiCall().catch(error => {
      logWithTimestamp('💥 Unhandled API call error', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    });
    
    const totalTime = Date.now() - startTime;
    logWithTimestamp(`✅ Returning session IDs for polling (total time: ${totalTime}ms)`, { userId, sessionId });
    
    // Return immediately with polling identifiers
    return {
      success: true,
      data: { userId, sessionId },
      cached: false
    };
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    logWithTimestamp(`💥 startBrandAnalysis failed after ${totalTime}ms`, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function checkAnalysisStatus(userId: string, sessionId: string) {
  const startTime = Date.now();
  logWithTimestamp('🔍 Checking analysis status', { userId, sessionId });

  try {
    logWithTimestamp('🔗 Creating Supabase client for status check...');
    const supabase = await createClient();
    logWithTimestamp('✅ Supabase client created for status check');

    const queryStart = Date.now();
    const { data, error } = await supabase
      .from('brand_analysis_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    const queryTime = Date.now() - queryStart;
    logWithTimestamp(`📊 Status query completed in ${queryTime}ms`);
    
    if (error) {
      logWithTimestamp('❌ Error in status check query', error);
      return { success: false, error: error.message };
    }
    
    // If no rows found, return pending status
    if (!data || data.length === 0) {
      logWithTimestamp('📭 No analysis record found, returning pending status');
      return { 
        success: true, 
        data: { 
          status: 'pending',
          user_id: userId,
          session_id: sessionId
        } 
      };
    }
    
    const record = data[0];
    const totalTime = Date.now() - startTime;
    logWithTimestamp(`📋 Analysis status retrieved in ${totalTime}ms`, { 
      status: record.status,
      hasResults: !!record.results,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      errorMessage: record.error_message
    });
    
    // Return the most recent row
    return { success: true, data: record };
    
  } catch (error) {
    const totalTime = Date.now() - startTime;
    logWithTimestamp(`💥 checkAnalysisStatus failed after ${totalTime}ms`, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
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