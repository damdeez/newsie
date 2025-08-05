import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";
import { useState } from "react";

const Search = () => {
  const { searchTerm, setSearchTerm, searchLoading } = useSearch();
  const [query, setQuery] = useState(searchTerm);
  console.info(">>> Search query:", query);

  // TODO: maybe use form here instead of button click
  return (
    <div
      className="flex flex-col sm:flex-row w-full gap-2 justify-center sm:justify-end items-stretch sm:items-center"
      // onSubmit={(e) => {
      //   e.preventDefault();
      //   setSearchTerm(query);
      //   setQuery("");
      // }}
    >
      <Textarea
        className="w-full sm:w-[300px] !min-h-[40px] !max-h-[40px] sm:!min-h-[35px] sm:!max-h-[35px] sm:max-w-[600px] resize-none"
        placeholder="Search for articles by keyword..."
        defaultValue={query}
        onChange={(e) => setQuery(e.target.value)}
        // TODO: Disable Enter key line breaks
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     e.preventDefault();
        //     setSearchTerm(query);
        //     setQuery("");
        //   }
        // }}
        id="search-input"
      />
      <Button
        className="flex align-middle justify-center w-full sm:w-[125px] !min-h-[40px] !max-h-[40px] sm:!min-h-[35px] sm:!max-h-[35px] hover:cursor-pointer"
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
