"use client";

import Articles from "@/components/Articles/Articles";
import Image from "next/image";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import useGetTopHeadlines from "@/hooks/useGetTopHeadlines";
import Header from "@/components/Header/Header";

export default function Home() {
  const [filterTerm, setFilterTerm] = useState("Top Headlines");
  const debouncedSearchTerm = useDebounce(filterTerm);
  const { data, loading } = useGetTopHeadlines("us");

  console.info(">>> Data fetched:", data);

  return (
    <main className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Header
        searchTerm={filterTerm}
        setSearchTerm={setFilterTerm}
        loading={loading}
      />
      <section className="w-full flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Articles
          title={filterTerm}
          articles={data?.articles}
          loading={loading}
        />
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
          Created by Damir →
        </a>
      </footer>
    </main>
  );
}
