"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Newspaper, Zap, TrendingUp, Star } from "lucide-react";
import type { NavItem } from "@/config/nav";

export function MegaMenu({ items }: { items: NavItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="tc-mega" role="menu">
      <div className="tc-mega__grid">
        {/* Column 1: Core Sub-sections */}
        <div className="tc-mega__col">
          <div className="tc-mega__header">
            <Newspaper className="w-4 h-4 text-brand" />
            <span>Sections &amp; Coverage</span>
          </div>
          <div className="tc-mega__links">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="tc-mega__link group"
                role="menuitem"
              >
                <span className="tc-mega__link-title">{item.label}</span>
                <div className="tc-mega__link-right">
                  {item.isNew && <span className="tc-mega__tag tc-mega__tag--new">New</span>}
                  {item.isTrending && <span className="tc-mega__tag tc-mega__tag--hot">Hot</span>}
                  <ArrowUpRight className="tc-mega__link-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Featured Analysis */}
        <div className="tc-mega__col">
          <div className="tc-mega__header">
            <Zap className="w-4 h-4 text-amber" />
            <span>Featured Analysis</span>
          </div>
          <Link href="/gaming/ps5-pro-vs-gaming-pc-performance-comparison" className="tc-mega__card group">
            <div className="tc-mega__card-img-wrap">
              <Image
                src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=220&fit=crop&q=80"
                alt="Apple Vision Pro 2"
                width={400}
                height={220}
                className="tc-mega__card-img"
              />
              <span className="tc-mega__card-rating"><Star className="w-3 h-3 text-yellow fill-yellow" /> 4.9 Rating</span>
            </div>
            <div className="tc-mega__card-body">
              <span className="tc-mega__card-kicker">EXCLUSIVE REVIEW</span>
              <h5 className="tc-mega__card-title">
                Apple Vision Pro 2: The Definitive 6-Month In-Depth Test
              </h5>
            </div>
          </Link>
        </div>

        {/* Column 3: Top News Headlines */}
        <div className="tc-mega__col">
          <div className="tc-mega__header">
            <TrendingUp className="w-4 h-4 text-red" />
            <span>Top Headlines</span>
          </div>
          <div className="tc-mega__headlines">
            {[
              { title: "Nvidia Blackwell Ultra benchmarks shatter all AI training records", category: "Hardware", time: "10m ago" },
              { title: "OpenAI Sora 2.0 brings real-time physics engine to AI media", category: "AI", time: "25m ago" },
              { title: "Apple M4 Mac Studio teardown reveals modular RAM sockets", category: "Silicon", time: "1h ago" },
            ].map((item, i) => (
              <Link key={i} href="/news" className="tc-mega__headline-item group">
                <span className="tc-mega__headline-num">0{i + 1}</span>
                <div>
                  <h5 className="tc-mega__headline-title">{item.title}</h5>
                  <span className="tc-mega__headline-meta">{item.category} • {item.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
