import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/HeroSection";
import { PricingCard, type PricingTier } from "@/components/PricingCard";
import { FeatureComparisonTable } from "@/components/FeatureComparisonTable";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

//todo: remove mock functionality
const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for trying out the platform",
    features: [
      "5 AI generations per month",
      "Watermarked outputs",
      "1 brand kit",
      "Community templates access",
      "Standard quality exports",
    ],
    buttonText: "Get Started Free",
    generationLimit: 5,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    description: "For professionals and growing businesses",
    features: [
      "Unlimited AI generations",
      "No watermarks",
      "Unlimited brand kits",
      "HD quality exports",
      "Sell templates in marketplace",
      "Priority support",
      "Advanced customization",
    ],
    isPopular: true,
    buttonText: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For teams and large organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Role-based permissions",
      "API access",
      "Custom branding",
      "Dedicated support",
      "Advanced analytics",
    ],
    buttonText: "Contact Sales",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Create professional brand assets in seconds using advanced AI technology.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate high-quality logos, graphics, and materials instantly.",
  },
  {
    icon: Shield,
    title: "Commercial License",
    description: "Use generated assets for any commercial purpose without restrictions.",
  },
  {
    icon: Users,
    title: "Template Marketplace",
    description: "Buy or sell templates in our thriving creator marketplace.",
  },
];

export default function LandingPage() {
  const handlePricingSelect = (tierName: string) => {
    console.log(`Selected tier: ${tierName}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Brand Kit AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#marketplace" className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </a>
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" data-testid="button-sign-in">
              Sign In
            </Button>
            <Button data-testid="button-get-started">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <HeroSection />

      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to build your brand
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI tools combined with an intuitive interface to create stunning brand assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} onSelect={handlePricingSelect} />
            ))}
          </div>

          <FeatureComparisonTable />
        </div>
      </section>

      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">Brand Kit AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create professional brand assets with AI-powered technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Marketplace</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">License</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Brand Kit AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
