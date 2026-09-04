"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2, Clock, Users, Building2, DollarSign, FileText } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: "lead" | "company" | "deal" | "task" | "activity";
  href: string;
  icon?: React.ReactNode;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  recentSearches?: string[];
}

export function SearchOverlay({
  isOpen,
  onClose,
  placeholder = "Search leads, companies, deals...",
  recentSearches = [],
}: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Acme Corporation",
      subtitle: "Lead • Technology",
      type: "lead",
      href: "/leads/1",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "2",
      title: "Sarah Johnson",
      subtitle: "Contact • CEO at Acme",
      type: "company",
      href: "/companies/2",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "3",
      title: "$250,000 Enterprise Deal",
      subtitle: "Deal • Negotiation",
      type: "deal",
      href: "/deals/3",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "4",
      title: "Follow-up with Sarah",
      subtitle: "Task • Due today",
      type: "task",
      href: "/tasks/4",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);
          } else if (query.trim()) {
            // Navigate to search results page
            router.push(`/search?q=${encodeURIComponent(query)}`);
            onClose();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, router, onClose]);

  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Handle search
  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter mock results based on query
    const filtered = mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
    setSelectedIndex(-1);
    setIsLoading(false);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search"
          />
          {query && (
            <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="search-hint">
            <span className="hint-key">Esc</span>
          </span>
        </div>

        {/* Results */}
        <div className="search-results" ref={resultsRef}>
          {isLoading ? (
            <div className="search-loading">
              <Loader2 className="loading-spinner" />
              <span>Searching...</span>
            </div>
          ) : query && results.length === 0 ? (
            <div className="search-empty">
              <Search className="empty-icon" />
              <p className="empty-title">No results found</p>
              <p className="empty-description">
                Try adjusting your search or browse our categories.
              </p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="results-header">
                <span className="results-count">{results.length} results</span>
              </div>
              <div className="results-list">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    data-index={index}
                    className={`result-item ${selectedIndex === index ? "selected" : ""}`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="result-icon-wrapper">
                      {result.icon || <FileText className="w-4 h-4" />}
                    </div>
                    <div className="result-content">
                      <span className="result-title">{result.title}</span>
                      {result.subtitle && (
                        <span className="result-subtitle">{result.subtitle}</span>
                      )}
                    </div>
                    <ArrowRight className="result-arrow" />
                  </button>
                ))}
              </div>
              <div className="results-footer">
                <span className="footer-hint">
                  Press <kbd>Enter</kbd> to open selected
                </span>
                <span className="footer-hint">
                  <kbd>↑</kbd> <kbd>↓</kbd> to navigate
                </span>
              </div>
            </>
          ) : recentSearches.length > 0 && !query ? (
            <div className="recent-searches">
              <div className="recent-header">
                <Clock className="clock-icon" />
                <span>Recent Searches</span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="recent-item"
                  onClick={() => handleSearch(search)}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="search-hint">
              <Search className="hint-icon" />
              <p>Type to search across all modules...</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .search-modal {
          max-width: 640px;
          width: 100%;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Search Input */
        .search-input-wrapper {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          gap: 0.5rem;
        }

        .search-icon {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          font-family: inherit;
          min-height: 40px;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
          border: none;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.4);
        }

        .search-hint {
          display: flex;
          align-items: center;
          padding: 0.2rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.6rem;
          font-family: inherit;
        }

        .hint-key {
          padding: 0.05rem 0.2rem;
        }

        /* Results */
        .search-results {
          max-height: 400px;
          overflow-y: auto;
          padding: 0.5rem 0.5rem 0.25rem;
        }

        .search-results::-webkit-scrollbar {
          width: 4px;
        }

        .search-results::-webkit-scrollbar-track {
          background: transparent;
        }

        .search-results::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        /* Loading */
        .search-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.9rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Empty */
        .search-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          gap: 0.3rem;
        }

        .empty-icon {
          width: 40px;
          height: 40px;
          color: rgba(255, 255, 255, 0.05);
          margin-bottom: 0.3rem;
        }

        .empty-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.2);
          margin: 0;
        }

        .empty-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.1);
          margin: 0;
        }

        /* Results Header */
        .results-header {
          padding: 0.25rem 0.5rem 0.5rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Results List */
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          width: 100%;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          text-align: left;
        }

        .result-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .result-item.selected {
          background: rgba(244, 197, 66, 0.06);
        }

        .result-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .result-item.selected .result-icon-wrapper {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .result-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
          min-width: 0;
        }

        .result-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .result-item.selected .result-title {
          color: #f4c542;
        }

        .result-subtitle {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .result-arrow {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .result-item:hover .result-arrow,
        .result-item.selected .result-arrow {
          color: rgba(244, 197, 66, 0.3);
        }

        /* Results Footer */
        .results-footer {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0.5rem 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          margin-top: 0.25rem;
        }

        .footer-hint {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.08);
        }

        .footer-hint kbd {
          padding: 0.05rem 0.3rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 3px;
          font-size: 0.6rem;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Recent Searches */
        .recent-searches {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          padding: 0.25rem 0;
        }

        .recent-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.5rem 0.5rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .clock-icon {
          width: 14px;
          height: 14px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          width: 100%;
          text-align: left;
        }

        .recent-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        /* Search Hint */
        .search-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 0.3rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .hint-icon {
          width: 32px;
          height: 32px;
          opacity: 0.2;
        }

        .search-hint p {
          font-size: 0.85rem;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .search-overlay {
            padding: 1rem 0.5rem;
          }

          .search-modal {
            border-radius: 12px;
          }

          .search-input-wrapper {
            padding: 0.5rem 0.75rem;
          }

          .search-input {
            font-size: 0.9rem;
            min-height: 36px;
          }

          .search-results {
            max-height: 300px;
          }

          .search-hint {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .search-overlay {
            padding: 0.5rem 0.25rem;
          }

          .search-modal {
            border-radius: 10px;
          }

          .search-input-wrapper {
            padding: 0.4rem 0.6rem;
          }

          .search-input {
            font-size: 0.85rem;
            min-height: 32px;
          }

          .search-icon {
            width: 16px;
            height: 16px;
          }

          .result-item {
            padding: 0.4rem 0.6rem;
          }

          .result-title {
            font-size: 0.8rem;
          }

          .result-subtitle {
            font-size: 0.65rem;
          }

          .search-results {
            max-height: 250px;
          }

          .results-footer {
            flex-direction: column;
            gap: 0.2rem;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}