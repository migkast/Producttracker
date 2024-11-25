export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="max-w-lg mx-auto">
        <p className="text-muted-foreground mb-8">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <div className="space-y-4">
          <p><strong>Email:</strong> support@pricewatch.com</p>
          <p><strong>Hours:</strong> Monday - Friday, 9am - 5pm EST</p>
        </div>
      </div>
    </div>
  );
}