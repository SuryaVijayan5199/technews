import type { Metadata } from "next";
export const revalidate = 3600;

export const metadata: Metadata = { title: "Advertise — TechCrest", description: "Reach our tech-savvy audience." };
export default function AdvertisePage() {
  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Advertise with TechCrest</h1>
      <p className="text-muted-foreground mb-6">TechCrest reaches millions of tech enthusiasts every month. Contact our advertising team to explore sponsorship and partnership opportunities.</p>
      <p className="text-muted-foreground">Email us at <a href="mailto:ads@techcrest.io" className="text-[#2D7FF9] underline">ads@techcrest.io</a></p>
    </div>
  );
}
