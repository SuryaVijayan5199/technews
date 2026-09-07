import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = { title: "Affiliate Disclosure — TechCrest", description: "TechCrest affiliate and monetization disclosure." };
export default function AffiliateDisclosurePage() {
  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Affiliate Disclosure</h1>
      <p className="text-muted-foreground mb-4">TechCrest participates in affiliate marketing programs. This means we may earn a commission when you click on certain links and make a purchase, at no extra cost to you.</p>
      <p className="text-muted-foreground mb-4">Our editorial recommendations are never influenced by affiliate relationships. We only recommend products and services that we believe provide genuine value to our readers.</p>
      <p className="text-muted-foreground">If you have questions about our affiliate relationships, contact us at <a href="mailto:disclosure@techcrest.io" className="text-[#2D7FF9] underline">disclosure@techcrest.io</a></p>
    </div>
  );
}
