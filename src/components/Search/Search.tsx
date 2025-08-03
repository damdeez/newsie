import { Loader2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SearchProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  searchLoading: boolean;
}

const Search = ({ setSearchTerm, searchTerm, searchLoading }: SearchProps) => {
  return (
    <div className="flex flex-row w-full gap-2 justify-end items-center">
      <Textarea
        className="w-[300px] min-h-[35px] max-w-[600px] resize-none"
        placeholder="Search for news articles..."
        defaultValue={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        id="search-input"
      />
      <Button
        className="flex align-middle justify-center w-min h-[35px] hover:cursor-pointer"
        variant="outline"
        onClick={() => setSearchTerm(searchTerm)}
      >
        {searchLoading ? <Loader2Icon /> : null}
        Search
      </Button>
    </div>
  );
};

export default Search;
