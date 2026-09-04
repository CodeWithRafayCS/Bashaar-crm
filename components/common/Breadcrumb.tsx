"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeLabel?: string;
  showHome?: boolean;
  maxItems?: number;
}

const defaultSeparator = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const homeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
  </svg>
);

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  "leads": "Leads",
  "companies": "Companies",
  "pipeline": "Pipeline",
  "deals": "Deals",
  "tasks": "Tasks",
  "activities": "Activities",
  "reports": "Reports",
  "team": "Team",
  "settings": "Settings",
  "login": "Login",
  "about": "About",
  "contact": "Contact",
  "privacy": "Privacy",
};

export function Breadcrumb({
  items: customItems,
  separator = defaultSeparator,
  homeLabel = "Home",
  showHome = true,
  maxItems = 5,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from path
  const generateItemsFromPath = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Build path progressively
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Check if it's a dynamic route (like [id])
      const isDynamic = segment.startsWith("[") && segment.endsWith("]");
      const label = isDynamic ? "Detail" : (routeLabels[segment] || segment);
      
      // If it's the last segment, don't make it a link
      const isLast = index === segments.length - 1;
      
      items.push({
        label: label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  };

  // Use custom items if provided, otherwise generate from path
  const breadcrumbItems = customItems || generateItemsFromPath();

  // Add home if enabled
  const allItems = showHome 
    ? [{ label: homeLabel, href: "/", icon: homeIcon }, ...breadcrumbItems]
    : breadcrumbItems;

  // Handle max items with ellipsis
  const displayItems = allItems.length > maxItems && maxItems > 0
    ? [
        allItems[0],
        { label: "...", href: undefined } as BreadcrumbItem,
        ...allItems.slice(-(maxItems - 1)),
      ]
    : allItems;

  // If only one item and it's not a link, just show it
  if (allItems.length === 1 && !allItems[0].href) {
    return (
      <div className="breadcrumb">
        <span className="breadcrumb-current">{allItems[0].label}</span>
      </div>
    );
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === "..." && !item.href;

          return (
            <Fragment key={index}>
              <li className="breadcrumb-item">
                {isEllipsis ? (
                  <span className="breadcrumb-ellipsis">…</span>
                ) : item.href && !isLast ? (
                  <Link href={item.href} className="breadcrumb-link">
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    <span className="breadcrumb-label">{item.label}</span>
                  </Link>
                ) : (
                  <span className={`breadcrumb-current ${item.icon ? "has-icon" : ""}`}>
                    {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                    <span className="breadcrumb-label">{item.label}</span>
                  </span>
                )}
              </li>
              {!isLast && (
                <li className="breadcrumb-separator" aria-hidden="true">
                  {separator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>

      <style jsx>{`
        .breadcrumb {
          display: flex;
          align-items: center;
          padding: 0.25rem 0;
          font-size: 0.85rem;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0.25rem;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
        }

        .breadcrumb-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          transition: all 0.3s;
          padding: 0.15rem 0.3rem;
          border-radius: 4px;
        }

        .breadcrumb-link:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
        }

        .breadcrumb-current {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          padding: 0.15rem 0.3rem;
        }

        .breadcrumb-current.has-icon {
          gap: 0.3rem;
        }

        .breadcrumb-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.2);
        }

        .breadcrumb-link .breadcrumb-icon {
          color: rgba(255, 255, 255, 0.15);
        }

        .breadcrumb-link:hover .breadcrumb-icon {
          color: rgba(255, 255, 255, 0.3);
        }

        .breadcrumb-ellipsis {
          color: rgba(255, 255, 255, 0.15);
          padding: 0 0.25rem;
          user-select: none;
        }

        .breadcrumb-separator {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.08);
          margin: 0 0.1rem;
        }

        .breadcrumb-separator svg {
          width: 14px;
          height: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .breadcrumb {
            font-size: 0.75rem;
          }

          .breadcrumb-link,
          .breadcrumb-current {
            padding: 0.1rem 0.2rem;
          }

          .breadcrumb-label {
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .breadcrumb-icon {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb {
            font-size: 0.7rem;
          }

          .breadcrumb-label {
            max-width: 60px;
          }

          .breadcrumb-separator svg {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </nav>
  );
}