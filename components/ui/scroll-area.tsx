"use client";

import { forwardRef, ReactNode, useEffect, useRef, useState } from "react";

export interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string | number;
  maxWidth?: string | number;
  showScrollbar?: boolean;
  hideScrollbar?: boolean;
  scrollbarSize?: "sm" | "md" | "lg";
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  autoHide?: boolean;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      className = "",
      maxHeight = "300px",
      maxWidth = "100%",
      showScrollbar = true,
      hideScrollbar = false,
      scrollbarSize = "md",
      onScroll,
      autoHide = true,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const checkScroll = () => {
        const hasVerticalScroll = container.scrollHeight > container.clientHeight;
        const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
        setShowScroll(hasVerticalScroll || hasHorizontalScroll);
      };

      checkScroll();
      window.addEventListener("resize", checkScroll);

      return () => {
        window.removeEventListener("resize", checkScroll);
      };
    }, [children]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      onScroll?.(target.scrollTop, target.scrollLeft);
    };

    const scrollbarSizes = {
      sm: "w-1",
      md: "w-1.5",
      lg: "w-2",
    };

    const showScrollbarCondition = showScrollbar && !hideScrollbar && showScroll;

    return (
      <div
        ref={ref}
        className={`scroll-area-wrapper ${className}`}
        style={{
          maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          position: "relative",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={containerRef}
          className="scroll-area-content"
          onScroll={handleScroll}
          style={{
            overflow: "auto",
            maxHeight: "100%",
            maxWidth: "100%",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>

        {/* Custom Scrollbar */}
        {showScrollbarCondition && (
          <>
            <div
              className={`scrollbar-track vertical ${scrollbarSizes[scrollbarSize]}`}
              style={{
                opacity: autoHide && !isHovered ? 0 : 1,
                transition: "opacity 0.3s",
              }}
            >
              <div className="scrollbar-thumb" />
            </div>
            <div
              className={`scrollbar-track horizontal ${scrollbarSizes[scrollbarSize]}`}
              style={{
                opacity: autoHide && !isHovered ? 0 : 1,
                transition: "opacity 0.3s",
              }}
            >
              <div className="scrollbar-thumb" />
            </div>
          </>
        )}

        <style jsx>{`
          .scroll-area-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
          }

          .scroll-area-content {
            height: 100%;
            width: 100%;
            scroll-behavior: smooth;
          }

          .scroll-area-content::-webkit-scrollbar {
            display: none;
          }

          /* Custom Scrollbar Track */
          .scrollbar-track {
            position: absolute;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 9999px;
            pointer-events: none;
          }

          .scrollbar-track.vertical {
            top: 4px;
            right: 4px;
            bottom: 4px;
            width: 4px;
          }

          .scrollbar-track.horizontal {
            bottom: 4px;
            left: 4px;
            right: 4px;
            height: 4px;
          }

          .scrollbar-track.w-1 {
            width: 4px;
          }

          .scrollbar-track.w-1.horizontal {
            height: 4px;
          }

          .scrollbar-track.w-1.5 {
            width: 6px;
          }

          .scrollbar-track.w-1.5.horizontal {
            height: 6px;
          }

          .scrollbar-track.w-2 {
            width: 8px;
          }

          .scrollbar-track.w-2.horizontal {
            height: 8px;
          }

          .scrollbar-track .scrollbar-thumb {
            width: 100%;
            height: 100%;
            background: rgba(244, 197, 66, 0.15);
            border-radius: 9999px;
            transition: background 0.3s;
          }

          .scrollbar-track .scrollbar-thumb:hover {
            background: rgba(244, 197, 66, 0.25);
          }

          /* Responsive */
          @media (max-width: 480px) {
            .scrollbar-track {
              opacity: 1 !important;
            }

            .scrollbar-track.vertical {
              right: 2px;
              top: 2px;
              bottom: 2px;
            }

            .scrollbar-track.horizontal {
              bottom: 2px;
              left: 2px;
              right: 2px;
            }
          }
        `}</style>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;