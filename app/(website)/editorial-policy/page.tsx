import type { Metadata } from "next";
export const metadata: Metadata = { title: "Editorial Policy — TechCrest", description: "Our editorial standards and values." };
export default function EditorialPolicyPage() {
  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Editorial Policy</h1>
      <p className="text-muted-foreground mb-4">TechCrest is committed to accuracy, transparency, and independence in all our reporting.</p>
      <h2 className="text-xl font-bold mt-6 mb-2">Our Standards</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
        <li>All articles are verified by at least one editor before publication.</li>
        <li>We clearly label opinion pieces and sponsored content.</li>
        <li>Corrections are issued promptly and transparently.</li>
        <li>We do not accept payment for editorial coverage.</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">Contact</h2>
      <p className="text-muted-foreground">Editorial inquiries: <a href="mailto:editorial@techcrest.io" className="text-[#2D7FF9] underline">editorial@techcrest.io</a></p>
    </div>
  );
}
