import { useState } from "react";
import { GeneratorControls, type GeneratorSettings } from "@/components/GeneratorControls";
import { GenerationPreview } from "@/components/GenerationPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import socialImage from "@assets/generated_images/Social_media_graphics_showcase_ad808a32.png";

export default function GeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);

  const handleGenerate = (settings: GeneratorSettings) => {
    console.log("Generating with settings:", settings);
    setIsGenerating(true);
    setProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedImage(socialImage); // todo: remove mock functionality
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };

  const handleRegenerate = () => {
    console.log("Regenerate clicked");
    setGeneratedImage(undefined);
  };

  const handleBack = () => {
    console.log("Back clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Brand Asset Generator</h1>
          <p className="text-muted-foreground">
            Describe your vision and let AI create professional brand assets for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <GeneratorControls
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              generationsRemaining={3}
            />
          </div>

          <div className="lg:col-span-3">
            <GenerationPreview
              imageUrl={generatedImage}
              isGenerating={isGenerating}
              progress={progress}
              onDownload={handleDownload}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
