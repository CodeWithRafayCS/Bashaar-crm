"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  distance?: string;
  easing?: string;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
  className = "",
  distance = "30px",
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const getTransform = () => {
    if (direction === "none") return "none";
    if (!isVisible) {
      switch (direction) {
        case "up": return `translateY(${distance})`;
        case "down": return `translateY(-${distance})`;
        case "left": return `translateX(${distance})`;
        case "right": return `translateX(-${distance})`;
        default: return "none";
      }
    }
    return "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "visible" : ""} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}

      <style jsx>{`
        .reveal {
          will-change: transform, opacity;
        }

        .reveal.visible {
          pointer-events: auto;
        }

        .reveal:not(.visible) {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}