interface BuildButtonProps {
  hasDocuments: boolean;
  isBuilding: boolean;
  onBuild: () => void;
}

export function BuildButton({ hasDocuments, isBuilding, onBuild }: BuildButtonProps) {
  return (
    <button
      onClick={onBuild}
      disabled={!hasDocuments || isBuilding}
      className="w-full px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isBuilding ? 'Building knowledge base...' : 'Build knowledge base'}
    </button>
  );
}
