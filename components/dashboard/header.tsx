"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, HelpCircle, Menu, User, BarChart3, MapPin, Briefcase } from "lucide-react";
import { dashboardData } from "@/lib/data";
import { Card } from "@/components/ui/card";

export function Header({ brandInfo = null }: { brandInfo?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brand_name } = dashboardData;
  
  // Use provided brandInfo if available, otherwise use defaults
  const brandName = brandInfo?.brand || brand_name || "Tesla";
  const location = brandInfo?.location || "Global";
  const category = brandInfo?.category || "Automotive & Technology";

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-2 mr-2">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">BrandPulse Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Real-time brand monitoring and sentiment analysis
            </p>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Button variant="link" className="text-foreground font-medium">
              Dashboard
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Brand info card */}
      <Card className="p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{brandName}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                <span>{location}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-1 text-blue-500" />
                <span>{category}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
              <HelpCircle className="h-4 w-4" />
              <span>Get Report</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 z-50 w-64 bg-card rounded-lg shadow-lg border border-border p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start">Dashboard</Button>
            <Button variant="ghost" className="justify-start">Reports</Button>
            <Button variant="ghost" className="justify-start">Alerts</Button>
            <Button variant="ghost" className="justify-start">Settings</Button>
            <hr className="my-2 border-border" />
            <Button variant="ghost" className="justify-start gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}