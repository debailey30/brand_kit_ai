import { GeneratorControls } from '../GeneratorControls';

export default function GeneratorControlsExample() {
  return (
    <div className="max-w-md">
      <GeneratorControls
        onGenerate={(settings) => console.log('Generate:', settings)}
        generationsRemaining={3}
      />
    </div>
  );
}
