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

export const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning!";
  }
  if (hour < 18) {
    return "Good afternoon!";
  }

  return "Good evening!";
};

// Function to get a month ago from today's date
export const oneMonthAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split("T")[0];
}