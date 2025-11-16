import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, ShoppingCart, Download, Eye, Palette, Settings2 } from "lucide-react";
import type { Template, TemplateVariant, TemplateControl } from "@shared/schema";
import { TemplateCustomizationForm } from "./TemplateCustomizationForm";

interface TemplateDetailModalProps {
  templateId: string | null;
  open: boolean;
  onClose: () => void;
  onPurchase?: (templateId: string, variantId?: string) => void;
}

export function TemplateDetailModal({ 
  templateId, 
  open, 
  onClose, 
  onPurchase 
}: TemplateDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});

  // Fetch template details
  const { data: template, isLoading: templateLoading } = useQuery<Template>({
    queryKey: [`/api/templates/${templateId}`],
    enabled: !!templateId && open,
  });

  // Fetch template variants
  const { data: variants = [], isLoading: variantsLoading } = useQuery<TemplateVariant[]>({
    queryKey: [`/api/templates/${templateId}/variants`],
    enabled: !!templateId && open,
  });

  // Fetch template controls
  const { data: controls = [], isLoading: controlsLoading } = useQuery<TemplateControl[]>({
    queryKey: [`/api/templates/${templateId}/controls`],
    enabled: !!templateId && open,
  });

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  const isLoading = templateLoading || variantsLoading || controlsLoading;

  if (!template && !isLoading) {
    return null;
  }

  const handlePurchase = () => {
    if (template && onPurchase) {
      onPurchase(template.id, selectedVariantId || undefined);
    }
  };

  const handleCustomizationSubmit = (values: Record<string, any>) => {
    setCustomizations(values);
    // Customizations are captured and ready for generation
    // The generation flow will be completed in the main Generate page
    // where users can trigger template-based generation with these customizations
    console.log("Template customizations saved:", {
      templateId,
      variantId: selectedVariantId,
      customizations: values
    });
  };

  const price = template ? template.price : 0;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0" data-testid="modal-template-detail">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading template details...</p>
          </div>
        ) : template ? (
          <div className="grid md:grid-cols-2 gap-0 h-full">
            {/* Left: Preview */}
            <div className="bg-muted p-6 flex flex-col">
              <div className="aspect-[3/4] relative overflow-hidden rounded-md bg-background mb-4">
                <img
                  src={selectedVariant?.previewUrl ?? template.previewUrl}
                  alt={selectedVariant?.formatName || template.name}
                  className="w-full h-full object-cover"
                  data-testid="img-template-preview"
                />
                {template.isPremium && (
                  <Badge variant="default" className="absolute top-2 right-2">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Variant Selection */}
              {variants.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Variants ({variants.length})</h4>
                  <ScrollArea className="h-32">
                    <div className="grid grid-cols-3 gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`aspect-square rounded-md overflow-hidden border-2 transition-colors hover-elevate ${
                            selectedVariantId === variant.id || (!selectedVariantId && variant === variants[0])
                              ? 'border-primary'
                              : 'border-border'
                          }`}
                          data-testid={`button-variant-${variant.id}`}
                        >
                          <img
                            src={variant.previewUrl ?? template.previewUrl}
                            alt={variant.formatName}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex flex-col p-6">
              <DialogHeader className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-1" data-testid="text-template-name">
                      {selectedVariant?.formatName || template.name}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {template.description}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant="secondary">{template.category}</Badge>
                  {template.industries && (() => {
                    try {
                      const industries = JSON.parse(template.industries);
                      if (industries && industries.length > 0) {
                        return (
                          <div className="flex gap-1">
                            {industries.slice(0, 2).map((industry: string) => (
                              <Badge key={industry} variant="outline" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                            {industries.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{industries.length - 2}
                              </Badge>
                            )}
                          </div>
                        );
                      }
                    } catch (e) {
                      return null;
                    }
                    return null;
                  })()}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {template.rating && template.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">
                        ({template.ratingCount} reviews)
                      </span>
                    </div>
                  )}
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {template.downloadCount} downloads
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              <Tabs defaultValue="overview" className="flex-1">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview" data-testid="tab-overview">
                    <Eye className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="customization" data-testid="tab-customization">
                    <Palette className="h-4 w-4 mr-2" />
                    Customize
                  </TabsTrigger>
                  <TabsTrigger value="details" data-testid="tab-details">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  {selectedVariant && (
                    <div>
                      <h4 className="font-medium mb-2">Selected Variant</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedVariant.formatName}
                      </p>
                      <div className="mt-2 flex gap-2 text-sm">
                        <Badge variant="outline">{selectedVariant.formatSlug}</Badge>
                        <Badge variant="outline">
                          {selectedVariant.width} x {selectedVariant.height}px
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Use Case</h4>
                    <p className="text-sm text-muted-foreground">
                      {template.useCase || "Versatile template suitable for various purposes"}
                    </p>
                  </div>

                  {template.styleTags && (() => {
                    try {
                      const styleTags = JSON.parse(template.styleTags);
                      if (styleTags && styleTags.length > 0) {
                        return (
                          <div>
                            <h4 className="font-medium mb-2">Style Tags</h4>
                            <div className="flex gap-1 flex-wrap">
                              {styleTags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      return null;
                    }
                    return null;
                  })()}

                  <div>
                    <h4 className="font-medium mb-2">Creator</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>CR</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Template Creator</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="customization" className="mt-4">
                  {controls.length > 0 ? (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <h4 className="font-medium mb-1">Customize Your Template</h4>
                        <p className="text-sm text-muted-foreground">
                          Adjust the following options to personalize your brand assets.
                        </p>
                      </div>
                      <TemplateCustomizationForm
                        controls={controls}
                        onSubmit={handleCustomizationSubmit}
                        defaultValues={customizations}
                        submitLabel="Apply Customizations"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No customization options available for this template.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <div className="space-y-3 text-sm">
                    {template.canvasWidth && template.canvasHeight && (
                      <div>
                        <span className="font-medium">Canvas Size:</span>{" "}
                        <span className="text-muted-foreground">
                          {template.canvasWidth} x {template.canvasHeight}px
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">File Formats:</span>{" "}
                      <span className="text-muted-foreground">
                        {selectedVariant?.formatSlug || "PNG"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      <span className="text-muted-foreground">{template.category}</span>
                    </div>
                    {template.aiPromptSeed && (
                      <div>
                        <span className="font-medium">AI Enhanced:</span>{" "}
                        <span className="text-muted-foreground">
                          Yes - Optimized for AI generation
                        </span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              {/* Purchase Section */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold" data-testid="text-template-price">
                    ${price.toFixed(2)}
                  </div>
                  {selectedVariant && (
                    <div className="text-sm text-muted-foreground">
                      {selectedVariant.formatName}
                    </div>
                  )}
                </div>
                <Button 
                  size="lg" 
                  onClick={handlePurchase}
                  data-testid="button-purchase-template"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {price === 0 ? 'Download Free' : 'Purchase'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
