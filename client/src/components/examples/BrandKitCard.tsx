import { BrandKitCard } from '../BrandKitCard';
import logoImage from '@assets/generated_images/Sample_brand_logo_mockup_4d82739b.png';

export default function BrandKitCardExample() {
  const brandKit = {
    id: "1",
    name: "Tech Startup Brand",
    thumbnail: logoImage,
    colors: ["#8B5CF6", "#3B82F6", "#10B981"],
    assetCount: 12,
    lastModified: "2 hours ago",
    tags: ["Technology", "Modern"],
  };

  return (
    <div className="max-w-sm">
      <BrandKitCard
        brandKit={brandKit}
        onEdit={(id) => console.log(`Edit: ${id}`)}
        onDownload={(id) => console.log(`Download: ${id}`)}
        onDelete={(id) => console.log(`Delete: ${id}`)}
      />
    </div>
  );
}
