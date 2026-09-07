import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy — TechCrest", description: "How TechCrest uses cookies." };
export default function CookiesPage() {
  return (
    <div className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Cookie Policy</h1>
      <p className="text-muted-foreground mb-4">TechCrest uses cookies to provide and improve our services, personalize content, and analyze traffic. By using our site, you agree to our use of cookies.</p>
      <h2 className="text-xl font-bold mt-6 mb-2">Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
        <li><strong>Essential:</strong> Required for the site to function correctly.</li>
        <li><strong>Analytics:</strong> Help us understand how visitors use TechCrest.</li>
        <li><strong>Preferences:</strong> Remember your settings like dark/light mode.</li>
      </ul>
      <p className="text-muted-foreground mt-6">You can control cookies through your browser settings. For more information, see our <a href="/privacy" className="text-[#2D7FF9] underline">Privacy Policy</a>.</p>
    </div>
  );
}
