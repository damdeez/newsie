"use client";

import { useEffect } from "react";

import Articles from "@/components/Articles/Articles";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Summary from "@/components/Summary/Summary";
import { useSearch } from "@/contexts/SearchContext";
import useGetEverythingByQuery from "@/hooks/useGetEverythingByQuery";
import { AlertCircleIcon, Loader2 } from "lucide-react";
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
      <main className="font-sans grid min-h-screen grid-rows-[auto_1fr_auto] justify-items-center p-4 sm:p-8 gap-4 sm:gap-16">
        <Header />
        <div className="grid row-start-2 max-w-6xl justify-center w-full gap-4 relative">
          <Loader2 className="animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="font-sans grid min-h-screen grid-rows-[auto_1fr_auto] justify-items-center p-4 sm:p-8 gap-4 sm:gap-16">
        <Header />
        <div className="grid row-start-2 max-w-6xl w-full gap-4 relative">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to fetch articles. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="font-sans grid min-h-screen grid-rows-[auto_1fr_auto] justify-items-center p-4 sm:p-8 gap-4 sm:gap-16">
      <Header />
      <div className="grid row-start-2 max-w-6xl grid-cols-1 lg:grid-cols-[3fr_2fr] w-full gap-4 relative">
        <Articles
          title={searchTerm}
          articles={data?.articles}
          loading={loading}
        />
        <Summary articles={data?.articles} loading={loading} />
      </div>
      <Footer />
    </main>
  );
}

export default Home;
