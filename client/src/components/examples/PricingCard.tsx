import { PricingCard } from '../PricingCard';

export default function PricingCardExample() {
  const tier = {
    name: "Pro",
    price: 29,
    period: "month",
    description: "Perfect for growing businesses and professionals",
    features: [
      "Unlimited AI generations",
      "No watermarks",
      "HD quality exports",
      "Unlimited brand kits",
      "Sell in marketplace",
      "Priority support",
    ],
    isPopular: true,
    buttonText: "Upgrade to Pro",
  };

  return (
    <div className="max-w-sm">
      <PricingCard tier={tier} onSelect={(name) => console.log(`Selected: ${name}`)} />
    </div>
  );
}
