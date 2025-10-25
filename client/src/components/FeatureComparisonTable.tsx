import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface Feature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const features: Feature[] = [
  { name: "AI generations per month", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Watermark removal", free: false, pro: true, enterprise: true },
  { name: "HD quality exports", free: false, pro: true, enterprise: true },
  { name: "Brand kit storage", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Template marketplace access", free: true, pro: true, enterprise: true },
  { name: "Sell templates", free: false, pro: true, enterprise: true },
  { name: "Team collaboration", free: false, pro: false, enterprise: true },
  { name: "Priority support", free: false, pro: true, enterprise: true },
  { name: "API access", free: false, pro: false, enterprise: true },
  { name: "Custom branding", free: false, pro: false, enterprise: true },
];

export function FeatureComparisonTable() {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-center">Feature Comparison</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="text-center p-4 font-semibold">Free</th>
                <th className="text-center p-4 font-semibold">Pro</th>
                <th className="text-center p-4 font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b last:border-0 hover-elevate">
                  <td className="p-4 text-sm">{feature.name}</td>
                  <td className="p-4 text-center">{renderCell(feature.free)}</td>
                  <td className="p-4 text-center">{renderCell(feature.pro)}</td>
                  <td className="p-4 text-center">{renderCell(feature.enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
