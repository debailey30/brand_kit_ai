import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Template } from "@shared/schema";

interface TemplateDetailModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase?: (templateId: string) => void;
}

export function TemplateDetailModal({ template, open, onOpenChange, onPurchase }: TemplateDetailModalProps) {
  if (!template) return null;

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(template.id);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {template.previewUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <img
                src={template.previewUrl}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{template.category}</Badge>
                {template.rating !== null && template.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({template.ratingCount || 0})
                    </span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold">
                {template.price === 0 ? "Free" : `$${template.price.toFixed(2)}`}
              </div>
            </div>

            {template.downloadCount > 0 && (
              <div className="text-sm text-muted-foreground">
                {template.downloadCount} {template.downloadCount === 1 ? 'download' : 'downloads'}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase}>
              {template.price === 0 ? "Add to Collection" : "Purchase"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
