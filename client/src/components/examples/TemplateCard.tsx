import { TemplateCard } from '../TemplateCard';
import logoImage from '@assets/generated_images/Sample_brand_logo_mockup_4d82739b.png';

export default function TemplateCardExample() {
  const template = {
    id: "1",
    name: "Modern Tech Logo Pack",
    preview: logoImage,
    price: 29,
    creator: {
      name: "Sarah Johnson",
      avatar: undefined,
    },
    rating: 4.8,
    reviewCount: 124,
    category: "Logo",
    isPremium: true,
  };

  return (
    <div className="max-w-xs">
      <TemplateCard
        template={template}
        onPreview={(id) => console.log(`Preview: ${id}`)}
        onPurchase={(id) => console.log(`Purchase: ${id}`)}
      />
    </div>
  );
}
