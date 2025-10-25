import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  buttonText: string;
  generationLimit?: number;
}

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tierName: string) => void;
}

export function PricingCard({ tier, onSelect }: PricingCardProps) {
  return (
    <Card className="relative flex flex-col h-full">
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default" data-testid={`badge-popular-${tier.name.toLowerCase()}`}>
            Most Popular
          </Badge>
        </div>
      )}
      
      {tier.isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="secondary" data-testid={`badge-current-${tier.name.toLowerCase()}`}>
            Current Plan
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2" data-testid={`text-tier-name-${tier.name.toLowerCase()}`}>
            {tier.name}
          </h3>
          <p className="text-sm text-muted-foreground">{tier.description}</p>
        </div>
        
        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold" data-testid={`text-price-${tier.name.toLowerCase()}`}>
              ${tier.price}
            </span>
            <span className="text-muted-foreground">/{tier.period}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-6">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          variant={tier.isPopular ? "default" : "outline"}
          onClick={() => onSelect(tier.name)}
          disabled={tier.isCurrent}
          data-testid={`button-select-${tier.name.toLowerCase()}`}
        >
          {tier.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
