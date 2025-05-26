import { NextRequest, NextResponse } from 'next/server';
import { logWithContext } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  logWithContext('DEBUG', '🔍 Debug endpoint called', {
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    userAgent: req.headers.get('user-agent')
  });

  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasEndpointUrl: !!process.env.ENDPOINT_URL,
      hasApiToken: !!process.env.API_TOKEN,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      endpointUrlPreview: process.env.ENDPOINT_URL ? `${process.env.ENDPOINT_URL.substring(0, 30)}...` : 'not set'
    };

    // Test API connectivity if endpoint is configured
    let apiConnectivityTest = null;
    if (process.env.ENDPOINT_URL) {
      try {
        const testStartTime = Date.now();
        const response = await fetch(process.env.ENDPOINT_URL, {
          method: 'GET',
          headers: {
            'User-Agent': 'brand-analytics-debug/1.0',
            'Authorization': process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : '',
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        const testDuration = Date.now() - testStartTime;
        
        apiConnectivityTest = {
          success: true,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          duration: testDuration,
          headers: Object.fromEntries(response.headers.entries())
        };
        
        logWithContext('DEBUG', '✅ API connectivity test successful', apiConnectivityTest);
      } catch (error) {
        const testDuration = Date.now() - startTime;
        apiConnectivityTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: testDuration,
          name: error instanceof Error ? error.name : undefined
        };
        
        logWithContext('DEBUG', '❌ API connectivity test failed', apiConnectivityTest);
      }
    }

    // Test Supabase connectivity
    let supabaseTest = null;
    try {
      const { createClient } = await import('@/lib/supabase-ssr');
      const supabase = await createClient();
      
      const testStartTime = Date.now();
      const { data, error } = await supabase
        .from('brand_analysis_requests')
        .select('count')
        .limit(1);
      
      const testDuration = Date.now() - testStartTime;
      
      supabaseTest = {
        success: !error,
        duration: testDuration,
        error: error?.message,
        hasData: !!data
      };
      
      logWithContext('DEBUG', supabaseTest.success ? '✅ Supabase test successful' : '❌ Supabase test failed', supabaseTest);
    } catch (error) {
      supabaseTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      logWithContext('DEBUG', '❌ Supabase test failed', supabaseTest);
    }

    const totalDuration = Date.now() - startTime;
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      apiConnectivity: apiConnectivityTest,
      supabaseConnectivity: supabaseTest,
      performance: {
        totalDuration,
        serverTime: new Date().toISOString()
      }
    };

    logWithContext('DEBUG', `🎯 Debug check completed in ${totalDuration}ms`, debugInfo);

    return NextResponse.json(debugInfo, { status: 200 });
    
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    const errorInfo = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: totalDuration
    };
    
    logWithContext('DEBUG', `💥 Debug endpoint failed after ${totalDuration}ms`, errorInfo);
    
    return NextResponse.json(errorInfo, { status: 500 });
  }
} 