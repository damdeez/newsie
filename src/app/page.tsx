'use client';

import Articles from "@/components/Articles/Articles";
import useGetEverythingByQuery from "@/hooks/useGetEverythingByQuery";
import Image from "next/image";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Search from "@/components/Search/Search";

const tempSearchTerm = "artificial intelligence";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(tempSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data, loading } = useGetEverythingByQuery(debouncedSearchTerm);
  
  console.info('>>> Data fetched:', data);

  return (
    <main className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <section className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/newsie.svg"
          alt="Newsie logo"
          width={180}
          height={38}
          priority
        />
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchLoading={loading}
        />
        <Articles title={searchTerm} articles={data?.articles} />
      </section>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
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
          Created by Dado →
        </a>
      </footer>
    </main>
  );
}
