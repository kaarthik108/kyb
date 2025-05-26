import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function logWithContext(context: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${context} ${timestamp}] ${message}`;
  
  if (data) {
    console.log(logMessage, JSON.stringify(data, null, 2));
  } else {
    console.log(logMessage);
  }
}

export function logEnvironmentInfo() {
  logWithContext('ENV', '🔧 Environment configuration', {
    nodeEnv: process.env.NODE_ENV,
    hasEndpointUrl: !!process.env.ENDPOINT_URL,
    hasApiToken: !!process.env.API_TOKEN,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    endpointUrl: process.env.ENDPOINT_URL ? `${process.env.ENDPOINT_URL.substring(0, 20)}...` : 'not set'
  });
}
