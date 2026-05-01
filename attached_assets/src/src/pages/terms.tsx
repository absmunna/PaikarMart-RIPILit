export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 py-4 md:px-4 md:py-6">
      <h1 className="text-2xl font-bold mb-2">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-6">Last updated: April 30, 2026</p>

      <div className="space-y-5 text-sm leading-6 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <section>
          <h2 className="font-semibold mb-1">1. Account & Access</h2>
          <p className="text-muted-foreground">Users must provide accurate information and keep account credentials secure.</p>
        </section>
        <section>
          <h2 className="font-semibold mb-1">2. Buyer Responsibility</h2>
          <p className="text-muted-foreground">Buyers should review product details, pricing, and delivery conditions before placing orders.</p>
        </section>
        <section>
          <h2 className="font-semibold mb-1">3. Seller Responsibility</h2>
          <p className="text-muted-foreground">Sellers are responsible for listing accuracy, product quality, lawful items, and timely fulfillment.</p>
        </section>
        <section>
          <h2 className="font-semibold mb-1">4. Platform Rules</h2>
          <p className="text-muted-foreground">PaikarMart may moderate listings, suspend abuse, and enforce platform safety and compliance rules.</p>
        </section>
      </div>
    </div>
  );
}

