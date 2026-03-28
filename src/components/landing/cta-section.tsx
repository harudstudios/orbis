"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Monitor, Zap } from "lucide-react";

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Animated background decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl" />

          <div
            className={`relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 sm:p-12 text-center transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Zap className="h-4 w-4 animate-pulse" />
              Start Exploring Now
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to See the World
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                in Real-Time?
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Explore live events from around the globe on our dashboard, or
              download the Flutter app to become a citizen reporter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/map">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-14 text-base gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Open Dashboard
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-14 text-base gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5"
              >
                <Smartphone className="h-5 w-5" />
                Get Flutter App
              </Button>
            </div>

            {/* Platform badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Available on iOS & Android
              </span>
            </div>

            {/* Decorative grid pattern */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
