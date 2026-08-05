'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  image_url: string;
  category_name: string;
  category_emoji: string;
}

interface SearchBarProps {
  initialQuery?: string;
  alwaysVisible?: boolean;
}

export default function SearchBar({ initialQuery = "", alwaysVisible = false }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(alwaysVisible);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with prop if query string updates (e.g. initial load or hashtag clicks)
  useEffect(() => {
    setValue(initialQuery);
    setShowSuggestions(false);
  }, [initialQuery]);

  // Collapsed search bar focus trigger
  useEffect(() => {
    if (isExpanded && !alwaysVisible) {
      // Focus input when expanding
      const inputEl = containerRef.current?.querySelector("input");
      if (inputEl) (inputEl as HTMLInputElement).focus();
    }
  }, [isExpanded, alwaysVisible]);

  // Suggestions Autocomplete with 300ms Debounce
  useEffect(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error("Failed to load search suggestions:", err);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [value]);

  // Click outside to collapse/close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!alwaysVisible) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [alwaysVisible]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        if (!alwaysVisible) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [alwaysVisible]);

  const triggerFullSearch = (searchVal: string) => {
    setShowSuggestions(false);
    if (!alwaysVisible) {
      setIsExpanded(false);
    }
    const cleanVal = searchVal.trim();
    if (cleanVal) {
      router.push(`/search?q=${encodeURIComponent(cleanVal)}`);
    } else {
      router.push("/search");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerFullSearch(value);
  };

  const handleSelectSuggestion = (id: string) => {
    setShowSuggestions(false);
    if (!alwaysVisible) {
      setIsExpanded(false);
    }
    // Navigate directly to that thread (single history entry)
    router.push(`/thread/${id}`);
  };

  const handleClear = () => {
    setValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // If not expanded and not always visible, show the simple search icon button in the header
  if (!isExpanded && !alwaysVisible) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="p-1 hover:text-saba-orange transition cursor-pointer"
        aria-label="ค้นหา"
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  // Input wrapper styling
  const formContent = (
    <form
      onSubmit={handleSubmit}
      className="flex-1 flex items-center gap-2 bg-[#F7F5F1] border border-saba-line rounded-full px-3.5 py-1.5 focus-within:border-saba-orange/40 transition duration-150"
    >
      <Search className="w-4 h-4 text-saba-muted shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="ค้นหากระทู้ในเว็บ..."
        className="flex-1 bg-transparent text-xs text-saba-black focus:outline-none placeholder:text-saba-muted font-cute"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="text-saba-muted hover:text-saba-black cursor-pointer p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );

  return (
    <div
      ref={containerRef}
      className={alwaysVisible ? "flex-1 relative" : "absolute inset-0 bg-white z-40 flex items-center px-4 gap-2.5 h-14"}
    >
      {/* Expanded overlay mode back arrow */}
      {!alwaysVisible && (
        <button
          type="button"
          onClick={() => {
            setIsExpanded(false);
            setShowSuggestions(false);
          }}
          className="p-1 text-saba-ink hover:text-saba-orange transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {formContent}

      {/* Autocomplete Dropdown list */}
      {showSuggestions && (value.trim().length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-saba-line rounded-2xl shadow-xl z-50 overflow-hidden py-1 max-h-80 overflow-y-auto animate-fade-in mx-4 md:mx-0">
          {suggestions.length > 0 ? (
            <div className="divide-y divide-saba-line/40">
              {suggestions.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug.id)}
                  className="w-full text-left px-4 py-2.5 hover:bg-saba-bg2 flex items-center gap-3 transition"
                >
                  {sug.image_url ? (
                    <img
                      src={sug.image_url}
                      alt={sug.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-saba-line"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-saba-bg2 border border-saba-line flex items-center justify-center text-sm shrink-0">
                      🐾
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-saba-black truncate font-heading group-hover:text-saba-orange">
                      {sug.title}
                    </p>
                    {sug.category_name && (
                      <p className="text-[9px] text-saba-muted font-cute mt-0.5">
                        {sug.category_emoji} {sug.category_name}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-xs text-saba-muted font-cute">
              ไม่พบคู่มือแนะนำที่ตรงกัน 🐾
            </div>
          )}

          {/* View all suggestions trigger */}
          <button
            type="button"
            onClick={() => triggerFullSearch(value)}
            className="w-full text-center py-3 bg-[#F7F5F1]/80 hover:bg-saba-bg2 border-t border-saba-line text-[10px] font-bold text-saba-orange font-cute transition"
          >
            ดูผลลัพธ์ทั้งหมดสำหรับ "{value}" →
          </button>
        </div>
      )}
    </div>
  );
}
