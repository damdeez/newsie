import { INewsApiArticle } from "@/types/types";

// Check for same title articles and then filter them out
export const uniqueArticles = (articles: INewsApiArticle[]) => {
  const uniqueArticles: INewsApiArticle[] = [];
  const titlesSet = new Set<string>();
  articles.forEach((article: INewsApiArticle) => {
    if (!titlesSet.has(article.title)) {
      titlesSet.add(article.title);
      uniqueArticles.push(article);
    }
  });

  return uniqueArticles;
};