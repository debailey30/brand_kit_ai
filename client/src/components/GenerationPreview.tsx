import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GenerationPreviewProps {
  imageUrl?: string;
  isGenerating?: boolean;
  progress?: number;
  onDownload?: () => void;
  onRegenerate?: () => void;
}

export function GenerationPreview({ imageUrl, isGenerating, progress = 0, onDownload, onRegenerate }: GenerationPreviewProps) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-muted rounded-lg overflow-hidden mb-4">
        {isGenerating ? (
          <div className="text-center px-6 py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium mb-2">Generating your brand asset...</p>
            <p className="text-xs text-muted-foreground mb-4">This may take a few moments</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
            <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={imageUrl} alt="Generated asset" className="max-w-full max-h-full object-contain" />
          </div>
        ) : (
          <div className="text-center px-6 py-12">
            <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Your generated asset will appear here</p>
          </div>
        )}
      </div>

      {imageUrl && !isGenerating && (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={onRegenerate}
            data-testid="button-regenerate"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button
            className="flex-1"
            onClick={onDownload}
            data-testid="button-download-asset"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      )}
    </Card>
  );
}
