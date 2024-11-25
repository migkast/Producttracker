export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">How It Works</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Track Prices</h2>
          <p className="text-muted-foreground">Add products you want to monitor and we'll track their prices across multiple retailers.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Get Alerts</h2>
          <p className="text-muted-foreground">Receive notifications when prices drop below your target price.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Save Money</h2>
          <p className="text-muted-foreground">Buy at the best time and save money on your purchases.</p>
        </section>
      </div>
    </div>
  );
}