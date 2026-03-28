"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Brain,
  Compass,
  Search,
  Heart,
  Settings,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Live Map Dashboard",
    description:
      "Full-screen interactive map with event markers, category filters, location search via Nominatim, and custom zoom controls.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Compass,
    title: "Zone Explorer",
    description:
      "Click anywhere to explore a zone with radius-based filtering, Exa semantic search, and Apify-sourced related articles.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Reporting",
    description:
      "Flutter-powered app lets users report news with location, category, and media directly from the field.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "Open AI Processing",
    description:
      "Open AI normalizes raw reports, clusters similar events, and generates intelligent summaries.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Trust Scoring",
    description:
      "User reports increase trust scores. More corroboration means higher verification levels from Low to Verified.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description:
      "Convex-powered live subscriptions ensure you see events the moment they happen with instant sync.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Exa integration provides zone-scoped semantic web search to find related content and context.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "News Enrichment",
    description:
      "Automatic article scraping via Apify adds mainstream news context to every event cluster.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Heart,
    title: "Favorites System",
    description:
      "Logged-in users can favorite events from any page, tracked via Firebase and viewable in a dedicated tab.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Settings,
    title: "Responsive Design",
    description:
      "Fully responsive design powered by Vercel V0 across mobile, tablet, and desktop.",
    gradient: "from-slate-500 to-gray-500",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

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
            Dashboard Features
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Everything you need to track, verify, and understand real-world
            events as they unfold.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-card/80 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon */}
              <div className="mb-4 relative">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                {/* Glow effect on hover */}
                <div
                  className={`absolute -inset-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl transition-opacity duration-300 ${
                    hoveredIndex === index ? "opacity-20" : ""
                  }`}
                />
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
