// import { chromium } from "playwright";

// export async function openBrowser() {
//   const browser = await chromium.launch({
//     headless: true,
//   });

//   const context = await browser.newContext();

//   const page = await context.newPage();

//   return { browser, context, page };
// }

import { chromium as playwrightChromium } from "playwright-core";
import chromium from "@sparticuz/chromium";

export async function openBrowser() {
  const isProduction = process.env.NODE_ENV === "production";

  const browser = await playwrightChromium.launch({
    headless: true,
    executablePath: isProduction
      ? await chromium.executablePath()
      : undefined,
    args: isProduction ? chromium.args : undefined,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  return { browser, context, page };
}