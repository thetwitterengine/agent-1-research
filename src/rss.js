import Parser from "rss-parser";

const parser = new Parser();

const FEEDS = [
  "https://techcrunch.com/feed/",
  "https://venturebeat.com/feed/",
  "https://www.entrepreneur.com/latest.rss"
];

export async function getArticles() {
  let allArticles = [];

  for (const feedUrl of FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);

      const articles = feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.title
      }));

      allArticles.push(...articles);

      console.log(`✓ ${feed.title}`);
    } catch (error) {
      console.log(`✗ Failed: ${feedUrl}`);
    }
  }

  return allArticles;
}