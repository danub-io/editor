export default function DashLoading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col animate-pulse">
      <div className="h-16 bg-surface-container-lowest border-b border-outline-variant" />
      <div className="flex-1 max-w-container-max mx-auto px-edge-margin-desktop py-16 w-full">
        <div className="h-10 w-64 bg-surface-dim mb-4" />
        <div className="h-6 w-96 bg-surface-dim mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface-container-lowest border border-outline-variant" />
          ))}
        </div>
      </div>
    </div>
  );
}
