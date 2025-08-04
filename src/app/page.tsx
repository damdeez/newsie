"use client";

import Articles from "@/components/Articles/Articles";
import useGetEverythingByQuery from "@/hooks/useGetEverythingByQuery";
import Image from "next/image";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Header from "@/components/Header/Header";

const tempSearchTerm = "artificial intelligence";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(tempSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data, loading } = useGetEverythingByQuery(debouncedSearchTerm);

  console.info(">>> Data fetched:", data);

  return (
    <main className="font-sans grid items-start justify-items-center min-h-screen p-2 sm:p-8 pb-20 gap-4 sm:gap-16">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
      />
      <Articles
        title={searchTerm}
        articles={data?.articles}
        loading={loading}
      />
      {!loading && (
        <footer className="row-start-3 flex gap-4 sm:gap-6 flex-wrap items-center justify-center px-4">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm"
            href="https://www.damir.fun"
            target="_blank"
            rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Created by Damir →
        </a>
      </footer>
    )}
    </main>
  );
}
