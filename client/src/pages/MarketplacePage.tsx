import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TemplateCard, type Template as TemplateCardType } from "@/components/TemplateCard";
import { TemplateDetailModal } from "@/components/TemplateDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Template } from "@shared/schema";

// Available filter options - values match backend enum exactly
const CATEGORIES = [
  { value: "logo", label: "Logos" },
  { value: "social-media", label: "Social Media" },
  { value: "business-card", label: "Business Cards" },
  { value: "letterhead", label: "Letterheads" },
  { value: "presentation", label: "Presentations" },
  { value: "ad-banner", label: "Ad Banners" },
  { value: "email-template", label: "Email Templates" },
  { value: "web-hero", label: "Web Heroes" },
  { value: "brand-kit", label: "Brand Kits" },
  { value: "other", label: "Other" },
];

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "food", label: "Food & Beverage" },
  { value: "education", label: "Education" },
  { value: "real_estate", label: "Real Estate" },
  { value: "fitness", label: "Fitness & Wellness" },
];

const STYLE_TAGS = [
  { value: "modern", label: "Modern" },
  { value: "minimalist", label: "Minimalist" },
  { value: "vintage", label: "Vintage" },
  { value: "bold", label: "Bold" },
  { value: "elegant", label: "Elegant" },
  { value: "playful", label: "Playful" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedStyleTag, setSelectedStyleTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popular");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [detailModalTemplateId, setDetailModalTemplateId] = useState<string | null>(null);

  // Fetch templates from API
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let results = [...templates];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter((t) => t.category === selectedCategory);
    }

    // Industry filter
    if (selectedIndustry && results.length > 0) {
      results = results.filter((t) => 
        t.industries?.includes(selectedIndustry)
      );
    }

    // Style tag filter
    if (selectedStyleTag && results.length > 0) {
      results = results.filter((t) =>
        t.styleTags?.includes(selectedStyleTag)
      );
    }

    // Price filter
    if (priceFilter === "free") {
      results = results.filter((t) => parseFloat(t.price) === 0);
    } else if (priceFilter === "paid") {
      results = results.filter((t) => parseFloat(t.price) > 0);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        results.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        break;
      case "price-low":
        results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "popular":
      default:
        results.sort((a, b) => b.salesCount - a.salesCount);
        break;
    }

    return results;
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedStyleTag, priceFilter, sortBy]);

  const activeFiltersCount = [
    selectedCategory,
    selectedIndustry,
    selectedStyleTag,
    priceFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedIndustry(null);
    setSelectedStyleTag(null);
    setPriceFilter("all");
    setSearchQuery("");
  };

  const handlePreview = (id: string) => {
    setDetailModalTemplateId(id);
  };

  const handlePurchase = (templateId: string, variantId?: string) => {
    console.log(`Purchase template: ${templateId}`, variantId ? `variant: ${variantId}` : '');
    // TODO: Implement Stripe checkout
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Template Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and purchase premium templates from our community
          </p>
        </div>

        <div className="mb-8 space-y-4">
          {/* Search and Sort Row */}
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
              </SelectContent>
            </Select>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select 
              value={selectedCategory || "all"} 
              onValueChange={(val) => setSelectedCategory(val === "all" ? null : val)}
            >
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedIndustry || "all"} 
              onValueChange={(val) => setSelectedIndustry(val === "all" ? null : val)}
            >
              <SelectTrigger className="w-full sm:w-48" data-testid="select-industry">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedStyleTag || "all"} 
              onValueChange={(val) => setSelectedStyleTag(val === "all" ? null : val)}
            >
              <SelectTrigger className="w-full sm:w-48" data-testid="select-style">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {STYLE_TAGS.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={(val: any) => setPriceFilter(val)}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-price">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1" data-testid="badge-filter-category">
                  {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer hover-elevate" 
                    onClick={() => setSelectedCategory(null)}
                  />
                </Badge>
              )}
              {selectedIndustry && (
                <Badge variant="secondary" className="gap-1" data-testid="badge-filter-industry">
                  {INDUSTRIES.find(i => i.value === selectedIndustry)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer hover-elevate" 
                    onClick={() => setSelectedIndustry(null)}
                  />
                </Badge>
              )}
              {selectedStyleTag && (
                <Badge variant="secondary" className="gap-1" data-testid="badge-filter-style">
                  {STYLE_TAGS.find(s => s.value === selectedStyleTag)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer hover-elevate" 
                    onClick={() => setSelectedStyleTag(null)}
                  />
                </Badge>
              )}
              {priceFilter !== "all" && (
                <Badge variant="secondary" className="gap-1" data-testid="badge-filter-price">
                  {priceFilter === "free" ? "Free" : "Paid"}
                  <X 
                    className="h-3 w-3 cursor-pointer hover-elevate" 
                    onClick={() => setPriceFilter("all")}
                  />
                </Badge>
              )}
              <Separator orientation="vertical" className="h-4" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No templates found matching your criteria
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-no-results">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={{
                    id: template.id,
                    name: template.name,
                    preview: template.previewUrl || "",
                    price: parseFloat(template.price),
                    creator: { name: "Creator" }, // TODO: Join with users table
                    category: template.category,
                    isPremium: parseFloat(template.price) > 0,
                    rating: template.rating ? parseFloat(template.rating) : 0,
                    reviewCount: template.reviewCount,
                  }}
                  onPreview={handlePreview}
                  onPurchase={() => setDetailModalTemplateId(template.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Template Detail Modal */}
        <TemplateDetailModal
          templateId={detailModalTemplateId}
          open={!!detailModalTemplateId}
          onClose={() => setDetailModalTemplateId(null)}
          onPurchase={handlePurchase}
        />
      </main>
    </div>
  );
}
