"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/hooks/use-theme";
import { ExternalLink } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Dashboard", href: "/map" },
    { label: "Events", href: "/events" },
    { label: "Analytics", href: "/analytics" },
    { label: "Settings", href: "/settings" },
  ],
  resources: [
    { label: "GitHub Web", href: "https://github.com/harudstudios/orbis" },
    { label: "GitHub App", href: "https://github.com/harudstudios/orbis-app" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/settings" },
    { label: "Terms of Service", href: "/settings" },
    { label: "About Orbis", href: "/settings" },
  ],
};

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={
                  theme === "dark"
                    ? "/logos/light-logo.png"
                    : "/logos/dark-logo.png"
                }
                alt="Orbis"
                width={110}
                height={30}
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Real-time, trust-based AI news network. People report, AI
              processes, you visualize.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    target="_blank"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-muted-foreground/60 mb-6">
            <span>Built with</span>
            <span className="text-foreground/80">Next.js 16</span>
            <span>+</span>
            <span className="text-foreground/80">Flutter</span>
            <span>+</span>
            <span className="text-foreground/80">Convex</span>
            <span>+</span>
            <span className="text-foreground/80">Open AI</span>
            <span>+</span>
            <span className="text-foreground/80">Firebase</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Orbis. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                All systems operational
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono px-2 py-1 bg-muted rounded">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
