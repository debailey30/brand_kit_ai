import { GenerationPreview } from '../GenerationPreview';
import sampleImage from '@assets/generated_images/Social_media_graphics_showcase_ad808a32.png';

export default function GenerationPreviewExample() {
  return (
    <div className="h-96">
      <GenerationPreview
        imageUrl={sampleImage}
        onDownload={() => console.log('Download clicked')}
        onRegenerate={() => console.log('Regenerate clicked')}
      />
    </div>
  );
}
