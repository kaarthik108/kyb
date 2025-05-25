"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Briefcase, Clock, TrendingUp, Users } from "lucide-react";

interface BrandInfo {
  brand: string;
  location: string;
  category: string;
}

interface HeaderProps {
  brandInfo: BrandInfo;
}

export function Header({ brandInfo }: HeaderProps) {
  const currentTime = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              {brandInfo.brand}
            </h1>
            <p className="text-muted-foreground">Brand Analytics Dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <MapPin className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-white">{brandInfo.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Briefcase className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium text-white">{brandInfo.category}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600/20">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                  Live Monitoring
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-600/20">
                <Clock className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium text-white text-xs">{currentTime}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">15</div>
              <p className="text-sm text-muted-foreground">Total Mentions</p>
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% vs last period</span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">4</div>
              <p className="text-sm text-muted-foreground">Platforms Monitored</p>
              <div className="flex items-center justify-center gap-1 text-xs text-blue-400">
                <Users className="h-3 w-3" />
                <span>Twitter, LinkedIn, Reddit, News</span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">78%</div>
              <p className="text-sm text-muted-foreground">Overall Sentiment Score</p>
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>Positive sentiment trending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}