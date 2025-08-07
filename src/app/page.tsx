"use client";

import { useEffect } from "react";

import Articles from "@/components/Articles/Articles";
import useGetEverythingByQuery from "@/hooks/useGetEverythingByQuery";
import Header from "@/components/Header/Header";
import { useSearch } from "@/contexts/SearchContext";
import Summary from "@/components/Summary/Summary";
import { AlertCircleIcon, Loader2, SquareArrowOutUpRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const tempSearchTerm = "artificial intelligence";

function Home() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { data, loading, error } = useGetEverythingByQuery(searchTerm);

  useEffect(() => {
    if (!searchTerm) {
      setSearchTerm(tempSearchTerm);
    }
  }, [searchTerm, setSearchTerm]);

  if (loading) {
    return (
      <main className="font-sans grid items-start justify-items-center min-h-screen p-4 sm:p-8 pb-20 gap-4 sm:gap-16">
        <Header />
        <div className="grid max-w-6xl justify-center w-full gap-4 relative">
          <Loader2 className="animate-spin" />
        </div>
      </main>
    );
  } else if (error) {
    return (
      <main className="font-sans grid items-start justify-items-center p-4 sm:p-8 pb-20 gap-4 sm:gap-16">
        <Header />
        <div className="grid max-w-6xl w-full gap-4 relative">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to fetch articles. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans grid items-start justify-items-center min-h-screen p-4 sm:p-8 pb-20 gap-4 sm:gap-16">
      <Header />
      <div className="grid max-w-6xl grid-cols-1 lg:grid-cols-[3fr_2fr] w-full gap-4 relative">
        <Articles
          title={searchTerm}
          articles={data?.articles}
          loading={loading}
        />
        <Summary articles={data?.articles} loading={loading} />
      </div>
      {!loading && (
        <footer className="row-start-3 flex gap-4 sm:gap-6 flex-wrap items-center justify-center px-4">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://www.damir.fun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SquareArrowOutUpRight size={15} /> Created by Damir 👾
          </a>
        </footer>
      )}
    </main>
  );
}

export default Home;
