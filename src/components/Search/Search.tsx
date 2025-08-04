import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";
import { useState } from "react";

const Search = () => {
  const { searchTerm, setSearchTerm, searchLoading } = useSearch();
  const [query, setQuery] = useState(searchTerm);

  return (
    <div className="flex flex-col sm:flex-row w-full gap-2 justify-center sm:justify-end items-stretch sm:items-center">
      <Textarea
        className="w-full sm:w-[300px] min-h-[35px] sm:max-w-[600px] resize-none"
        placeholder="Search for articles by keyword..."
        defaultValue={query}
        onChange={(e) => setQuery(e.target.value)}
        id="search-input"
      />
      <Button
        className="flex align-middle justify-center w-full sm:w-[125px] h-[35px] hover:cursor-pointer"
        variant="outline"
        onClick={() => {
          setSearchTerm(query);
          setQuery("");
        }}
      >
        {searchLoading ? <Loader2 className="animate-spin mr-2" /> : null}
        Search
      </Button>
    </div>
  );
};

export default Search;
