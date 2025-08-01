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
    <div className="grid w-full gap-2">
      <Textarea
        className="w-full max-w-[600px] h-[100px] sm:h-[150px] resize-none"
        placeholder="Search for news articles..."
        defaultValue={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        className="w-full max-w-[600px] hover:cursor-pointer"
        variant="outline"
        onClick={() => console.info("clicking")}
      >
        {searchLoading ? <Loader2Icon /> : null}
        Search
      </Button>
    </div>
  );
};

export default Search;
