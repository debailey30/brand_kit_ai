import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Trash2, FolderOpen } from "lucide-react";
import { useState } from "react";

export interface BrandKit {
  id: string;
  name: string;
  thumbnail: string;
  colors: string[];
  assetCount: number;
  lastModified: string;
  tags: string[];
}

interface BrandKitCardProps {
  brandKit: BrandKit;
  onEdit?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BrandKitCard({ brandKit, onEdit, onDownload, onDelete }: BrandKitCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group hover-elevate overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-brandkit-${brandKit.id}`}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={brandKit.thumbnail}
          alt={brandKit.name}
          className="w-full h-full object-cover"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEdit?.(brandKit.id)}
              data-testid={`button-edit-${brandKit.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onDownload?.(brandKit.id)}
              data-testid={`button-download-${brandKit.id}`}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onDelete?.(brandKit.id)}
              data-testid={`button-delete-${brandKit.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate mb-1" data-testid={`text-brandkit-name-${brandKit.id}`}>
              {brandKit.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FolderOpen className="h-3 w-3" />
              <span>{brandKit.assetCount} assets</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {brandKit.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="h-6 w-6 rounded-md border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {brandKit.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Modified {brandKit.lastModified}
        </p>
      </CardContent>
    </Card>
  );
}
