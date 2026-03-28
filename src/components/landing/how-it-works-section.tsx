"use client";

import { useEffect, useRef, useState } from "react";
import {
  Smartphone,
  Cpu,
  MapPinned,
  CheckCircle,
  Shield,
  Newspaper,
} from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    number: "01",
    title: "Report from the Field",
    description:
      "Users submit reports through the Flutter mobile app with location, category, and description. Firebase Auth ensures verified submissions.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: Cpu,
    number: "02",
    title: "AI Normalization",
    description:
      "OpenAI normalizes raw input into structured data: title, description, and summary. Semantic similarity prevents duplicates.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Shield,
    number: "03",
    title: "Clustering & Dedup",
    description:
      "System finds nearby events within 5km. If similarity >= 0.8, reports merge into existing clusters. One submission per user per cluster enforced.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: MapPinned,
    number: "04",
    title: "Live Dashboard",
    description:
      "Events appear instantly on the Leaflet map via Convex real-time subscriptions. Filter by category, search locations, explore zones.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    icon: CheckCircle,
    number: "05",
    title: "Trust Verification",
    description:
      "Each user report increases the trust score. More corroboration = higher trust level. Only real user reports count, not scraped articles.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  {
    icon: Newspaper,
    number: "06",
    title: "News Enrichment",
    description:
      "Apify scrapes Google News for related articles. Exa provides semantic web search. Articles tracked separately for reference context.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance active step
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

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
            Event Submission Flow
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            From citizen report to verified intelligence in seconds
          </p>
        </div>

        {/* Steps Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative p-6 rounded-2xl border ${step.border} ${step.bg} backdrop-blur-sm transition-all duration-500 cursor-pointer ${
                  activeStep === index
                    ? "scale-[1.02] shadow-lg"
                    : "hover:scale-[1.01]"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step number */}
                <div
                  className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${step.bg} border ${step.border} flex items-center justify-center`}
                >
                  <span className={`text-xs font-bold font-mono ${step.color}`}>
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center mb-4 transition-transform duration-300 ${
                    activeStep === index ? "scale-110" : ""
                  }`}
                >
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Active indicator */}
                {activeStep === index && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${step.color.replace("text-", "from-")} to-transparent`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Architecture diagram */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-muted-foreground bg-muted/50 px-6 py-3 rounded-full border border-border/50">
            <span className="text-orange-500">Flutter App</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="text-blue-500">Next.js API</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="text-purple-500">Open AI</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="text-green-500">Convex DB</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="text-teal-500">Live Dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
}
