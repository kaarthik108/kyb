"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Building2, MapPin, Briefcase, Clock, TrendingUp, Users, Home } from "lucide-react";

interface BrandInfo {
  brand: string;
  location: string;
  category: string;
}

interface HeaderProps {
  brandInfo: BrandInfo;
}

export function Header({ brandInfo }: HeaderProps) {
  const router = useRouter();
  
  const currentTime = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleLogoClick}
              className="p-0 h-auto hover:bg-transparent group"
            >
              <div className="flex items-center gap-4">
                <div className="relative group-hover:scale-105 transition-all duration-300">
                  <BrandLogo 
                    brandName={brandInfo.brand} 
                    className="h-16 w-16"
                    fallbackIcon={<Building2 className="h-8 w-8 text-blue-400" />}
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-display bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-300 transition-all duration-300">
                      {brandInfo.brand}
                    </h1>
                    <Home className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-muted-foreground font-medium">Brand Analytics Dashboard</p>
                </div>
              </div>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-3 py-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              Live Monitoring
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors">
                <MapPin className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Location</p>
                <p className="font-poppins font-semibold text-white">{brandInfo.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                <Briefcase className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Category</p>
                <p className="font-poppins font-semibold text-white">{brandInfo.category}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600/20 group-hover:bg-emerald-600/30 transition-colors">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 group">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-600/20 group-hover:bg-amber-600/30 transition-colors">
                <Clock className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Last Updated</p>
                <p className="font-mono font-medium text-white text-xs">{currentTime}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-white">15</div>
              <p className="text-sm text-muted-foreground font-medium">Total Mentions</p>
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">+12.5% vs last period</span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-white">4</div>
              <p className="text-sm text-muted-foreground font-medium">Platforms Monitored</p>
              <div className="flex items-center justify-center gap-1 text-xs text-blue-400">
                <Users className="h-3 w-3" />
                <span className="font-medium">Twitter, LinkedIn, Reddit, News</span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-display text-white">78%</div>
              <p className="text-sm text-muted-foreground font-medium">Overall Sentiment Score</p>
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">Positive sentiment trending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}