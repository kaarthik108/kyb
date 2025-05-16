import { WordCloudVisualization } from "./word-cloud-visualization";
import { dashboardData } from "@/lib/data";
import { SentimentType } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WordCloudSection() {
  const { word_cloud_themes } = dashboardData;
  
  // Exclude these generic terms that don't provide specific brand insights
  const excludedTerms = [
    'united states', 'automotive', 'sales', 'market', 'production', 
    'delivery', 'financial results', 'transitions', 'stock price'
  ];
  
  // Map sentiment based on common positive/negative themes in the API
  const getSentiment = (word: string, weight: number): SentimentType => {
    const positiveWords = [
      'innovation', 'tesla', 'leadership', 'electric', 'vehicles', 
      'technology', 'model', 'sustainable', 'renewable'
    ];
    
    const negativeWords = [
      'racial', 'harassment', 'ethics', 'controversies', 'concerns',
      'challenges', 'negative', 'labor practices', 'quality'
    ];
    
    const lowerWord = word.toLowerCase();
    
    if (positiveWords.some(term => lowerWord.includes(term))) {
      return 'positive';
    } else if (negativeWords.some(term => lowerWord.includes(term))) {
      return 'negative';
    } else {
      return 'neutral';
    }
  };
  
  // Filter out excluded terms and transform data with sentiment
  const transformedData = word_cloud_themes
    .filter(item => !excludedTerms.includes(item.word.toLowerCase()))
    .map(item => ({
      text: item.word,
      weight: item.weight,
      sentiment: getSentiment(item.word, item.weight)
    }));

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Key Brand Themes</h2>
      <Card className="border-t-4 border-t-indigo-500 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Topic & Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-muted/10 rounded-lg p-2 md:p-6 h-[550px] md:h-[700px] overflow-hidden">
            <WordCloudVisualization data={transformedData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}