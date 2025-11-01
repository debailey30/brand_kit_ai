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
    // Redirect to login if not authenticated, otherwise to checkout
    window.location.href = "/api/login";
  };

  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('marketplace')} className="text-sm font-medium hover:text-primary transition-colors">
              Marketplace
            </button>
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleSignIn} data-testid="button-sign-in">
              Sign In
            </Button>
            <Button onClick={handleGetStarted} data-testid="button-get-started">
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

      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About Brand Kit AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to democratize brand creation by making professional design tools accessible to everyone through AI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground">Empower entrepreneurs and businesses with AI-driven brand creation tools.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Our Vision</h3>
                <p className="text-sm text-muted-foreground">Make professional branding accessible to everyone, regardless of design experience.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Our Values</h3>
                <p className="text-sm text-muted-foreground">Innovation, accessibility, and quality in everything we build.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="blog" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest from our Blog
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and trends in AI-powered branding and design.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">The Future of AI in Branding</h3>
                <p className="text-sm text-muted-foreground mb-4">How artificial intelligence is revolutionizing brand creation and what it means for designers.</p>
                <Button variant="outline" size="sm">Read More</Button>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Building a Strong Brand Identity</h3>
                <p className="text-sm text-muted-foreground mb-4">Essential elements every business needs for a cohesive and memorable brand presence.</p>
                <Button variant="outline" size="sm">Read More</Button>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Design Trends for 2025</h3>
                <p className="text-sm text-muted-foreground mb-4">Stay ahead of the curve with the latest design trends shaping the business world.</p>
                <Button variant="outline" size="sm">Read More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="careers" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us shape the future of AI-powered design. We're looking for passionate individuals to join our mission.
            </p>
          </div>
          <div className="text-center">
            <Button size="lg">View Open Positions</Button>
          </div>
        </div>
      </section>

      <section id="privacy" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Privacy Policy
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <h3 className="text-xl font-semibold mb-4">Information We Collect</h3>
            <p className="text-muted-foreground mb-6">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            <h3 className="text-xl font-semibold mb-4">How We Use Your Information</h3>
            <p className="text-muted-foreground mb-6">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
            <h3 className="text-xl font-semibold mb-4">Information Sharing</h3>
            <p className="text-muted-foreground mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </div>
        </div>
      </section>

      <section id="terms" className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Terms of Service
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              By using Brand Kit AI, you agree to these terms of service. Please read them carefully.
            </p>
            <h3 className="text-xl font-semibold mb-4">Acceptance of Terms</h3>
            <p className="text-muted-foreground mb-6">
              By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <h3 className="text-xl font-semibold mb-4">Use License</h3>
            <p className="text-muted-foreground mb-6">
              We grant you a limited, non-exclusive, non-transferable license to use our services in accordance with these terms.
            </p>
            <h3 className="text-xl font-semibold mb-4">User Responsibilities</h3>
            <p className="text-muted-foreground mb-6">
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
            </p>
          </div>
        </div>
      </section>

      <section id="license" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            License Agreement
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              This license agreement governs your use of content generated through Brand Kit AI.
            </p>
            <h3 className="text-xl font-semibold mb-4">Commercial Use</h3>
            <p className="text-muted-foreground mb-6">
              Paid subscribers receive a commercial license to use generated content for business purposes, including marketing materials and products.
            </p>
            <h3 className="text-xl font-semibold mb-4">Attribution</h3>
            <p className="text-muted-foreground mb-6">
              While not required, we appreciate attribution when you share your work created with our tools.
            </p>
            <h3 className="text-xl font-semibold mb-4">Restrictions</h3>
            <p className="text-muted-foreground mb-6">
              Generated content may not be used for illegal purposes, hate speech, or to infringe on intellectual property rights.
            </p>
          </div>
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
                <li><button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('marketplace')} className="hover:text-foreground transition-colors">Marketplace</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-foreground transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-foreground transition-colors">Blog</button></li>
                <li><button onClick={() => scrollToSection('careers')} className="hover:text-foreground transition-colors">Careers</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('privacy')} className="hover:text-foreground transition-colors">Privacy</button></li>
                <li><button onClick={() => scrollToSection('terms')} className="hover:text-foreground transition-colors">Terms</button></li>
                <li><button onClick={() => scrollToSection('license')} className="hover:text-foreground transition-colors">License</button></li>
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
