import { INewsApiArticle } from "@/types/types";

interface ArticlesProps {
  title: string;
  articles?: INewsApiArticle[];
}

const Articles = ({ title, articles }: ArticlesProps) => {
  if (!articles || articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-4">Most recent articles on &quot;{title}&quot;</h2>
      <ul className="list-none list-inside">
        {articles.map((article, index) => (
          <li key={index} className="mb-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;
