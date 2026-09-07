import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = { title: "Careers — TechCrest", description: "Join the TechCrest team." };
export default function CareersPage() {
  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Careers at TechCrest</h1>
      <p className="text-muted-foreground mb-6">We are always looking for talented journalists, editors, and engineers to join our team. Check back soon for open positions.</p>
      <p className="text-muted-foreground">In the meantime, send your CV and portfolio to <a href="mailto:careers@techcrest.io" className="text-[#2D7FF9] underline">careers@techcrest.io</a></p>
    </div>
  );
}
