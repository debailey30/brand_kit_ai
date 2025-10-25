import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

export interface GeneratorSettings {
  prompt: string;
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  style: string;
  quality: number;
}

interface GeneratorControlsProps {
  onGenerate: (settings: GeneratorSettings) => void;
  isGenerating?: boolean;
  generationsRemaining?: number;
}

export function GeneratorControls({ onGenerate, isGenerating = false, generationsRemaining }: GeneratorControlsProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<GeneratorSettings["aspectRatio"]>("1:1");
  const [style, setStyle] = useState("professional");
  const [quality, setQuality] = useState([80]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    onGenerate({
      prompt,
      aspectRatio,
      style,
      quality: quality[0],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="prompt">Describe your brand asset</Label>
          {generationsRemaining !== undefined && (
            <span className="text-xs text-muted-foreground">
              {generationsRemaining} generations remaining
            </span>
          )}
        </div>
        <Textarea
          id="prompt"
          placeholder="e.g., Modern tech startup logo with blue gradient and geometric shapes..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          data-testid="input-generator-prompt"
        />
      </div>

      <div>
        <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
        <Select value={aspectRatio} onValueChange={(value: any) => setAspectRatio(value)}>
          <SelectTrigger id="aspect-ratio" data-testid="select-aspect-ratio">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1:1">Square (1:1) - Logo</SelectItem>
            <SelectItem value="16:9">Landscape (16:9) - Banner</SelectItem>
            <SelectItem value="9:16">Portrait (9:16) - Story</SelectItem>
            <SelectItem value="4:3">Standard (4:3)</SelectItem>
            <SelectItem value="3:4">Portrait (3:4)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="style">Style</Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger id="style" data-testid="select-style">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="elegant">Elegant</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Quality</Label>
          <span className="text-sm text-muted-foreground">{quality[0]}%</span>
        </div>
        <Slider
          value={quality}
          onValueChange={setQuality}
          min={50}
          max={100}
          step={10}
          data-testid="slider-quality"
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        data-testid="button-generate"
      >
        {isGenerating ? (
          <>
            <Wand2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Brand Asset
          </>
        )}
      </Button>
    </div>
  );
}
