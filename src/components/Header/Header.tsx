"use client";

import Search from "@/components/Search/Search";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Top Headlines", href: "/top-headlines" },
  { name: "AI Summary", href: "/ai-summary" },
];

const Header = () => {
  const pathname = usePathname();
  const linkStyles =
    "w-[100px] sm:w-[125px] h-[35px] flex justify-center items-center text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  return (
    <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Image
          className="dark:invert"
          src="/newsie.svg"
          alt="Newsie logo"
          width={150}
          height={32}
          priority
        />
        <nav className="flex gap-2 sm:gap-4 sm:ml-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={
                linkStyles +
                (pathname === item.href ? " font-extrabold" : " font-semibold")
              }
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="w-full sm:w-auto sm:ml-4">
        <Search />
      </div>
    </header>
  );
};

export default Header;
