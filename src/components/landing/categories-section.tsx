"use client";

import { useEffect, useRef, useState } from "react";
import {
  Car,
  Megaphone,
  Siren,
  Waves,
  Flame,
  Building2,
  HeartPulse,
  Landmark,
  Swords,
  CloudLightning,
  TrafficCone,
  Leaf,
  Pin,
} from "lucide-react";

const categories = [
  {
    id: "accident",
    label: "Accident",
    icon: Car,
    color: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
  },
  {
    id: "protest",
    label: "Protest",
    icon: Megaphone,
    color:
      "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
  },
  {
    id: "crime",
    label: "Crime",
    icon: Siren,
    color:
      "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20",
  },
  {
    id: "natural_disaster",
    label: "Natural Disaster",
    icon: Waves,
    color:
      "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  },
  {
    id: "fire",
    label: "Fire",
    icon: Flame,
    color:
      "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: Building2,
    color:
      "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20",
  },
  {
    id: "health",
    label: "Health",
    icon: HeartPulse,
    color:
      "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20",
  },
  {
    id: "politics",
    label: "Politics",
    icon: Landmark,
    color:
      "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20",
  },
  {
    id: "conflict",
    label: "Conflict",
    icon: Swords,
    color: "bg-red-600/10 text-red-600 border-red-600/20 hover:bg-red-600/20",
  },
  {
    id: "weather",
    label: "Weather",
    icon: CloudLightning,
    color: "bg-sky-500/10 text-sky-500 border-sky-500/20 hover:bg-sky-500/20",
  },
  {
    id: "traffic",
    label: "Traffic",
    icon: TrafficCone,
    color:
      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
  },
  {
    id: "environment",
    label: "Environment",
    icon: Leaf,
    color:
      "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  },
  {
    id: "other",
    label: "Other",
    icon: Pin,
    color:
      "bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20",
  },
];

export function CategoriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      id="categories"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            13 Event Categories
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Comprehensive coverage across all types of newsworthy events
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group flex items-center gap-2 px-5 py-3 border rounded-full transition-all duration-300 cursor-default ${category.color} ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              } ${hoveredId === category.id ? "scale-110 shadow-lg" : ""}`}
              style={{ transitionDelay: `${index * 40}ms` }}
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <category.icon
                className={`h-4 w-4 transition-transform duration-300 ${
                  hoveredId === category.id ? "scale-125 rotate-12" : ""
                }`}
              />
              <span className="text-sm font-medium">{category.label}</span>

              {/* Ripple effect on hover */}
              {hoveredId === category.id && (
                <div className="absolute inset-0 rounded-full animate-pulse opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
