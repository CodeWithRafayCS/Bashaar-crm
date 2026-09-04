"use client";

import { forwardRef, HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      className = "",
      animated = true,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      text: "rounded",
      circle: "rounded-full",
      rect: "rounded",
      card: "rounded-lg",
      avatar: "rounded-full",
      button: "rounded",
    };

    const defaultSizes = {
      text: { width: "100%", height: "1rem" },
      circle: { width: "2.5rem", height: "2.5rem" },
      rect: { width: "100%", height: "6rem" },
      card: { width: "100%", height: "8rem" },
      avatar: { width: "2.5rem", height: "2.5rem" },
      button: { width: "6rem", height: "2.5rem" },
    };

    const styles = {
      width: width || defaultSizes[variant].width,
      height: height || defaultSizes[variant].height,
    };

    return (
      <div
        ref={ref}
        className={`skeleton ${variantClasses[variant]} ${animated ? "animated" : ""} ${className}`}
        style={styles}
        {...props}
      >
        <style jsx>{`
          .skeleton {
            display: inline-block;
            background: rgba(255, 255, 255, 0.03);
            position: relative;
            overflow: hidden;
          }

          .skeleton.animated::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.02) 50%,
              transparent 100%
            );
            animation: shimmer 1.5s ease-in-out infinite;
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          /* Responsive */
          @media (max-width: 480px) {
            .skeleton {
              min-width: 2rem;
              min-height: 1rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

export default Skeleton;