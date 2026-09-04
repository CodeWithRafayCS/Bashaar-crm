"use client";

import { forwardRef, HTMLAttributes } from "react";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "dashed" | "dotted" | "gradient" | "glow";
  thickness?: "thin" | "medium" | "thick";
  className?: string;
  label?: string;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      orientation = "horizontal",
      variant = "default",
      thickness = "thin",
      className = "",
      label,
      ...props
    },
    ref
  ) => {
    const thicknessClasses = {
      thin: orientation === "horizontal" ? "h-px" : "w-px",
      medium: orientation === "horizontal" ? "h-0.5" : "w-0.5",
      thick: orientation === "horizontal" ? "h-1" : "w-1",
    };

    const variantClasses = {
      default: "bg-white/5",
      dashed: "bg-transparent border-t border-dashed border-white/5",
      dotted: "bg-transparent border-t border-dotted border-white/5",
      gradient: "bg-gradient-to-r from-transparent via-white/10 to-transparent",
      glow: "bg-gradient-to-r from-transparent via-gold/20 to-transparent",
    };

    const isVertical = orientation === "vertical";

    if (label) {
      return (
        <div
          ref={ref}
          className={`separator-with-label ${className}`}
          {...props}
        >
          <div
            className={`separator-line ${isVertical ? "vertical" : "horizontal"} ${variantClasses[variant]} ${thicknessClasses[thickness]}`}
          />
          <span className="separator-label">{label}</span>
          <div
            className={`separator-line ${isVertical ? "vertical" : "horizontal"} ${variantClasses[variant]} ${thicknessClasses[thickness]}`}
          />

          <style jsx>{`
            .separator-with-label {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              width: 100%;
            }

            .separator-line {
              flex: 1;
              border: none;
            }

            .separator-line.horizontal {
              height: ${thickness === "thin" ? "1px" : thickness === "medium" ? "2px" : "4px"};
            }

            .separator-line.vertical {
              width: ${thickness === "thin" ? "1px" : thickness === "medium" ? "2px" : "4px"};
              min-height: 24px;
            }

            .separator-line.dashed {
              border-style: dashed;
            }

            .separator-line.dotted {
              border-style: dotted;
            }

            .separator-line.gradient {
              background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
            }

            .separator-line.glow {
              background: linear-gradient(to right, transparent, rgba(244,197,66,0.15), transparent);
            }

            .separator-label {
              font-size: 0.7rem;
              font-weight: 500;
              color: rgba(255, 255, 255, 0.15);
              text-transform: uppercase;
              letter-spacing: 0.5px;
              white-space: nowrap;
            }

            /* Vertical separator with label (not supported) */
            .separator-with-label.vertical {
              flex-direction: column;
              width: auto;
              height: 100%;
            }

            .separator-with-label.vertical .separator-line {
              flex: 1;
              width: ${thickness === "thin" ? "1px" : thickness === "medium" ? "2px" : "4px"};
              min-height: auto;
            }

            /* Responsive */
            @media (max-width: 480px) {
              .separator-label {
                font-size: 0.6rem;
              }

              .separator-with-label {
                gap: 0.5rem;
              }
            }
          `}</style>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`separator ${className}`}
        style={{
          display: isVertical ? "inline-flex" : "flex",
          width: isVertical ? "auto" : "100%",
          height: isVertical ? "100%" : "auto",
          minHeight: isVertical ? "24px" : "auto",
        }}
        {...props}
      >
        <div
          className={`separator-line ${isVertical ? "vertical" : "horizontal"} ${variantClasses[variant]} ${thicknessClasses[thickness]}`}
        />

        <style jsx>{`
          .separator {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .separator-line {
            border: none;
            flex: 1;
          }

          .separator-line.horizontal {
            height: ${thickness === "thin" ? "1px" : thickness === "medium" ? "2px" : "4px"};
            width: 100%;
          }

          .separator-line.vertical {
            width: ${thickness === "thin" ? "1px" : thickness === "medium" ? "2px" : "4px"};
            height: 100%;
            min-height: 24px;
          }

          .separator-line.dashed {
            border-style: dashed;
            background: transparent !important;
          }

          .separator-line.dotted {
            border-style: dotted;
            background: transparent !important;
          }

          .separator-line.gradient {
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
          }

          .separator-line.glow {
            background: linear-gradient(to right, transparent, rgba(244,197,66,0.15), transparent);
          }
        `}</style>
      </div>
    );
  }
);

Separator.displayName = "Separator";

export default Separator;