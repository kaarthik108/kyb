import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    let systemMessage = `You are a brand analytics AI assistant helping users understand their brand's digital presence and social media performance. 

    You have access to real-time brand sentiment analysis, platform-specific insights, ethical considerations, and social media trends. You can help users:
    
    - Interpret sentiment analysis results
    - Understand platform-specific performance differences  
    - Provide actionable insights for brand improvement
    - Explain ethical considerations and social impact themes
    - Suggest strategies for better brand perception
    - Answer questions about social media trends and patterns
    
    Keep responses concise, actionable, and focused on brand analytics insights. Use data-driven language and provide specific recommendations when possible.`;

    // Add context if available
    if (context) {
      systemMessage += `\n\nCURRENT ANALYSIS CONTEXT:
Brand: ${context.brandName || 'Unknown'}
Query: ${context.query ? `${context.query.brand} in ${context.query.location} (${context.query.category})` : 'Not specified'}
Total Mentions: ${context.totalMentions || 0}

PLATFORM DATA:
- Twitter: ${context.platforms?.twitter?.total_mentions_on_platform || 0} mentions, ${Math.round((context.platforms?.twitter?.platform_sentiment_breakdown?.positive || 0) * 100)}% positive sentiment
- LinkedIn: ${context.platforms?.linkedin?.total_mentions_on_platform || 0} mentions, ${Math.round((context.platforms?.linkedin?.platform_sentiment_breakdown?.positive || 0) * 100)}% positive sentiment  
- Reddit: ${context.platforms?.reddit?.total_mentions_on_platform || 0} mentions, ${Math.round((context.platforms?.reddit?.platform_sentiment_breakdown?.positive || 0) * 100)}% positive sentiment
- News: ${context.platforms?.news?.total_mentions_on_platform || 0} mentions, ${Math.round((context.platforms?.news?.platform_sentiment_breakdown?.positive || 0) * 100)}% positive sentiment

KEY ETHICAL HIGHLIGHTS:
${context.platforms?.twitter?.ethical_highlights_on_platform?.slice(0, 3).map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') || 'None available'}

Use this context to provide specific, data-driven insights about the brand's performance.`;
    }

    const result = await streamText({
      model: openai('o4-mini'),
      system: systemMessage,
      messages: convertToCoreMessages(messages),
      maxTokens: 500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Chat service unavailable', { status: 500 });
  }
} 