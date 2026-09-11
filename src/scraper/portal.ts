// // import { Page } from "playwright";

// // const BASE_URL =
// //   "https://tendersodisha.gov.in/nicgep/app";

// // export async function openHomePage(page: Page) {
// //   await page.goto(BASE_URL, {
// //     waitUntil: "domcontentloaded",
// //     timeout: 30000,
// //   });

// //   await page.waitForTimeout(3000);

// //   return {
// //     url: page.url(),
// //     title: await page.title(),
// //     text: await page.locator("body").innerText(),
// //   };
// // }

// // export async function inspectLatestTenders(page: Page) {
// //   const tables = await page.locator("table").evaluateAll(
// //     (elements) =>
// //       elements.map((table, index) => ({
// //         index,
// //         id: table.id,
// //         className: table.className,
// //         rows: table.querySelectorAll("tr").length,
// //         text: (table.textContent || "")
// //           .trim()
// //           .substring(0, 3000),
// //       }))
// //   );

// //   const links = await page.locator("a").evaluateAll(
// //     (elements) =>
// //       elements
// //         .map((el) => ({
// //           text: (el.textContent || "").trim(),
// //           href: (el as HTMLAnchorElement).href,
// //         }))
// //         .filter((link) => link.text || link.href)
// //         .slice(0, 100)
// //   );

// //   return {
// //     tables,
// //     links,
// //   };
// // }

// // export async function inspectTenderDetails(page: Page) {
// //   const link = page.locator("#activeTenders a[href]").first();

// //   const href = await link.getAttribute("href");

// //   if (!href) {
// //     return {
// //       success: false,
// //       message: "No tender detail link found",
// //     };
// //   }

// //   await page.goto(new URL(href, page.url()).toString(), {
// //     waitUntil: "domcontentloaded",
// //     timeout: 30000,
// //   });

// //   await page.waitForTimeout(2000);

// //   const bodyText = await page.locator("body").innerText();

// //   return {
// //     success: true,
// //     url: page.url().split("?")[0],
// //     text: bodyText.substring(0, 8000),
// //   };
// // }

// // export async function inspectTenderDetails(page: Page) {
// //   const link = page.locator("#activeTenders a[href]").first();

// //   const href = await link.getAttribute("href");

// //   if (!href) {
// //     return {
// //       success: false,
// //       message: "No tender detail link found",
// //     };
// //   }

// //   const detailUrl = new URL(href, page.url()).toString();

// //   await page.goto(detailUrl, {
// //     waitUntil: "domcontentloaded",
// //     timeout: 30000,
// //   });

// //   await page.waitForTimeout(2000);

// //   const bodyText = await page.locator("body").innerText();

// //   return {
// //     success: true,
// //     pageTitle: await page.title(),
// //     text: bodyText.substring(0, 8000),
// //   };
// // }

// import { Page } from "playwright";

// const BASE_URL =
//   "https://tendersodisha.gov.in/nicgep/app";

// export async function openHomePage(page: Page) {
//   await page.goto(BASE_URL, {
//     waitUntil: "domcontentloaded",
//     timeout: 30000,
//   });

//   await page.waitForTimeout(3000);

//   return {
//     url: page.url(),
//     title: await page.title(),
//     text: await page.locator("body").innerText(),
//   };
// }

// export async function inspectLatestTenders(page: Page) {
//   const tables = await page.locator("table").evaluateAll(
//     (elements) =>
//       elements.map((table, index) => ({
//         index,
//         id: table.id,
//         className: table.className,
//         rows: table.querySelectorAll("tr").length,
//         text: (table.textContent || "")
//           .trim()
//           .substring(0, 3000),
//       }))
//   );

//   const links = await page.locator("a").evaluateAll(
//     (elements) =>
//       elements
//         .map((el) => ({
//           text: (el.textContent || "").trim(),
//           href: (el as HTMLAnchorElement).href,
//         }))
//         .filter((link) => link.text || link.href)
//         .slice(0, 100)
//   );

//   return {
//     tables,
//     links,
//   };
// }

// export async function inspectTenderDetails(page: Page) {
//   const link = page.locator("#activeTenders a[href]").first();

//   const href = await link.getAttribute("href");

//   if (!href) {
//     return {
//       success: false,
//       message: "No tender detail link found",
//     };
//   }

//   const detailUrl = new URL(href, page.url()).toString();

//   await page.goto(detailUrl, {
//     waitUntil: "domcontentloaded",
//     timeout: 30000,
//   });

//   await page.waitForTimeout(2000);

//   const bodyText = await page.locator("body").innerText();

//   return {
//     success: true,
//     pageTitle: await page.title(),
//     text: bodyText.substring(0, 8000),
//   };
// }

// import { Page } from "playwright";

// const BASE_URL =
//   "https://tendersodisha.gov.in/nicgep/app";

// export async function openHomePage(page: Page) {
//   await page.goto(BASE_URL, {
//     waitUntil: "domcontentloaded",
//     timeout: 30000,
//   });

//   await page.waitForTimeout(3000);

//   return {
//     url: page.url(),
//     title: await page.title(),
//     text: await page.locator("body").innerText(),
//   };
// }

// export async function inspectLatestTenders(page: Page) {
//   const tables = await page.locator("table").evaluateAll(
//     (elements) =>
//       elements.map((table, index) => ({
//         index,
//         id: table.id,
//         className: table.className,
//         rows: table.querySelectorAll("tr").length,
//         text: (table.textContent || "")
//           .trim()
//           .substring(0, 3000),
//       }))
//   );

//   const links = await page.locator("a").evaluateAll(
//     (elements) =>
//       elements
//         .map((el) => ({
//           text: (el.textContent || "").trim(),
//           href: (el as HTMLAnchorElement).href,
//         }))
//         .filter((link) => link.text || link.href)
//         .slice(0, 100)
//   );

//   return {
//     tables,
//     links,
//   };
// }

// export async function inspectTenderDetails(
//   page: Page,
//   detailUrl: string
// ) {
//   await page.goto(detailUrl, {
//     waitUntil: "domcontentloaded",
//     timeout: 30000,
//   });

//   await page.waitForTimeout(1500);

//   const bodyText = await page.locator("body").innerText();

//   const lines = bodyText
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean);

//   function extractField(label: string): string | null {
//     const index = lines.findIndex(
//       (line) => line.toLowerCase() === label.toLowerCase()
//     );

//     if (index === -1 || index + 1 >= lines.length) {
//       return null;
//     }

//     return lines[index + 1];
//   }

//   return {
//     tenderId: extractField("Tender ID"),
//     organisationChain: extractField("Organisation Chain"),
//   };
// }

import { Page } from "playwright";

const BASE_URL =
  "https://tendersodisha.gov.in/nicgep/app";

export async function openHomePage(page: Page) {
  await page.goto(BASE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForTimeout(3000);

  return {
    url: page.url(),
    title: await page.title(),
    text: await page.locator("body").innerText(),
  };
}

export async function inspectTenderDetails(
  page: Page,
  tenderTitle: string
) {
  console.log("======================================");
  console.log("OPENING TENDER DETAIL");
  console.log("TITLE:", tenderTitle);
  console.log("======================================");

  const rows = page.locator("#activeTenders tr");

  const rowCount = await rows.count();

  console.log("ACTIVE TENDER ROW COUNT:", rowCount);

  let matchingRow = null;

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);

    const rowText = (await row.innerText()).trim();

    if (
      rowText
        .toLowerCase()
        .includes(tenderTitle.trim().toLowerCase())
    ) {
      matchingRow = row;
      break;
    }
  }

  if (!matchingRow) {
    throw new Error(`Tender row not found: ${tenderTitle}`);
  }

  console.log("Matching tender row found.");

  const link = matchingRow.locator("a.link2").first();

  const linkCount = await matchingRow
    .locator("a.link2")
    .count();

  console.log("Tender links in row:", linkCount);

  if (linkCount === 0) {
    throw new Error(`Tender link not found: ${tenderTitle}`);
  }

  console.log("Clicking tender link...");

  await link.click();

  await page.waitForTimeout(2000);

  console.log("CLICK COMPLETED");

  const currentUrl = page.url();
  const pageTitle = await page.title();

  console.log("CURRENT URL:", currentUrl);
  console.log("PAGE TITLE:", pageTitle);

  const bodyText = await page.locator("body").innerText();

  console.log("======================================");
  console.log("DETAIL PAGE CHECK");
  console.log("======================================");

  console.log(
    "Contains Tender ID:",
    bodyText.includes("Tender ID")
  );

  console.log(
    "Contains Organisation Chain:",
    bodyText.includes("Organisation Chain")
  );

  console.log(
    "Contains Tender Reference Number:",
    bodyText.includes("Tender Reference Number")
  );

  // Normalize whitespace
  const text = bodyText.replace(/\s+/g, " ").trim();

  function extractField(label: string): string | null {
    const regex = new RegExp(
      `${label}\\s+(.+?)(?=\\s{2,}|Tender Reference Number|Tender ID|Withdrawal Allowed|Tender Type|Form Of Contract|Tender Category|Payment Mode|Is Multi Currency|Allow Two Stage|$)`,
      "i"
    );

    const match = text.match(regex);

    return match ? match[1].trim() : null;
  }

  /*
   * Better direct extraction using the original page text.
   * These labels are followed by their values.
   */

  function extractByLabel(label: string): string | null {
    const index = text.toLowerCase().indexOf(label.toLowerCase());

    if (index === -1) {
      return null;
    }

    const start = index + label.length;

    const remaining = text.substring(start).trim();

    return remaining.split(
      /(?=\b(?:Tender Reference Number|Tender ID|Withdrawal Allowed|Tender Type|Form Of Contract|Tender Category|General Technical Evaluation Allowed|Payment Mode|Is Multi Currency Allowed|Allow Two Stage Bidding)\b)/i
    )[0].trim() || null;
  }

  const tenderIdMatch = text.match(
    /Tender ID\s+([A-Za-z0-9_]+)/i
  );

  const tenderReferenceMatch = text.match(
    /Tender Reference Number\s+(.+?)(?=\s+Tender ID\b)/i
  );

  const organisationMatch = text.match(
    /Organisation Chain\s+(.+?)(?=\s+Tender Reference Number\b)/i
  );

  const tenderId =
    tenderIdMatch?.[1]?.trim() ?? null;

  const tenderReferenceNumber =
    tenderReferenceMatch?.[1]?.trim() ?? null;

  const organisationChain =
    organisationMatch?.[1]?.trim() ?? null;

  console.log("======================================");
  console.log("EXTRACTED DETAILS");
  console.log("======================================");

  console.log("Tender ID:", tenderId);

  console.log(
    "Organisation Chain:",
    organisationChain
  );

  console.log(
    "Tender Reference Number:",
    tenderReferenceNumber
  );

  return {
    tenderId,
    organisationChain,
    tenderReferenceNumber,
    pageTitle,
    currentUrl,
  };
}