export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold neon-text mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-[rgb(var(--text-muted))] mb-8">The page you are looking for doesn't exist or has been moved.</p>
    </div>
  );
}
