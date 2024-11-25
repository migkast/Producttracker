export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Information We Collect</h2>
        <p>We collect information that you provide directly to us when using our service.</p>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to provide and improve our services.</p>
      </div>
    </div>
  );
}