"use client";
export default function ProjectError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-surface">
      <div className="text-center max-w-md px-6">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Algo deu errado</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">{error.message}</p>
        <button onClick={reset} className="bg-primary text-on-primary px-6 py-3 font-label-md uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
