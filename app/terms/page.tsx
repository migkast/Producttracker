export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-sm max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>1. Terms</h2>
        <p>By accessing this website, you agree to be bound by these terms of service.</p>
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily access the materials on our website.</p>
      </div>
    </div>
  );
}