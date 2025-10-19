import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "climate change impact on coastal cities",
  "vaccine efficacy data from clinical trials",
  "economic policy effects on inflation",
  "renewable energy adoption statistics",
  "immigration policy fact check",
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const currentSuggestion = SUGGESTIONS[suggestionIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentSuggestion.length) {
        setPlaceholder(currentSuggestion.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [suggestionIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="h-[60px] pl-12 pr-4 text-lg bg-secondary/50 border-border/50 focus:border-primary/50 transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          size="lg"
          className="h-[60px] px-6 shrink-0"
        >
          <Search className="h-5 w-5 mr-2" />
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </form>
  );
};
