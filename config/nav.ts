export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  description?: string;
  isNew?: boolean;
  isTrending?: boolean;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { label: "News", href: "/news", description: "Latest technology news from around the world" },
  { label: "Phone", href: "/phone", description: "Smartphones, reviews, and mobile news" },
  { label: "Audio", href: "/audio", description: "Headphones, speakers, and audio gear" },
  { label: "Robotic", href: "/robotics", description: "Robotics, automation, and AI hardware" },
  { label: "Fitness", href: "/fitness", description: "Wearables, health tech, and fitness gadgets" },
  { label: "Security", href: "/security", description: "Cybersecurity, privacy, and data protection" },
  { label: "AI", href: "/ai", description: "Artificial intelligence, LLMs, and machine learning" },
  { label: "Home", href: "/smart-home", description: "Smart home devices, hubs, and automation" },
  { label: "EVs", href: "/evs", description: "Electric vehicles, charging, and future mobility" },
  { label: "Crypto", href: "/crypto", description: "Cryptocurrency, blockchain, and Web3" },
];


export const categoryNav = [
  { label: "News",        href: "/news",        icon: "Newspaper",   color: "#2D7FF9" },
  { label: "Phone",       href: "/phone",       icon: "Smartphone",  color: "#0ea5e9" },
  { label: "Audio",       href: "/audio",       icon: "Headphones",  color: "#8b5cf6" },
  { label: "Robotic",     href: "/robotics",    icon: "Bot",         color: "#6366f1" },
  { label: "Fitness",     href: "/fitness",     icon: "Activity",    color: "#10b981" },
  { label: "Security",    href: "/security",    icon: "Shield",      color: "#f59e0b" },
  { label: "AI",          href: "/ai",          icon: "Brain",       color: "#a855f7" },
  { label: "Home",        href: "/smart-home",  icon: "Home",        color: "#14b8a6" },
  { label: "EVs",         href: "/evs",         icon: "Zap",         color: "#22c55e" },
  { label: "Crypto",      href: "/crypto",      icon: "Bitcoin",     color: "#f97316" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Advertise", href: "/advertise" },
  ],
  content: [
    { label: "News",        href: "/news" },
    { label: "Phone",       href: "/phone" },
    { label: "Audio",       href: "/audio" },
    { label: "Robotic",     href: "/robotics" },
    { label: "Fitness",     href: "/fitness" },
    { label: "Security",    href: "/security" },
    { label: "AI",          href: "/ai" },
    { label: "Home",        href: "/smart-home" },
    { label: "EVs",         href: "/evs" },
    { label: "Crypto",      href: "/crypto" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
  social: [
    { label: "Twitter / X", href: "https://twitter.com/techio" },
    { label: "YouTube", href: "https://youtube.com/@techio" },
    { label: "Facebook", href: "https://facebook.com/techio" },
    { label: "Instagram", href: "https://instagram.com/techio" },
    { label: "LinkedIn", href: "https://linkedin.com/company/techio" },
    { label: "RSS Feed", href: "/feed.xml" },
  ],
};
