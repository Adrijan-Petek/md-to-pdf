#!/usr/bin/env node
import { mdToPdf } from "../dist/converter.js";


const args = process.argv.slice(2);
const input = args[0] || "README.md";
const output = input.replace(/\.md$/, ".pdf");
const theme = args.includes("--theme") ? args[args.indexOf("--theme") + 1] : "light";

mdToPdf(input, output, theme);
