import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface SearchProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  searchLoading: boolean;
}

const Search = ({ setSearchTerm, searchTerm, searchLoading }: SearchProps) => {
  const pathname = usePathname();
  const isTopHeadlines = pathname === "/top-headlines";

  return (
    <div className="flex flex-col sm:flex-row w-full gap-2 justify-center sm:justify-end items-stretch sm:items-center">
      <Textarea
        className="w-full sm:w-[300px] min-h-[35px] sm:max-w-[600px] resize-none"
        placeholder={
          isTopHeadlines
            ? "Filter by keyword..."
            : "Search for articles by keyword..."
        }
        defaultValue={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        id="search-input"
      />
      <Button
        className="flex align-middle justify-center w-full sm:w-[125px] h-[35px] hover:cursor-pointer"
        variant="outline"
        onClick={() => setSearchTerm(searchTerm)}
      >
        {searchLoading ? <Loader2 className="animate-spin mr-2"/> : null}
        {isTopHeadlines ? "Filter" : "Search"}
      </Button>
    </div>
  );
};

export default Search;
