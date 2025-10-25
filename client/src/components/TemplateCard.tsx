import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Eye, ShoppingCart } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  preview: string;
  price: number;
  creator: {
    name: string;
    avatar?: string;
  };
  rating: number;
  reviewCount: number;
  category: string;
  isPremium?: boolean;
}

interface TemplateCardProps {
  template: Template;
  onPreview?: (id: string) => void;
  onPurchase?: (id: string) => void;
}

export function TemplateCard({ template, onPreview, onPurchase }: TemplateCardProps) {
  return (
    <Card className="group hover-elevate overflow-hidden" data-testid={`card-template-${template.id}`}>
      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
        <img
          src={template.preview}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        
        {template.isPremium && (
          <div className="absolute top-2 right-2">
            <Badge variant="default">Premium</Badge>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => onPreview?.(template.id)}
            data-testid={`button-preview-${template.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2 text-xs">
          {template.category}
        </Badge>
        
        <h3 className="font-semibold mb-2 truncate" data-testid={`text-template-name-${template.id}`}>
          {template.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{template.rating}</span>
          <span className="text-xs text-muted-foreground">({template.reviewCount})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={template.creator.avatar} />
            <AvatarFallback>{template.creator.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">{template.creator.name}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <span className="text-lg font-bold" data-testid={`text-price-${template.id}`}>
          ${template.price}
        </span>
        <Button
          variant="default"
          size="sm"
          onClick={() => onPurchase?.(template.id)}
          data-testid={`button-purchase-${template.id}`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
