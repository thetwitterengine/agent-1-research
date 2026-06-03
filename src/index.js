import { createId } from "./utils.js";
import { getArticles } from "./rss.js";
import { analyzeArticle } from "./groq.js";
import {
  addRow,
  getExistingIds,
  getCompanyScores
} from "./sheets.js";

async function main() {
  console.log("Research Agent Started\n");

  const articles = await getArticles();
  const existingIds = await getExistingIds();
  const companyScores = await getCompanyScores();

  console.log(`Found ${articles.length} articles\n`);

  for (const article of articles.slice(0, 10)) {
    try {
      const analysis = await analyzeArticle(article.title);

      if (!analysis) continue;

      if (analysis.relevant && analysis.score >= 7) {
        const today =
            new Date().toISOString().split("T")[0];

            const companyKey =
              analysis.company !== "Unknown"
                ? `${today}-${analysis.company}`
                : `${today}-${article.title}`;

            const articleId = createId(companyKey);

            if (existingIds.has(articleId)) {
            console.log(
                `✗ Duplicate Company: ${analysis.company}`
            );
            continue;
            }

            const existingScore =
            companyScores.get(companyKey) || 0;

            if (analysis.score <= existingScore) {
            console.log(
                `✗ Lower Score: ${analysis.company}`
            );
            continue;
            }

            await addRow([
            today,
            analysis.founder,
            analysis.company,
            article.title,
            analysis.category,
            article.link,
            analysis.score,
            articleId
            ]);

        console.log(`✓ Saved: ${article.title}`);
      } else {
        console.log(`✗ Skipped: ${article.title}`);
      }
    } catch (error) {
      console.error(`Error: ${article.title}`);
    }
  }

  console.log("\nDone");
}

main();