"use client";

import { useEffect, useRef, useState } from "react";
import { Users, FileText, Shield } from "lucide-react";

const trustLevels = [
  {
    level: "Low",
    score: "0-3",
    color: "bg-gray-500",
    textColor: "text-gray-500",
    borderColor: "border-gray-500/30",
    description: "Initial reports, awaiting corroboration from other users",
  },
  {
    level: "Medium",
    score: "4-9",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500/30",
    description: "Multiple user reports confirming the event",
  },
  {
    level: "High",
    score: "10-19",
    color: "bg-green-500",
    textColor: "text-green-500",
    borderColor: "border-green-500/30",
    description: "Well corroborated by many independent reporters",
  },
  {
    level: "Verified",
    score: "20+",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/30",
    description: "Highly verified with extensive user confirmation",
  },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

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

  // Animate score counter
  useEffect(() => {
    if (!isVisible) return;

    let frame = 0;
    const targetScore = 15;
    const duration = 60;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / duration;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(targetScore * easeOut));

      if (frame >= duration) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Trust-Based Verification
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Every event is scored based on user reports. Real people verify real
            events.
          </p>
        </div>

        {/* Trust Formula - Updated to reflect new formula */}
        <div className="max-w-3xl mx-auto mb-16">
          <div
            className={`bg-card border border-border rounded-2xl p-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Formula */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Trust Score Formula
                </p>
                <div className="font-mono text-xl sm:text-2xl flex items-center gap-3">
                  <span className="text-primary font-bold">Trust Score</span>
                  <span className="text-muted-foreground">=</span>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-semibold">
                      User Reports
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-20 bg-border" />

              {/* Visual example */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Example</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold font-mono">
                      {animatedScore}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      reports
                    </span>
                  </div>
                  <span className="text-muted-foreground">=</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-semibold">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {trustLevels.map((level, index) => (
            <div
              key={level.level}
              className={`group relative bg-card border ${level.borderColor} rounded-xl p-6 hover:border-primary/50 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Color indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${level.color}`}
              />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-4 h-4 rounded-full ${level.color} animate-pulse`}
                />
                <span className={`font-semibold ${level.textColor}`}>
                  {level.level}
                </span>
              </div>

              {/* Score range */}
              <div className="text-3xl font-bold mb-3 font-mono">
                {level.score}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {level.description}
              </p>

              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-xl ${level.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
