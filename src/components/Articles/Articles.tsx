import { INewsApiArticle } from "@/types/types";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

interface ArticlesProps {
  title: string;
  articles?: INewsApiArticle[];
  loading: boolean;
}

const Articles = ({ title, articles, loading }: ArticlesProps) => {
  if (!articles || articles.length === 0 && !loading) {
    return <p>No articles found.</p>;
  } else if (loading) {
    return (
      <p>
        <Loader2Icon />
      </p>
    );
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-4">
        {title === "Top Headlines" ? "Top Headlines" : `Most recent articles for "${title}"`}
      </h2>
      <ul className="list-none list-inside">
        {articles.map((article, index) => (
          <li key={index} className="mb-4">
            <div className="relative group">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline block w-[300px] sm:w-[600px] text-wrap"
              >
                {article.title}
              </a>
              {article.urlToImage && (
                <div className="absolute right-[-40px] top-[40px] invisible group-hover:visible bg-white border border-gray-300 rounded-lg shadow-lg p-1 z-10 w-64">
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
    </div>
  );
};

export default Articles;
