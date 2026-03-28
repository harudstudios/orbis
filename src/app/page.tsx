import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TrustSection } from "@/components/landing/trust-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { NeonCursor } from "@/components/landing/neon-cursor";
import { AnimatedBackground } from "@/components/landing/animated-background";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Neon cursor - only on landing page */}
      <NeonCursor />

      {/* Animated background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <CategoriesSection />
        <TechStackSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
