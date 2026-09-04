"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Filter, Command } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  debounce?: number;
  showShortcut?: boolean;
  showFilter?: boolean;
  onFilterClick?: () => void;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  clearable?: boolean;
  variant?: "default" | "ghost" | "minimal";
}

export function SearchBar({
  value: externalValue,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
  size = "md",
  autoFocus = false,
  debounce = 300,
  showShortcut = true,
  showFilter = false,
  onFilterClick,
  loading = false,
  suggestions = [],
  onSuggestionClick,
  clearable = true,
  variant = "default",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(externalValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  const sizeClasses = {
    sm: {
      wrapper: "h-8",
      input: "text-xs pl-7 pr-7",
      icon: "w-3.5 h-3.5 left-2.5",
      clear: "w-3.5 h-3.5 right-2.5",
      shortcut: "text-[9px] px-1.5 py-0.5",
    },
    md: {
      wrapper: "h-10",
      input: "text-sm pl-9 pr-9",
      icon: "w-4 h-4 left-3",
      clear: "w-4 h-4 right-3",
      shortcut: "text-[10px] px-2 py-0.5",
    },
    lg: {
      wrapper: "h-12",
      input: "text-base pl-10 pr-10",
      icon: "w-5 h-5 left-3.5",
      clear: "w-5 h-5 right-3.5",
      shortcut: "text-[11px] px-2 py-0.5",
    },
  };

  const variantClasses = {
    default: "bg-white/5 border border-white/5 focus-within:border-gold/40",
    ghost: "bg-transparent border border-transparent focus-within:border-gold/20",
    minimal: "bg-white/3 border border-white/3 focus-within:border-gold/30",
  };

  const sizes = sizeClasses[size];
  const variantClass = variantClasses[variant];

  // Debounce search
  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [value, debounce, onSearch]);

  // Filter suggestions
  useEffect(() => {
    if (value.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to focus
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear
      if (e.key === "Escape" && isFocused) {
        handleClear();
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInternalValue(suggestion);
    onChange?.(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  return (
    <div
      ref={wrapperRef}
      className={`search-bar-wrapper relative ${className}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`search-bar flex items-center rounded-lg transition-all duration-300 ${variantClass} ${sizes.wrapper} ${isFocused ? "ring-2 ring-gold/20" : ""}`}
      >
        {/* Search Icon */}
        <Search className={`search-icon absolute text-white/20 ${sizes.icon}`} />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`search-input w-full h-full bg-transparent outline-none text-white/80 placeholder:text-white/20 font-medium ${sizes.input}`}
          autoFocus={autoFocus}
          aria-label="Search"
        />

        {/* Loading Spinner */}
        {loading && (
          <div className={`loading-spinner absolute right-3 ${sizes.clear}`}>
            <div className="spinner" />
          </div>
        )}

        {/* Clear Button */}
        {clearable && value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className={`clear-btn absolute flex items-center justify-center rounded-full hover:bg-white/5 text-white/20 hover:text-white/50 transition-colors ${sizes.clear}`}
            aria-label="Clear search"
          >
            <X className="w-full h-full" />
          </button>
        )}

        {/* Filter Button */}
        {showFilter && onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="filter-btn absolute right-10 flex items-center justify-center text-white/20 hover:text-white/50 transition-colors"
            aria-label="Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        )}

        {/* Shortcut Hint */}
        {showShortcut && !value && !isFocused && !loading && (
          <div className={`shortcut-hint absolute right-3 flex items-center gap-1 text-white/10 ${sizes.shortcut}`}>
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="suggestions-dropdown absolute top-full left-0 right-0 mt-1 bg-dark-card/95 backdrop-blur-xl border border-white/5 rounded-lg shadow-gloss overflow-hidden z-50">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item w-full px-4 py-2 text-left text-sm text-white/50 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-white/10" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .search-bar-wrapper {
          position: relative;
        }

        .search-bar {
          position: relative;
          width: 100%;
        }

        .search-icon {
          top: 50%;
          transform: translateY(-50%);
        }

        .search-input {
          min-width: 0;
        }

        .search-input::selection {
          background: rgba(244, 197, 66, 0.2);
        }

        .clear-btn {
          top: 50%;
          transform: translateY(-50%);
        }

        .filter-btn {
          top: 50%;
          transform: translateY(-50%);
        }

        .shortcut-hint {
          top: 50%;
          transform: translateY(-50%);
          user-select: none;
        }

        .shortcut-hint svg {
          width: 12px;
          height: 12px;
        }

        /* Loading Spinner */
        .loading-spinner {
          top: 50%;
          transform: translateY(-50%);
        }

        .spinner {
          width: 100%;
          height: 100%;
          border: 2px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Suggestions */
        .suggestions-dropdown {
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 200px;
          overflow-y: auto;
        }

        .suggestions-dropdown::-webkit-scrollbar {
          width: 3px;
        }

        .suggestions-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }

        .suggestions-dropdown::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .suggestion-item {
          font-family: inherit;
        }

        .suggestion-item:first-child {
          border-radius: 8px 8px 0 0;
        }

        .suggestion-item:last-child {
          border-radius: 0 0 8px 8px;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .shortcut-hint {
            display: none;
          }

          .suggestions-dropdown {
            max-height: 150px;
          }

          .suggestion-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}