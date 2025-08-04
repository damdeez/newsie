import { INewsApiArticle } from "@/types/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ArticlesProps {
  title: string;
  articles?: INewsApiArticle[];
  loading: boolean;
}

const Articles = ({ title, articles, loading }: ArticlesProps) => {
  const pathname = usePathname();
  const isTopHeadlines = pathname === "/top-headlines";
  
  if (loading) {
    return (
      <p>
        <Loader2 className="animate-spin"/>
      </p>
    );
  } else if (!articles || (articles.length === 0 && !loading)) {
    return <p>No articles found.</p>;
  } 

  return (
    <section className="w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isTopHeadlines
          ? "Top Headlines"
          : `Most recent articles for "${title}"`}
      </h2>
      <ul className="list-none list-inside">
        {articles.map((article, index) => (
          <li key={index} className="mb-4">
            <div className="relative group inline">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline block w-[300px] sm:w-[600px] text-wrap"
              >
                {article.title}
              </a>
              {article.urlToImage && (
                <div className="absolute right-[140px] top-[-40px] invisible group-hover:visible bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-10 w-64">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    width={250}
                    height={150}
                    className="rounded-md object-cover"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {article.description}
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-1">
              {new Date(article.publishedAt).toLocaleDateString()} by{" "}
              {article.author || "Unknown"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Articles;
