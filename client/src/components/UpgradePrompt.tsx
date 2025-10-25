import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Zap } from "lucide-react";

interface UpgradePromptProps {
  feature: string;
  description: string;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function UpgradePrompt({ feature, description, onUpgrade, onDismiss }: UpgradePromptProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">{feature}</h3>
      </CardHeader>
      
      <CardContent className="text-center pb-4">
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Unlimited AI generations</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Zap className="h-4 w-4 text-primary" />
            <span>No watermarks</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Access to premium templates</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {onDismiss && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDismiss}
            data-testid="button-dismiss-upgrade"
          >
            Maybe Later
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={onUpgrade}
          data-testid="button-upgrade-now"
        >
          Upgrade to Pro
        </Button>
      </CardFooter>
    </Card>
  );
}
