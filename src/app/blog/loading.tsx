export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <div className="flex items-center gap-3 rounded-full border border-cyan-500/30 bg-slate-900/60 px-5 py-3 font-mono text-sm text-cyan-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        LOADING...
      </div>
    </main>
  );
}
