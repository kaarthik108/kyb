"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/ui/brand-logo";
import { MapPin, Building2, Briefcase, Sparkles, AlertCircle, Zap, Apple, Monitor } from "lucide-react";

const predefinedBrands = [
  {
    brand: "Tesla",
    location: "United States",
    category: "Technology",
    icon: Zap,
    description: "Electric vehicles and clean energy",
    gradient: "from-red-500 to-orange-500"
  },
  {
    brand: "Apple",
    location: "United States", 
    category: "Technology",
    icon: Apple,
    description: "Consumer electronics and software",
    gradient: "from-gray-500 to-gray-700"
  },
  {
    brand: "Microsoft",
    location: "United States",
    category: "Technology", 
    icon: Monitor,
    description: "Software and cloud services",
    gradient: "from-blue-500 to-cyan-500"
  }
];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand: "",
    location: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnalyze = async (brandData: { brand: string; location: string; category: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze brand data');
      }

      const data = await response.json();
      
      // Redirect to dashboard with the generated ID and query params
      const searchParams = new URLSearchParams({
        brand: brandData.brand,
        location: brandData.location,
        category: brandData.category,
      });
      
      router.push(`/dashboard/${data.dashboardId}?${searchParams.toString()}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAnalyze(formData);
  };

  const handlePredefinedBrand = async (brand: typeof predefinedBrands[0]) => {
    await handleAnalyze(brand);
  };



  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-t-2 border-blue-400 opacity-20"></div>
          </div>
          <div className="text-center space-y-4 max-w-md">
            <p className="text-xl font-poppins font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Analyzing brand data...
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Our AI agents are gathering insights from multiple platforms
            </p>
            <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
              <p className="text-amber-400 text-sm font-medium">
                ⏱️ This process typically takes 60-80 seconds
              </p>
              <p className="text-amber-300/70 text-xs mt-1">
                We're analyzing Twitter, LinkedIn, Reddit, and News sources in real-time
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-12">
        <div className="mb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">AI-Powered Analytics</span>
          </div>
          <h1 className="text-4xl font-display bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Brand Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground max-w-md font-medium">
            Harness the power of AI to understand your brand's digital presence across all major platforms
          </p>
        </div>

        {/* Predefined Brand Cards */}
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display text-white">Quick Analysis</h2>
            <p className="text-muted-foreground font-medium">Analyze popular brands instantly</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predefinedBrands.map((brand) => {
              const Icon = brand.icon;
              return (
                <Card 
                  key={brand.brand}
                  className="border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-white/20 transition-all duration-200 cursor-pointer group"
                  onClick={() => handlePredefinedBrand(brand)}
                >
                  <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-fit relative">
                      <BrandLogo 
                        brandName={brand.brand} 
                        className="h-16 w-16"
                        fallbackIcon={
                          <div className={`p-4 rounded-xl bg-gradient-to-r ${brand.gradient} w-fit`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        }
                        showBorder={false}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-poppins font-bold text-white group-hover:text-blue-400 transition-colors">
                        {brand.brand}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-medium">
                        {brand.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="font-medium">{brand.location}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span className="font-medium">{brand.category}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:shadow-lg transition-all duration-200 font-semibold"
                      disabled={loading}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {loading ? 'Analyzing...' : `Analyze ${brand.brand}`}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
          <span className="text-sm text-muted-foreground font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
        </div>

        {/* Custom Analysis Form */}
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-display text-white">Custom Analysis</h3>
            <p className="text-sm text-muted-foreground font-medium">Analyze any brand of your choice</p>
          </div>

          <Card className="shadow-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-6 space-y-2">
              <CardTitle className="text-2xl text-center font-display bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Start Analysis
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground font-medium">
                Enter your brand details to generate comprehensive insights
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="brand" className="text-sm font-semibold text-gray-200">Brand Name</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building2 className="h-4 w-4 text-blue-400 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <Input 
                      id="brand" 
                      name="brand" 
                      placeholder="Enter brand name" 
                      className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 text-white placeholder:text-gray-400 font-medium"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-200">Location</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-blue-400 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="Global, US, Europe, etc." 
                      className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 text-white placeholder:text-gray-400 font-medium"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-200">Category</Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="h-4 w-4 text-blue-400 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <Input 
                      id="category" 
                      name="category" 
                      placeholder="Industry or business category" 
                      className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 text-white placeholder:text-gray-400 font-medium"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200 border-0 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {loading ? 'Analyzing...' : 'Generate Analytics'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}