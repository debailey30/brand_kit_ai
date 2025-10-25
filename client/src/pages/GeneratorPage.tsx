import { useState } from "react";
import { GeneratorControls, type GeneratorSettings } from "@/components/GeneratorControls";
import { GenerationPreview } from "@/components/GenerationPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Subscription, Generation } from "@shared/schema";

export default function GeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<Generation | undefined>(undefined);
  const { toast } = useToast();

  // Fetch subscription for quota display
  const { data: subscription } = useQuery<Subscription>({
    queryKey: ["/api/subscription"],
  });

  const generateMutation = useMutation({
    mutationFn: async (settings: GeneratorSettings) => {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(settings),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate");
      }
      
      return await response.json();
    },
    onSuccess: (data: Generation) => {
      setGeneratedImage(data);
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/generations"] });
      toast({
        title: "Success!",
        description: "Your brand asset has been generated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = async (settings: GeneratorSettings) => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 90));
    }, 300);

    try {
      await generateMutation.mutateAsync(settings);
      setProgress(100);
    } catch (error) {
      // Error handled by mutation
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      // Open image in new tab for download
      window.open(generatedImage.imageUrl, '_blank');
    }
  };

  const handleRegenerate = () => {
    setGeneratedImage(undefined);
  };

  const handleBack = () => {
    window.location.href = "/dashboard";
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
              generationsRemaining={subscription ? (subscription.tier === 'free' ? subscription.generationsLimit - subscription.generationsUsed : undefined) : undefined}
            />
          </div>

          <div className="lg:col-span-3">
            <GenerationPreview
              imageUrl={generatedImage?.imageUrl}
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
