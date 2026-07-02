export default function ProjectLoading() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-surface-container-lowest border-r border-outline-variant animate-pulse" />
      <div className="flex-1 p-12 animate-pulse">
        <div className="h-8 w-64 bg-surface-dim mb-4" />
        <div className="h-4 w-96 bg-surface-dim" />
      </div>
    </div>
  );
}
