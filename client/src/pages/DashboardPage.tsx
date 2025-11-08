import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandKitCard } from "@/components/BrandKitCard";
import { GenerationHistoryCard } from "@/components/GenerationHistoryCard";
import { QuotaIndicator } from "@/components/QuotaIndicator";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { Plus, Sparkles, FolderOpen, Clock, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Subscription, BrandKit as BrandKitType, Generation } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  
  // Fetch subscription
  const { data: subscription, isLoading: subsLoading } = useQuery<Subscription>({
    queryKey: ["/api/subscription"],
  });
  
  // Fetch brand kits
  const { data: brandKits = [], isLoading: kitsLoading } = useQuery<any[]>({
    queryKey: ["/api/brand-kits"],
  });
  
  // Fetch generations
  const { data: generations = [], isLoading: gensLoading } = useQuery<Generation[]>({
    queryKey: ["/api/generations"],
  });
  
  const handleCreateBrandKit = () => {
    setLocation("/generator");
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
        body: JSON.stringify({ tier: "pro" }),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };
  
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };
  
  const showUpgradePrompt = subscription?.tier === "free" && subscription.generationsUsed >= 4;

  if (subsLoading || kitsLoading || gensLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Brand Kit AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="/generator" className="text-sm font-medium hover:text-primary transition-colors">
              Generator
            </a>
            <a href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </a>
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={handleCreateBrandKit} data-testid="button-create-brandkit">
              <Plus className="mr-2 h-4 w-4" />
              Generate Assets
            </Button>
          </div>
          <p className="text-muted-foreground">Manage your brand assets and generations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Generation Quota</h3>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subscription && (
                <QuotaIndicator 
                  used={subscription.generationsUsed} 
                  total={subscription.generationsLimit} 
                  tier={subscription.tier} 
                />
              )}
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Brand Kits</h3>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandKits.length}</div>
              <p className="text-xs text-muted-foreground">Active brand kits</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Generations</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generations.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {showUpgradePrompt && (
          <div className="mb-8">
            <UpgradePrompt
              feature="Unlock Unlimited Generations"
              description="You're getting close to your monthly limit. Upgrade to Pro for unlimited AI-powered brand asset generation."
              onUpgrade={handleUpgrade}
            />
          </div>
        )}

        <Tabs defaultValue="brand-kits" className="space-y-6">
          <TabsList>
            <TabsTrigger value="brand-kits" data-testid="tab-brand-kits">
              Brand Kits
            </TabsTrigger>
            <TabsTrigger value="generations" data-testid="tab-generations">
              Generation History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brand-kits" className="space-y-4">
            {brandKits.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No brand kits yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start generating assets to create your first brand kit</p>
                <Button onClick={handleCreateBrandKit}>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Assets
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandKits.map((kit: any) => (
                  <BrandKitCard
                    key={kit.id}
                    brandKit={{
                      ...kit,
                      lastModified: new Date(kit.updatedAt).toLocaleDateString(),
                    }}
                    onEdit={(id) => console.log(`Edit: ${id}`)}
                    onDownload={(id) => console.log(`Download: ${id}`)}
                    onDelete={(id) => console.log(`Delete: ${id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="generations" className="space-y-4">
            {generations.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No generations yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first AI-powered brand asset</p>
                <Button onClick={handleCreateBrandKit}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Generating
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generations.map((generation) => (
                  <GenerationHistoryCard
                    key={generation.id}
                    generation={{
                      ...generation,
                      thumbnail: generation.imageUrl,
                      createdAt: new Date(generation.createdAt || Date.now()).toLocaleDateString(),
                    }}
                    onDownload={(id) => console.log(`Download: ${id}`)}
                    onToggleFavorite={(id) => console.log(`Toggle favorite: ${id}`)}
                    onClick={(id) => console.log(`View: ${id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
