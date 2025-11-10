import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Heart } from "lucide-react";
import { useState } from "react";

export interface Generation {
  id: string;
  thumbnail: string;
  prompt: string;
  aspectRatio: string;
  createdAt: string;
  // DB may store this as a number (0/1) or boolean depending on the layer; accept both
  isFavorite?: boolean | number;
}

interface GenerationHistoryCardProps {
  generation: Generation;
  onDownload?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function GenerationHistoryCard({
  generation,
  onDownload,
  onToggleFavorite,
  onClick,
}: GenerationHistoryCardProps) {
  // Coerce numeric (0/1) or boolean to boolean for local state
  const [isFavorite, setIsFavorite] = useState(Boolean(generation.isFavorite));

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(generation.id);
  };

  return (
    <Card
      className="group hover-elevate overflow-hidden cursor-pointer"
      onClick={() => onClick?.(generation.id)}
      data-testid={`card-generation-${generation.id}`}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img src={generation.thumbnail} alt={generation.prompt} className="w-full h-full object-cover" />

        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={handleToggleFavorite}
            data-testid={`button-favorite-${generation.id}`}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.(generation.id);
            }}
            data-testid={`button-download-generation-${generation.id}`}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{generation.prompt}</p>

        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{generation.aspectRatio}</Badge>
          <span className="text-xs text-muted-foreground">{generation.createdAt}</span>
        </div>
      </div>
    </Card>
  );
}
