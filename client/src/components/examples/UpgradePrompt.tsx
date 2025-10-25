import { UpgradePrompt } from '../UpgradePrompt';

export default function UpgradePromptExample() {
  return (
    <div className="max-w-md mx-auto">
      <UpgradePrompt
        feature="Unlimited Generations"
        description="You've reached your monthly limit. Upgrade to Pro for unlimited AI-powered brand asset generation."
        onUpgrade={() => console.log('Upgrade clicked')}
        onDismiss={() => console.log('Dismissed')}
      />
    </div>
  );
}
