import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandKitCard, type BrandKit } from "@/components/BrandKitCard";
import { GenerationHistoryCard, type Generation } from "@/components/GenerationHistoryCard";
import { QuotaIndicator } from "@/components/QuotaIndicator";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { Plus, Sparkles, FolderOpen, Clock } from "lucide-react";
import logoImage from "@assets/generated_images/Sample_brand_logo_mockup_4d82739b.png";
import socialImage from "@assets/generated_images/Social_media_graphics_showcase_ad808a32.png";

//todo: remove mock functionality
const mockBrandKits: BrandKit[] = [
  {
    id: "1",
    name: "Tech Startup Brand",
    thumbnail: logoImage,
    colors: ["#8B5CF6", "#3B82F6", "#10B981"],
    assetCount: 12,
    lastModified: "2 hours ago",
    tags: ["Technology", "Modern"],
  },
  {
    id: "2",
    name: "Eco Business",
    thumbnail: socialImage,
    colors: ["#10B981", "#059669", "#34D399"],
    assetCount: 8,
    lastModified: "1 day ago",
    tags: ["Eco-Friendly", "Nature"],
  },
  {
    id: "3",
    name: "Fashion Brand",
    thumbnail: logoImage,
    colors: ["#EC4899", "#F472B6", "#F9A8D4"],
    assetCount: 15,
    lastModified: "3 days ago",
    tags: ["Fashion", "Elegant"],
  },
];

const mockGenerations: Generation[] = [
  {
    id: "1",
    thumbnail: socialImage,
    prompt: "Modern tech startup logo with blue gradient and geometric shapes",
    aspectRatio: "1:1",
    createdAt: "2 hours ago",
    isFavorite: true,
  },
  {
    id: "2",
    thumbnail: logoImage,
    prompt: "Social media graphics for eco-friendly business",
    aspectRatio: "16:9",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    thumbnail: socialImage,
    prompt: "Business card design with purple accent",
    aspectRatio: "4:3",
    createdAt: "1 day ago",
  },
  {
    id: "4",
    thumbnail: logoImage,
    prompt: "Instagram story template minimalist style",
    aspectRatio: "9:16",
    createdAt: "2 days ago",
    isFavorite: true,
  },
];

export default function DashboardPage() {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const userTier = "free"; // todo: remove mock functionality

  const handleCreateBrandKit = () => {
    console.log("Create brand kit clicked");
  };

  const handleUpgrade = () => {
    console.log("Upgrade clicked");
    setShowUpgradePrompt(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={handleCreateBrandKit} data-testid="button-create-brandkit">
              <Plus className="mr-2 h-4 w-4" />
              New Brand Kit
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
              <QuotaIndicator used={4} total={5} tier={userTier as any} />
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Brand Kits</h3>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBrandKits.length}</div>
              <p className="text-xs text-muted-foreground">Active brand kits</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Generations</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockGenerations.length}</div>
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
              onDismiss={() => setShowUpgradePrompt(false)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBrandKits.map((kit) => (
                <BrandKitCard
                  key={kit.id}
                  brandKit={kit}
                  onEdit={(id) => console.log(`Edit: ${id}`)}
                  onDownload={(id) => console.log(`Download: ${id}`)}
                  onDelete={(id) => console.log(`Delete: ${id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generations" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockGenerations.map((generation) => (
                <GenerationHistoryCard
                  key={generation.id}
                  generation={generation}
                  onDownload={(id) => console.log(`Download: ${id}`)}
                  onToggleFavorite={(id) => console.log(`Toggle favorite: ${id}`)}
                  onClick={(id) => console.log(`View: ${id}`)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
