import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle } from "lucide-react";

interface QuotaIndicatorProps {
  used: number;
  total: number;
  tier: "free" | "pro" | "enterprise";
}

export function QuotaIndicator({ used, total, tier }: QuotaIndicatorProps) {
  const percentage = (used / total) * 100;
  const isNearLimit = percentage >= 80;
  const isUnlimited = tier === "pro" || tier === "enterprise";

  if (isUnlimited) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="gap-1" data-testid="badge-unlimited">
          <Sparkles className="h-3 w-3" />
          Unlimited
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="quota-indicator">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Generations used</span>
        <span className={`font-medium ${isNearLimit ? "text-destructive" : ""}`}>
          {used} / {total}
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className={isNearLimit ? "[&>div]:bg-destructive" : ""}
      />
      
      {isNearLimit && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span>Approaching limit - consider upgrading</span>
        </div>
      )}
    </div>
  );
}
