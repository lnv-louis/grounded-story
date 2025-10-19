import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

  const textareaHeight = query.split('\n').length > 2 || query.length > 100;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className={`flex gap-3 ${textareaHeight ? 'flex-col items-stretch' : 'flex-row items-start'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground z-10" />
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="min-h-[60px] max-h-[200px] resize-y pl-12 pr-4 pt-3.5 text-lg bg-secondary/50 border-border/50 focus:border-primary/50 transition-all"
            rows={2}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          size="lg"
          className={`px-6 shrink-0 ${textareaHeight ? 'w-full h-[50px]' : 'h-[60px]'}`}
        >
          <Search className="h-5 w-5 mr-2" />
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </form>
  );
};
