// src/converter.ts
import fs from "fs";
import path from "path";
import { marked } from "marked";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert a Markdown file to a styled PDF.
 *
 * @param input Path to input Markdown file
 * @param output Path to output PDF file
 * @param theme CSS theme to apply (light, dark, hacker)
 */
export async function mdToPdf(input: string, output: string, theme: string) {
  // Read Markdown file
  if (!fs.existsSync(input)) {
    throw new Error(`Input file not found: ${input}`);
  }
  const markdown = fs.readFileSync(input, "utf-8");

  // Convert Markdown to HTML
  const html = marked(markdown);

  // Load CSS theme
  const themePath = path.resolve(__dirname, `../themes/${theme}.css`);
  if (!fs.existsSync(themePath)) {
    throw new Error(`Theme not found: ${theme}`);
  }
  const css = fs.readFileSync(themePath, "utf-8");

  // Launch Puppeteer with no-sandbox (required for GitHub Actions)
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Set HTML content
  await page.setContent(`
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>${html}</body>
    </html>
  `);

  // Generate PDF
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  console.log(`✅ PDF saved at ${output}`);
}
