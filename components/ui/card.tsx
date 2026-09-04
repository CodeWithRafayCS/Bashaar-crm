"use client";

import { forwardRef, ReactNode, HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "dark" | "gold" | "outline";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

export interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

const VARIANTS = {
  default: {
    bg: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.05)",
    shadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  glass: {
    bg: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.05)",
    shadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  dark: {
    bg: "rgba(0, 0, 0, 0.3)",
    border: "rgba(255, 255, 255, 0.04)",
    shadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
  },
  gold: {
    bg: "rgba(244, 197, 66, 0.03)",
    border: "rgba(244, 197, 66, 0.08)",
    shadow: "0 20px 60px rgba(244, 197, 66, 0.05)",
  },
  outline: {
    bg: "transparent",
    border: "rgba(255, 255, 255, 0.04)",
    shadow: "none",
  },
};

const PADDING = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      variant = "default",
      padding = "md",
      hoverable = false,
      clickable = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const variantStyles = VARIANTS[variant];
    const paddingClasses = PADDING[padding];

    return (
      <div
        ref={ref}
        className={`card ${paddingClasses} ${hoverable ? "hoverable" : ""} ${clickable ? "clickable" : ""} ${className}`}
        style={{
          background: variantStyles.bg,
          borderColor: variantStyles.border,
          boxShadow: variantStyles.shadow,
        }}
        onClick={onClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={(e) => {
          if (clickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick?.();
          }
        }}
        {...props}
      >
        {children}

        <style jsx>{`
          .card {
            border: 1px solid;
            border-radius: 14px;
            backdrop-filter: ${variant === "glass" ? "blur(20px)" : "none"};
            -webkit-backdrop-filter: ${variant === "glass" ? "blur(20px)" : "none"};
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            width: 100%;
          }

          .card.hoverable:hover {
            transform: translateY(-4px);
            border-color: rgba(244, 197, 66, 0.08);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
          }

          .card.clickable {
            cursor: pointer;
          }

          .card.clickable:active {
            transform: scale(0.98);
          }

          .card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(
              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(244, 197, 66, 0.02) 0%,
              transparent 60%
            );
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 0;
          }

          .card.hoverable:hover::after {
            opacity: 1;
          }

          .card > * {
            position: relative;
            z-index: 1;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .card {
              border-radius: 12px;
            }

            .card.p-3 { padding: 0.75rem; }
            .card.p-5 { padding: 1.25rem; }
            .card.p-6 { padding: 1.5rem; }
            .card.p-8 { padding: 1.5rem; }
          }
        `}</style>
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-header ${className}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }

          .card-header:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          @media (max-width: 480px) {
            .card-header {
              flex-wrap: wrap;
            }
          }
        `}</style>
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-body ${className}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .card-body {
            flex: 1;
          }
        `}</style>
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-footer ${className}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .card-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            margin-top: 0.75rem;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            flex-wrap: wrap;
          }

          .card-footer:first-child {
            border-top: none;
            margin-top: 0;
            padding-top: 0;
          }

          @media (max-width: 480px) {
            .card-footer {
              flex-direction: column;
              align-items: stretch;
            }
          }
        `}</style>
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`card-title ${className}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            letter-spacing: -0.025em;
          }

          @media (max-width: 480px) {
            .card-title {
              font-size: 1rem;
            }
          }
        `}</style>
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

export const CardSubtitle = forwardRef<HTMLParagraphElement, CardSubtitleProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`card-subtitle ${className}`}
        {...props}
      >
        {children}

        <style jsx>{`
          .card-subtitle {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.3);
            margin: 0;
          }

          @media (max-width: 480px) {
            .card-subtitle {
              font-size: 0.75rem;
            }
          }
        `}</style>
      </p>
    );
  }
);

CardSubtitle.displayName = "CardSubtitle";

export default Card;