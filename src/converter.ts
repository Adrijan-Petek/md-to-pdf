import fs from "fs";
import path from "path";
import { marked } from "marked";
import puppeteer from "puppeteer";

export async function mdToPdf(input: string, output: string, theme: string) {
  const markdown = fs.readFileSync(input, "utf-8");
  const html = marked(markdown);

  const themePath = path.resolve(__dirname, `../themes/${theme}.css`);
  const css = fs.readFileSync(themePath, "utf-8");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>${html}</body>
    </html>
  `);
  await page.pdf({ path: output, format: "A4" });
  await browser.close();

  console.log(`✅ PDF saved at ${output}`);
}
