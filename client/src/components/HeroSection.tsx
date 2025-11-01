import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
const heroImage = "/storage/Professional_team_collaboration_hero_feb0b269.png";

export function HeroSection() {
  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  const handleViewExamples = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-white/90">AI-Powered Brand Creation</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Create Professional Brand Assets in Seconds
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Generate stunning logos, social media graphics, and marketing materials with AI. 
            Start free with 5 generations per month, upgrade for unlimited creativity.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="default"
              onClick={handleGetStarted}
              data-testid="button-hero-get-started"
              className="bg-primary text-primary-foreground border border-primary-border backdrop-blur-sm"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleViewExamples}
              data-testid="button-hero-view-examples"
              className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              View Examples
            </Button>
          </div>
          
          <div className="mt-8 flex items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full" />
              <span>5 free generations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
