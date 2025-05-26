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

export function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

export function safePercentage(value: any, total: any, fallback: number = 0): number {
  const numValue = safeNumber(value);
  const numTotal = safeNumber(total);
  
  if (numTotal === 0) return fallback;
  
  const percentage = (numValue / numTotal) * 100;
  return isNaN(percentage) ? fallback : Math.max(0, Math.min(100, percentage));
}

export function formatNumber(value: any, decimals: number = 1): string {
  const num = safeNumber(value);
  return num.toFixed(decimals);
}

export function formatPercentage(value: any, total: any, decimals: number = 1): string {
  const percentage = safePercentage(value, total);
  return percentage.toFixed(decimals) + '%';
}
