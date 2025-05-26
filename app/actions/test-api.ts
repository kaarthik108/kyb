"use server";

import { logWithContext } from '@/lib/utils';

export async function testBackendConnectivity() {
  const startTime = Date.now();
  logWithContext('API_TEST', '🧪 Testing backend connectivity');

  if (!process.env.ENDPOINT_URL) {
    return {
      success: false,
      error: 'ENDPOINT_URL not configured'
    };
  }

  try {
    // Test basic GET request
    logWithContext('API_TEST', '📡 Making GET request to backend', {
      url: process.env.ENDPOINT_URL
    });

    const response = await fetch(process.env.ENDPOINT_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'brand-analytics-test/1.0',
        'Authorization': process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : '',
      },
      signal: AbortSignal.timeout(10000)
    });

    const duration = Date.now() - startTime;
    const responseText = await response.text();

    const result = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration,
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 200),
      headers: Object.fromEntries(response.headers.entries())
    };

    logWithContext('API_TEST', `✅ Backend connectivity test completed in ${duration}ms`, result);
    return result;

  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : undefined,
      duration
    };

    logWithContext('API_TEST', `❌ Backend connectivity test failed after ${duration}ms`, result);
    return result;
  }
}

export async function testBackendQuery(testData: { brand: string; location: string; category: string }) {
  const startTime = Date.now();
  logWithContext('API_TEST', '🧪 Testing backend query endpoint', { testData });

  if (!process.env.ENDPOINT_URL) {
    return {
      success: false,
      error: 'ENDPOINT_URL not configured'
    };
  }

  try {
    const endpointUrl = process.env.ENDPOINT_URL + '/query';
    const payload = {
      userId: 'test-user-123',
      sessionId: 'test-session-123',
      question: `analyze the brand ${testData.brand} ${testData.location} ${testData.category}`,
      brand_name: testData.brand.toLowerCase()
    };

    logWithContext('API_TEST', '📡 Making POST request to query endpoint', {
      url: endpointUrl,
      payload
    });

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'brand-analytics-test/1.0',
        'Authorization': process.env.API_TOKEN ? `Bearer ${process.env.API_TOKEN}` : '',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    const duration = Date.now() - startTime;
    const responseText = await response.text();

    const result = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration,
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 500),
      headers: Object.fromEntries(response.headers.entries())
    };

    logWithContext('API_TEST', `✅ Backend query test completed in ${duration}ms`, result);
    return result;

  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : undefined,
      duration
    };

    logWithContext('API_TEST', `❌ Backend query test failed after ${duration}ms`, result);
    return result;
  }
} 