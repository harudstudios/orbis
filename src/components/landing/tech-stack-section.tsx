"use client";

import { useEffect, useRef, useState } from "react";

const techStack = [
  { name: "Vercel V0", category: "Styling", color: "text-teal-500" },
  { name: "Mobbin UI", category: "Design", color: "text-pink-500" },
  { name: "Convex", category: "Database", color: "text-orange-500" },
  { name: "OpenAI", category: "AI", color: "text-blue-500" },
  { name: "Exa", category: "Search", color: "text-rose-500" },
  { name: "Apify", category: "Scraping", color: "text-emerald-500" },
  { name: "Next.js 16", category: "Framework", color: "text-foreground" },
  { name: "Flutter", category: "Mobile", color: "text-sky-500" },
  { name: "Leaflet", category: "Maps", color: "text-green-500" },
  { name: "Nominatim", category: "Geocoding", color: "text-amber-500" },
];

export function TechStackSection() {
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
    <section
      ref={sectionRef}
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent animate-pulse animation-delay-500" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse animation-delay-1000" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Built with Modern Tech
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Powered by cutting-edge technologies for speed, reliability, and
            real-time updates
          </p>
        </div>

        {/* Tech Stack Marquee */}
        <div className="relative overflow-hidden py-4 mask-gradient">
          <div className="flex gap-4 animate-marquee">
            {[...techStack, ...techStack].map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className={`flex-shrink-0 px-6 py-4 bg-card border border-border rounded-xl transition-all duration-300 hover:border-primary/50 hover:scale-105 group ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <p
                  className={`font-semibold whitespace-nowrap ${tech.color} group-hover:text-primary transition-colors`}
                >
                  {tech.name}
                </p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Second row moving opposite direction */}
        <div className="relative overflow-hidden py-4 mask-gradient">
          <div className="flex gap-4 animate-marquee-reverse">
            {[
              ...techStack.slice().reverse(),
              ...techStack.slice().reverse(),
            ].map((tech, index) => (
              <div
                key={`${tech.name}-reverse-${index}`}
                className={`flex-shrink-0 px-6 py-4 bg-card border border-border rounded-xl transition-all duration-300 hover:border-primary/50 hover:scale-105 group ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <p
                  className={`font-semibold whitespace-nowrap ${tech.color} group-hover:text-primary transition-colors`}
                >
                  {tech.name}
                </p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
        .mask-gradient {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
      `}</style>
    </section>
  );
}
