"use client";

import Search from "@/components/Search/Search";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading?: boolean;
}

const Header = ({
  searchTerm,
  setSearchTerm,
  loading = false,
}: HeaderProps) => {
  const linkStyles =
    "w-[120px] h-[35px] flex justify-center items-center text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  return (
    <header className="w-full flex justify-center items-center">
      <Image
        className="dark:invert"
        src="/newsie.svg"
        alt="Newsie logo"
        width={180}
        height={38}
        priority
      />
      <nav className="flex gap-4 ml-8">
        <Link href="/" className={linkStyles}>
          Home
        </Link>
        <Link href="/top-headlines" className={linkStyles}>
          Top Headlines
        </Link>
      </nav>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchLoading={loading}
      />
    </header>
  );
};

export default Header;
