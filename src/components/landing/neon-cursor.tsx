"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function NeonCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.body.classList.add("landing-cursor-hidden");
    return () => {
      document.body.classList.remove("landing-cursor-hidden");
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const cursor = cursorRef.current;
    const trail = cursorTrailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer";
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth animation loop
    const animate = () => {
      // Instant cursor position
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      // Smooth trail following
      trailX += (mouseX - trailX) * 0.15;
      trailY += (mouseY - trailY) * 0.15;
      trail.style.left = `${trailX}px`;
      trail.style.top = `${trailY}px`;

      animationId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    animationId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, [isMounted]);

  // Don't render anything on server
  if (!isMounted) return null;

  return (
    <>
      {/* Trail glow */}
      <div
        ref={cursorTrailRef}
        className={`fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`rounded-full transition-all duration-300 ${
            isPointer
              ? "w-16 h-16 bg-primary/20 blur-xl"
              : "w-12 h-12 bg-primary/15 blur-lg"
          }`}
        />
      </div>

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        {/* Outer ring */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary transition-all duration-300 ${
            isPointer ? "w-12 h-12 border-primary/60" : "w-8 h-8"
          }`}
          style={{
            boxShadow: isPointer
              ? "0 0 20px rgba(234, 88, 12, 0.5), 0 0 40px rgba(234, 88, 12, 0.3), inset 0 0 15px rgba(234, 88, 12, 0.2)"
              : "0 0 10px rgba(234, 88, 12, 0.4), 0 0 20px rgba(234, 88, 12, 0.2)",
          }}
        />

        {/* Inner dot */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-200 ${
            isPointer ? "w-2 h-2" : "w-1.5 h-1.5"
          }`}
          style={{
            boxShadow:
              "0 0 8px rgba(234, 88, 12, 0.8), 0 0 16px rgba(234, 88, 12, 0.4)",
          }}
        />
      </div>
    </>
  );
}
