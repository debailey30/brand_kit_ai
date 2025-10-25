import { useState } from "react";
import { TemplateCard, type Template } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import logoImage from "@assets/generated_images/Sample_brand_logo_mockup_4d82739b.png";
import socialImage from "@assets/generated_images/Social_media_graphics_showcase_ad808a32.png";

//todo: remove mock functionality
const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Modern Tech Logo Pack",
    preview: logoImage,
    price: 29,
    creator: { name: "Sarah Johnson" },
    rating: 4.8,
    reviewCount: 124,
    category: "Logo",
    isPremium: true,
  },
  {
    id: "2",
    name: "Social Media Bundle",
    preview: socialImage,
    price: 39,
    creator: { name: "Mike Chen" },
    rating: 4.9,
    reviewCount: 203,
    category: "Social Media",
    isPremium: true,
  },
  {
    id: "3",
    name: "Business Card Templates",
    preview: logoImage,
    price: 19,
    creator: { name: "Emma Davis" },
    rating: 4.7,
    reviewCount: 89,
    category: "Print",
  },
  {
    id: "4",
    name: "Brand Identity Kit",
    preview: socialImage,
    price: 49,
    creator: { name: "Alex Rivera" },
    rating: 5.0,
    reviewCount: 156,
    category: "Brand Kit",
    isPremium: true,
  },
  {
    id: "5",
    name: "Minimalist Logos",
    preview: logoImage,
    price: 24,
    creator: { name: "Jordan Lee" },
    rating: 4.6,
    reviewCount: 67,
    category: "Logo",
  },
  {
    id: "6",
    name: "Instagram Story Pack",
    preview: socialImage,
    price: 34,
    creator: { name: "Taylor Swift" },
    rating: 4.8,
    reviewCount: 142,
    category: "Social Media",
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const handlePreview = (id: string) => {
    console.log(`Preview template: ${id}`);
  };

  const handlePurchase = (id: string) => {
    console.log(`Purchase template: ${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Template Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and purchase premium templates from our community
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-templates"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="logo">Logo</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="print">Print</SelectItem>
                <SelectItem value="brand-kit">Brand Kit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filters:</span>
            <Button variant="secondary" size="sm">
              Premium Only
            </Button>
            <Button variant="secondary" size="sm">
              Free Templates
            </Button>
            <Button variant="secondary" size="sm">
              Recently Added
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" data-testid="button-load-more">
            Load More Templates
          </Button>
        </div>
      </div>
    </div>
  );
}
