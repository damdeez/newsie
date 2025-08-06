"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchLoading: boolean;
  setSearchLoading: (loading: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  initialSearchTerm?: string;
}

export const SearchProvider = ({
  children,
  initialSearchTerm = "",
}: SearchProviderProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchLoading, setSearchLoading] = useState(false);
  console.info("searchTerm", searchTerm);

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        searchLoading,
        setSearchLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
