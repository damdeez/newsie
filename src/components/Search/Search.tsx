"use client";

import { Loader2, InfoIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/SearchContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const FormSchema = z.object({
  Search: z
    .string()
    .min(2, {
      message: "Search query must be at least 2 characters.",
    })
    .max(30, {
      message: "Search query must not be longer than 30 characters.",
    }),
});

function Search() {
  const { searchTerm, setSearchTerm, searchLoading } = useSearch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Search: searchTerm,
    },
  });
  const pathname = usePathname();
  const isOnTopHeadlines = pathname === "/top-headlines";

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setSearchTerm(data.Search);
    form.reset({ Search: "" });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row w-full gap-2 justify-center sm:justify-end items-stretch sm:items-center"
      >
        {isOnTopHeadlines && (
          <Tooltip>
            <TooltipTrigger className="hover:cursor-pointer">
              <InfoIcon size={16} className="hidden sm:block text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Search functionality is on this page is coming soon.</p>
            </TooltipContent>
          </Tooltip>
        )}

        <FormField
          control={form.control}
          name="Search"
          disabled={isOnTopHeadlines}
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormControl>
                <Textarea
                  className="w-full sm:w-[300px] !min-h-[40px] !max-h-[40px] sm:!min-h-[35px] sm:!max-h-[35px] sm:max-w-[600px] resize-none"
                  placeholder="Search for articles by keyword..."
                  id="search-input"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="flex align-middle justify-center w-full sm:w-[125px] !min-h-[40px] !max-h-[40px] sm:!min-h-[35px] sm:!max-h-[35px] hover:cursor-pointer"
          variant="outline"
          disabled={isOnTopHeadlines}
        >
          {searchLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          Search
        </Button>
      </form>
    </Form>
  );
}

export default Search;
