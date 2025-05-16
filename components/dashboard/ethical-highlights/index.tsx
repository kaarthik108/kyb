import { dashboardData } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { SentimentType } from "@/types/dashboard";
import { ShieldCheck, AlertCircle, AlertTriangle } from "lucide-react";

export function EthicalHighlights() {
  const { ethical_highlights } = dashboardData;

  // Assign different colors and icons to each highlight for visual variety
  const highlights = ethical_highlights.map((text, index) => {
    let category = 'neutral';
    let icon = <AlertCircle className="h-5 w-5 text-blue-500" />;
    let borderColor = 'border-blue-500';
    
    // Determine category based on content analysis
    if (text.toLowerCase().includes('positive') || 
        text.toLowerCase().includes('innovation') || 
        text.toLowerCase().includes('leadership') ||
        text.toLowerCase().includes('renewable')) {
      category = 'positive';
      icon = <ShieldCheck className="h-5 w-5 text-emerald-500" />;
      borderColor = 'border-emerald-500';
    } else if (text.toLowerCase().includes('challenge') || 
               text.toLowerCase().includes('concern') || 
               text.toLowerCase().includes('controversial') ||
               text.toLowerCase().includes('harassment') ||
               text.toLowerCase().includes('ethics') ||
               text.toLowerCase().includes('negative')) {
      category = 'negative';
      icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
      borderColor = 'border-amber-500';
    }
    
    return {
      text,
      category,
      icon,
      borderColor
    };
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Ethical Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((highlight, index) => (
          <Card key={index} className={`overflow-hidden border-l-4 ${highlight.borderColor} hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {highlight.icon}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{highlight.text}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      highlight.category === 'positive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      highlight.category === 'negative' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {highlight.category === 'positive' ? 'Positive Impact' : 
                       highlight.category === 'negative' ? 'Area of Concern' : 
                       'Industry Context'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}