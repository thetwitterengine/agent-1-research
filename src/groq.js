import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function testGroq() {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: "Reply with exactly: Groq Connected"
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );
  }
}

export async function analyzeArticle(title) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are a startup and founder research analyst.

Analyze the headline and return ONLY valid JSON.

{
  "relevant": true,
  "score": 1-10,
  "category": "Funding | Startup | AI | Founder | Business | Other",
  "founder": "Name or Unknown",
  "company": "Company or Unknown"
}

Rules:
- Focus on founders, startups, funding, AI companies, entrepreneurship and business.
- Score 9-10 = highly valuable.
- Score 7-8 = useful.
- Score below 7 = weak.
- Return JSON only.
`
          },
          {
            role: "user",
            content: title
          }
        ],
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return JSON.parse(
      response.data.choices[0].message.content
    );
  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
}