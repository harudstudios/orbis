"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, MapPin, Users, Zap, Sparkles } from "lucide-react";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const counterRef = useRef<{ reports: number; categories: number }>({
    reports: 0,
    categories: 0,
  });
  const [counts, setCounts] = useState({ reports: 0, categories: 0 });

  useEffect(() => {
    setMounted(true);

    // Animated counter
    const targetReports = 24;
    const targetCategories = 13;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      counterRef.current.reports = Math.round(targetReports * easeOut);
      counterRef.current.categories = Math.round(targetCategories * easeOut);
      setCounts({ ...counterRef.current });

      if (step >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient overlays */}
      <div className="absolute inset-0  z-[1]" />

      {/* Animated gradient blobs */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0 animate-float" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] z-0 animate-float animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] z-0 animate-pulse-slow" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            People powered, real-time AI news network
          </div>

          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-block">Real-Time</span>{" "}
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary animate-gradient">
              Trust-Based
            </span>
            <br />
            <span className="inline-block">News Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Users act as real-time sensors. Report events from the field through
            our mobile app, and watch as AI transforms raw signals into
            verified, visual intelligence on a live map.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link href="/map">
              <Button
                size="lg"
                className="rounded-full px-8 h-14 text-base gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Live Map
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link
              href="https://www.boomshare.ai/shared/01KMV4MJRTY6A43ERDM9MZN75X"
              target="_blank"
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-14 text-base gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-8 max-w-lg mx-auto transition-all duration-700 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-primary mr-1 group-hover:scale-110 transition-transform" />
                <span className="text-2xl sm:text-3xl font-bold font-mono">
                  {counts.categories}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Categories
              </p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary mr-1 group-hover:scale-110 transition-transform" />
                <span className="text-2xl sm:text-3xl font-bold">
                  {counts.reports}/7
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Live Coverage
              </p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-primary mr-1 group-hover:scale-110 transition-transform" />
                <span className="text-2xl sm:text-3xl font-bold">OpenAI</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                AI Powered
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute -bottom-16 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2 hover:border-primary/50 transition-colors">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
