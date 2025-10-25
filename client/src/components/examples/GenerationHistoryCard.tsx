import { GenerationHistoryCard } from '../GenerationHistoryCard';
import sampleImage from '@assets/generated_images/Social_media_graphics_showcase_ad808a32.png';

export default function GenerationHistoryCardExample() {
  const generation = {
    id: "1",
    thumbnail: sampleImage,
    prompt: "Modern tech startup logo with blue gradient and geometric shapes",
    aspectRatio: "1:1",
    createdAt: "2 hours ago",
    isFavorite: false,
  };

  return (
    <div className="max-w-xs">
      <GenerationHistoryCard
        generation={generation}
        onDownload={(id) => console.log(`Download: ${id}`)}
        onToggleFavorite={(id) => console.log(`Toggle favorite: ${id}`)}
        onClick={(id) => console.log(`View: ${id}`)}
      />
    </div>
  );
}
