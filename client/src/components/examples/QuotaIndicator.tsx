import { QuotaIndicator } from '../QuotaIndicator';

export default function QuotaIndicatorExample() {
  return (
    <div className="max-w-sm space-y-6 p-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Free Tier (Near Limit)</h3>
        <QuotaIndicator used={4} total={5} tier="free" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Pro Tier</h3>
        <QuotaIndicator used={0} total={0} tier="pro" />
      </div>
    </div>
  );
}
