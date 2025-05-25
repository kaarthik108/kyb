import React from "react";
import { FloatingChat } from "@/components/chat/floating-chat";
import { ApiResponse } from "@/lib/data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  data?: ApiResponse;
}

export function DashboardLayout({ children, data }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <FloatingChat data={data} />
    </div>
  );
}