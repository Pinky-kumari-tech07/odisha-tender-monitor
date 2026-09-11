
// // // // import type { Page } from "playwright";

// // // // // ============================================================
// // // // // TYPES
// // // // // ============================================================

// // // // export type ParsedTender = {
// // // //   title: string;
// // // //   tenderNumber: string;
// // // //   closingDate: string | null;
// // // //   bidOpeningDate: string | null;
// // // //   sourceUrl: string | null;
// // // //   detailHref: string | null;
// // // //   isCorrigendum: boolean;
// // // //   tenderId: string | null;
// // // //   organisationChain: string | null;
// // // // };

// // // // export type TenderDetailData = {
// // // //   tenderNumber: string;
// // // //   tenderId: string | null;
// // // //   organisationChain: string | null;
// // // //   closingDate: string | null;
// // // //   bidOpeningDate: string | null;
// // // // };

// // // // // ============================================================
// // // // // CONSTANTS
// // // // // ============================================================

// // // // const PORTAL_HOME_URL =
// // // //   "https://tendersodisha.gov.in/";

// // // // const PORTAL_DATE_PATTERN =
// // // //   "\\d{1,2}-[A-Za-z]{3}-\\d{4}\\s+\\d{1,2}:\\d{2}\\s*(?:AM|PM)";

// // // // // ============================================================
// // // // // BASIC HELPERS
// // // // // ============================================================

// // // // function cleanText(
// // // //   value: string | null | undefined
// // // // ): string {
// // // //   return (value ?? "")
// // // //     .replace(/\u00a0/g, " ")
// // // //     .replace(/\s+/g, " ")
// // // //     .trim();
// // // // }

// // // // function cleanTenderId(
// // // //   value: string
// // // // ): string | null {
// // // //   const text = cleanText(value);

// // // //   const match = text.match(
// // // //     /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/
// // // //   );

// // // //   return match ? match[1] : null;
// // // // }

// // // // function cleanTitle(
// // // //   value: string
// // // // ): string {
// // // //   return cleanText(value)
// // // //     .replace(/^\d+\s*[.\-:]?\s*/, "")
// // // //     .trim();
// // // // }

// // // // function normalizeForMatch(
// // // //   value: string | null | undefined
// // // // ): string {
// // // //   return cleanText(value).toLowerCase();
// // // // }

// // // // // ============================================================
// // // // // DATE EXTRACTION
// // // // // ============================================================

// // // // function extractDateAfterLabel(
// // // //   text: string,
// // // //   label: string
// // // // ): string | null {
// // // //   const pattern = new RegExp(
// // // //     `${label}\\s+(${PORTAL_DATE_PATTERN})`,
// // // //     "i"
// // // //   );

// // // //   const match = text.match(pattern);

// // // //   return match
// // // //     ? cleanText(match[1])
// // // //     : null;
// // // // }

// // // // function extractBidOpeningDate(
// // // //   text: string
// // // // ): string | null {
// // // //   return extractDateAfterLabel(
// // // //     text,
// // // //     "Bid Opening Date"
// // // //   );
// // // // }

// // // // function extractClosingDateFromDetail(
// // // //   text: string
// // // // ): string | null {
// // // //   return extractDateAfterLabel(
// // // //     text,
// // // //     "Bid Submission End Date"
// // // //   );
// // // // }

// // // // // ============================================================
// // // // // DETAIL PAGE EXTRACTION
// // // // // ============================================================

// // // // function extractOrganisationChain(
// // // //   text: string
// // // // ): string | null {
// // // //   const match = text.match(
// // // //     /Organisation Chain\s+(.+?)(?=\s+Tender Reference Number|\s+Tender ID|\s+Tender Type|\s+Form Of Contract|$)/i
// // // //   );

// // // //   if (!match) {
// // // //     return null;
// // // //   }

// // // //   const organisation =
// // // //     cleanText(match[1]);

// // // //   return organisation || null;
// // // // }

// // // // function extractTenderIdFromDetail(
// // // //   text: string
// // // // ): string | null {
// // // //   const match = text.match(
// // // //     /Tender ID\s+(\d{4}_[A-Za-z0-9]+_\d+_\d+)/i
// // // //   );

// // // //   if (match) {
// // // //     return match[1];
// // // //   }

// // // //   return cleanTenderId(text);
// // // // }

// // // // function extractTenderReferenceNumber(
// // // //   text: string
// // // // ): string | null {
// // // //   const match = text.match(
// // // //     /Tender Reference Number\s+(.+?)(?=\s+Tender ID|\s+Tender Type|\s+Form Of Contract|\s+No\. of Covers|\s+Payment Mode|\s+Is Multi Currency Allowed|$)/i
// // // //   );

// // // //   if (!match) {
// // // //     return null;
// // // //   }

// // // //   const referenceNumber =
// // // //     cleanText(match[1]);

// // // //   return referenceNumber || null;
// // // // }

// // // // // ============================================================
// // // // // EXTRACT ALL DETAIL DATA
// // // // // ============================================================

// // // // export function extractDetailData(
// // // //   text: string
// // // // ): TenderDetailData {
// // // //   const cleanPageText =
// // // //     cleanText(text);

// // // //   return {
// // // //     tenderNumber:
// // // //       extractTenderReferenceNumber(
// // // //         cleanPageText
// // // //       ) ?? "",

// // // //     tenderId:
// // // //       extractTenderIdFromDetail(
// // // //         cleanPageText
// // // //       ),

// // // //     organisationChain:
// // // //       extractOrganisationChain(
// // // //         cleanPageText
// // // //       ),

// // // //     closingDate:
// // // //       extractClosingDateFromDetail(
// // // //         cleanPageText
// // // //       ),

// // // //     bidOpeningDate:
// // // //       extractBidOpeningDate(
// // // //         cleanPageText
// // // //       ),
// // // //   };
// // // // }

// // // // // ============================================================
// // // // // PUBLIC TABLE PARSER
// // // // // ============================================================

// // // // async function parseTable(
// // // //   page: Page,
// // // //   tableSelector: string,
// // // //   isCorrigendum: boolean
// // // // ): Promise<ParsedTender[]> {
// // // //   console.log(
// // // //     `Looking for table: ${tableSelector}`
// // // //   );

// // // //   const tableLocator =
// // // //     page.locator(tableSelector);

// // // //   const tableCount =
// // // //     await tableLocator.count();

// // // //   console.log(
// // // //     `Found ${tableCount} table(s) for selector: ${tableSelector}`
// // // //   );

// // // //   if (tableCount === 0) {
// // // //     return [];
// // // //   }

// // // //   const results: ParsedTender[] = [];

// // // //   for (
// // // //     let tableIndex = 0;
// // // //     tableIndex < tableCount;
// // // //     tableIndex++
// // // //   ) {
// // // //     try {
// // // //       const table =
// // // //         tableLocator.nth(tableIndex);

// // // //       const rows =
// // // //         table.locator("tr");

// // // //       const rowCount =
// // // //         await rows.count();

// // // //       console.log(
// // // //         `Table ${tableIndex + 1}: ${rowCount} row(s)`
// // // //       );

// // // //       for (
// // // //         let rowIndex = 0;
// // // //         rowIndex < rowCount;
// // // //         rowIndex++
// // // //       ) {
// // // //         try {
// // // //           const row =
// // // //             rows.nth(rowIndex);

// // // //           const cells =
// // // //             row.locator("td");

// // // //           const cellCount =
// // // //             await cells.count();

// // // //           if (cellCount < 3) {
// // // //             continue;
// // // //           }

// // // //           // ------------------------------------------
// // // //           // Read all cells
// // // //           // ------------------------------------------

// // // //           const cellTexts: string[] = [];

// // // //           for (
// // // //             let cellIndex = 0;
// // // //             cellIndex < cellCount;
// // // //             cellIndex++
// // // //           ) {
// // // //             const cellText =
// // // //               await cells
// // // //                 .nth(cellIndex)
// // // //                 .innerText();

// // // //             cellTexts.push(
// // // //               cleanText(cellText)
// // // //             );
// // // //           }

// // // //           const rowText =
// // // //             cellTexts.join(" ");

// // // //           const lowerRowText =
// // // //             rowText.toLowerCase();

// // // //           // ------------------------------------------
// // // //           // Skip header rows
// // // //           // ------------------------------------------

// // // //           if (
// // // //             lowerRowText.includes(
// // // //               "tender title"
// // // //             ) ||
// // // //             lowerRowText.includes(
// // // //               "corrigendum title"
// // // //             ) ||
// // // //             lowerRowText.includes(
// // // //               "reference no"
// // // //             )
// // // //           ) {
// // // //             continue;
// // // //           }

// // // //           // ------------------------------------------
// // // //           // Title
// // // //           // ------------------------------------------

// // // //           const title =
// // // //             cleanTitle(
// // // //               cellTexts[0] ?? ""
// // // //             );

// // // //           if (!title) {
// // // //             continue;
// // // //           }

// // // //           // ------------------------------------------
// // // //           // Detail URL
// // // //           // ------------------------------------------

// // // //           const firstCell =
// // // //             cells.nth(0);

// // // //           const link =
// // // //             firstCell
// // // //               .locator("a[href]")
// // // //               .first();

// // // //           let detailHref:
// // // //             string | null = null;

// // // //           if (
// // // //             await link.count() > 0
// // // //           ) {
// // // //             detailHref =
// // // //               await link.getAttribute(
// // // //                 "href"
// // // //               );
// // // //           }

// // // //           // ------------------------------------------
// // // //           // Table values
// // // //           //
// // // //           // These are temporary values.
// // // //           // Detail page will be the source of truth.
// // // //           // ------------------------------------------

// // // //           const tenderNumber =
// // // //             cleanText(
// // // //               cellTexts[1] ?? ""
// // // //             );

// // // //           const closingDate =
// // // //             cleanText(
// // // //               cellTexts[2] ?? ""
// // // //             ) || null;

// // // //           const bidOpeningDate =
// // // //             cleanText(
// // // //               cellTexts[3] ?? ""
// // // //             ) || null;

// // // //           // ------------------------------------------
// // // //           // Tender ID
// // // //           // ------------------------------------------

// // // //           const tenderIdMatch =
// // // //             rowText.match(
// // // //               /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/
// // // //             );

// // // //           const tenderId =
// // // //             tenderIdMatch
// // // //               ? tenderIdMatch[1]
// // // //               : null;

// // // //           // ------------------------------------------
// // // //           // Add result
// // // //           // ------------------------------------------

// // // //           results.push({
// // // //             title,
// // // //             tenderNumber,
// // // //             closingDate,
// // // //             bidOpeningDate,
// // // //             sourceUrl: detailHref,
// // // //             detailHref,
// // // //             isCorrigendum,
// // // //             tenderId,
// // // //             organisationChain: null,
// // // //           });
// // // //         } catch (rowError) {
// // // //           console.error(
// // // //             `Failed to parse row ${
// // // //               rowIndex + 1
// // // //             } in table ${
// // // //               tableIndex + 1
// // // //             }:`,
// // // //             rowError
// // // //           );
// // // //         }
// // // //       }
// // // //     } catch (tableError) {
// // // //       console.error(
// // // //         `Failed to parse table ${
// // // //           tableIndex + 1
// // // //         }:`,
// // // //         tableError
// // // //       );
// // // //     }
// // // //   }

// // // //   console.log(
// // // //     `Finished parsing ${tableSelector}. Total results: ${results.length}`
// // // //   );

// // // //   return results;
// // // // }

// // // // // ============================================================
// // // // // WAIT FOR TENDER TABLE
// // // // // ============================================================

// // // // export async function waitForActiveTenderTable(
// // // //   page: Page
// // // // ): Promise<void> {
// // // //   await page.waitForSelector(
// // // //     "#activeTenders, table.list_table",
// // // //     {
// // // //       state: "attached",
// // // //       timeout: 30000,
// // // //     }
// // // //   );
// // // // }

// // // // // ============================================================
// // // // // LATEST TENDERS
// // // // // ============================================================

// // // // export async function parseLatestTenders(
// // // //   page: Page
// // // // ): Promise<ParsedTender[]> {
// // // //   console.log(
// // // //     "Opening Odisha Tender Portal homepage..."
// // // //   );

// // // //   await page.goto(
// // // //     PORTAL_HOME_URL,
// // // //     {
// // // //       waitUntil:
// // // //         "domcontentloaded",
// // // //       timeout: 30000,
// // // //     }
// // // //   );

// // // //   console.log(
// // // //     `Current URL: ${page.url()}`
// // // //   );

// // // //   await waitForActiveTenderTable(
// // // //     page
// // // //   );

// // // //   console.log(
// // // //     "Tender table found."
// // // //   );

// // // //   // ------------------------------------------
// // // //   // First priority: #activeTenders
// // // //   // ------------------------------------------

// // // //   if (
// // // //     await page
// // // //       .locator("#activeTenders")
// // // //       .count() > 0
// // // //   ) {
// // // //     console.log(
// // // //       "Parsing #activeTenders table..."
// // // //     );

// // // //     const results =
// // // //       await parseTable(
// // // //         page,
// // // //         "#activeTenders",
// // // //         false
// // // //       );

// // // //     if (
// // // //       results.length > 0
// // // //     ) {
// // // //       console.log(
// // // //         `Parsed ${results.length} tenders from #activeTenders.`
// // // //       );

// // // //       return results;
// // // //     }
// // // //   }

// // // //   // ------------------------------------------
// // // //   // Fallback
// // // //   // ------------------------------------------

// // // //   console.log(
// // // //     "Using table.list_table fallback..."
// // // //   );

// // // //   const fallbackResults =
// // // //     await parseTable(
// // // //       page,
// // // //       "table.list_table",
// // // //       false
// // // //     );

// // // //   console.log(
// // // //     `Parsed ${fallbackResults.length} tenders from fallback table.`
// // // //   );

// // // //   return fallbackResults;
// // // // }

// // // // // ============================================================
// // // // // LATEST CORRIGENDA
// // // // // ============================================================

// // // // export async function parseLatestCorrigenda(
// // // //   page: Page
// // // // ): Promise<ParsedTender[]> {
// // // //   const tables =
// // // //     page.locator(
// // // //       "table.list_table"
// // // //     );

// // // //   const count =
// // // //     await tables.count();

// // // //   const results: ParsedTender[] = [];

// // // //   console.log(
// // // //     `Searching ${count} list table(s) for corrigenda...`
// // // //   );

// // // //   for (
// // // //     let i = 0;
// // // //     i < count;
// // // //     i++
// // // //   ) {
// // // //     try {
// // // //       const table =
// // // //         tables.nth(i);

// // // //       const text =
// // // //         normalizeForMatch(
// // // //           await table.innerText()
// // // //         );

// // // //       if (
// // // //         !text.includes(
// // // //           "corrigendum"
// // // //         )
// // // //       ) {
// // // //         continue;
// // // //       }

// // // //       console.log(
// // // //         `Parsing corrigendum table ${
// // // //           i + 1
// // // //         }...`
// // // //       );

// // // //       const rows =
// // // //         table.locator("tr");

// // // //       const rowCount =
// // // //         await rows.count();

// // // //       for (
// // // //         let rowIndex = 0;
// // // //         rowIndex < rowCount;
// // // //         rowIndex++
// // // //       ) {
// // // //         try {
// // // //           const row =
// // // //             rows.nth(rowIndex);

// // // //           const cells =
// // // //             row.locator("td");

// // // //           const cellCount =
// // // //             await cells.count();

// // // //           if (
// // // //             cellCount < 3
// // // //           ) {
// // // //             continue;
// // // //           }

// // // //           const cellTexts: string[] = [];

// // // //           for (
// // // //             let cellIndex = 0;
// // // //             cellIndex < cellCount;
// // // //             cellIndex++
// // // //           ) {
// // // //             const cellText =
// // // //               await cells
// // // //                 .nth(cellIndex)
// // // //                 .innerText();

// // // //             cellTexts.push(
// // // //               cleanText(cellText)
// // // //             );
// // // //           }

// // // //           const rowText =
// // // //             cellTexts.join(" ");

// // // //           const lowerRowText =
// // // //             rowText.toLowerCase();

// // // //           // Skip headers
// // // //           if (
// // // //             lowerRowText.includes(
// // // //               "corrigendum title"
// // // //             ) ||
// // // //             lowerRowText.includes(
// // // //               "reference no"
// // // //             )
// // // //           ) {
// // // //             continue;
// // // //           }

// // // //           const title =
// // // //             cleanTitle(
// // // //               cellTexts[0] ?? ""
// // // //             );

// // // //           if (!title) {
// // // //             continue;
// // // //           }

// // // //           const firstCell =
// // // //             cells.nth(0);

// // // //           const link =
// // // //             firstCell
// // // //               .locator("a[href]")
// // // //               .first();

// // // //           let detailHref:
// // // //             string | null = null;

// // // //           if (
// // // //             await link.count() > 0
// // // //           ) {
// // // //             detailHref =
// // // //               await link.getAttribute(
// // // //                 "href"
// // // //               );
// // // //           }

// // // //           const tenderNumber =
// // // //             cleanText(
// // // //               cellTexts[1] ?? ""
// // // //             );

// // // //           const closingDate =
// // // //             cleanText(
// // // //               cellTexts[2] ?? ""
// // // //             ) || null;

// // // //           const bidOpeningDate =
// // // //             cleanText(
// // // //               cellTexts[3] ?? ""
// // // //             ) || null;

// // // //           const tenderIdMatch =
// // // //             rowText.match(
// // // //               /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/
// // // //             );

// // // //           const tenderId =
// // // //             tenderIdMatch
// // // //               ? tenderIdMatch[1]
// // // //               : null;

// // // //           results.push({
// // // //             title,
// // // //             tenderNumber,
// // // //             closingDate,
// // // //             bidOpeningDate,
// // // //             sourceUrl: detailHref,
// // // //             detailHref,
// // // //             isCorrigendum: true,
// // // //             tenderId,
// // // //             organisationChain: null,
// // // //           });
// // // //         } catch (rowError) {
// // // //           console.error(
// // // //             `Failed to parse corrigendum row ${
// // // //               rowIndex + 1
// // // //             }:`,
// // // //             rowError
// // // //           );
// // // //         }
// // // //       }
// // // //     } catch (tableError) {
// // // //       console.error(
// // // //         `Failed to parse corrigendum table ${
// // // //           i + 1
// // // //         }:`,
// // // //         tableError
// // // //       );
// // // //     }
// // // //   }

// // // //   console.log(
// // // //     `Total corrigenda parsed: ${results.length}`
// // // //   );

// // // //   return results;
// // // // }

// // // // // ============================================================
// // // // // FIND EXACT TENDER ROW
// // // // // ============================================================

// // // // export async function findExactTenderRow(
// // // //   page: Page,
// // // //   tender: ParsedTender
// // // // ): Promise<{
// // // //   found: boolean;
// // // //   href: string | null;
// // // // }> {
// // // //   const rows =
// // // //     page.locator(
// // // //       "#activeTenders tr, table.list_table tr"
// // // //     );

// // // //   const rowCount =
// // // //     await rows.count();

// // // //   const targetTitle =
// // // //     normalizeForMatch(
// // // //       tender.title
// // // //     );

// // // //   const targetTenderNumber =
// // // //     normalizeForMatch(
// // // //       tender.tenderNumber
// // // //     );

// // // //   for (
// // // //     let i = 0;
// // // //     i < rowCount;
// // // //     i++
// // // //   ) {
// // // //     try {
// // // //       const row =
// // // //         rows.nth(i);

// // // //       const rowText =
// // // //         normalizeForMatch(
// // // //           await row.innerText()
// // // //         );

// // // //       // Title must match
// // // //       if (
// // // //         !rowText.includes(
// // // //           targetTitle
// // // //         )
// // // //       ) {
// // // //         continue;
// // // //       }

// // // //       // Tender number should match
// // // //       if (
// // // //         targetTenderNumber &&
// // // //         !rowText.includes(
// // // //           targetTenderNumber
// // // //         )
// // // //       ) {
// // // //         continue;
// // // //       }

// // // //       const link =
// // // //         row
// // // //           .locator("a[href]")
// // // //           .first();

// // // //       if (
// // // //         await link.count() > 0
// // // //       ) {
// // // //         return {
// // // //           found: true,
// // // //           href:
// // // //             await link.getAttribute(
// // // //               "href"
// // // //             ),
// // // //         };
// // // //       }
// // // //     } catch (error) {
// // // //       console.error(
// // // //         `Failed while checking row ${
// // // //           i + 1
// // // //         }:`,
// // // //         error
// // // //       );
// // // //     }
// // // //   }

// // // //   return {
// // // //     found: false,
// // // //     href: null,
// // // //   };
// // // // }

// // // // // ============================================================
// // // // // INSPECT TENDER DETAILS
// // // // // ============================================================

// // // // export async function inspectTenderDetails(
// // // //   page: Page,
// // // //   tenders: ParsedTender[]
// // // // ): Promise<ParsedTender[]> {
// // // //   const enrichedTenders: ParsedTender[] =
// // // //     [];

// // // //   console.log(
// // // //     `Inspecting ${
// // // //       tenders.length
// // // //     } tender detail page(s)...`
// // // //   );

// // // //   for (
// // // //     const tender of tenders
// // // //   ) {
// // // //     let detailPage:
// // // //       Page | null = null;

// // // //     try {
// // // //       // ------------------------------------------
// // // //       // Find exact detail URL
// // // //       // ------------------------------------------

// // // //       let detailHref =
// // // //         tender.detailHref;

// // // //       if (!detailHref) {
// // // //         const rowResult =
// // // //           await findExactTenderRow(
// // // //             page,
// // // //             tender
// // // //           );

// // // //         if (
// // // //           rowResult.found
// // // //         ) {
// // // //           detailHref =
// // // //             rowResult.href;
// // // //         }
// // // //       }

// // // //       if (!detailHref) {
// // // //         console.warn(
// // // //           `No detail URL found for: ${tender.title}`
// // // //         );

// // // //         enrichedTenders.push(
// // // //           tender
// // // //         );

// // // //         continue;
// // // //       }

// // // //       // ------------------------------------------
// // // //       // Open detail page
// // // //       // ------------------------------------------

// // // //       detailPage =
// // // //         await page
// // // //           .context()
// // // //           .newPage();

// // // //       let absoluteUrl =
// // // //         detailHref;

// // // //       if (
// // // //         !detailHref.startsWith(
// // // //           "http://"
// // // //         ) &&
// // // //         !detailHref.startsWith(
// // // //           "https://"
// // // //         )
// // // //       ) {
// // // //         absoluteUrl =
// // // //           new URL(
// // // //             detailHref,
// // // //             page.url()
// // // //           ).toString();
// // // //       }

// // // //       console.log(
// // // //         `Opening detail URL: ${absoluteUrl}`
// // // //       );

// // // //       await detailPage.goto(
// // // //         absoluteUrl,
// // // //         {
// // // //           waitUntil:
// // // //             "domcontentloaded",
// // // //           timeout: 30000,
// // // //         }
// // // //       );

// // // //       // ------------------------------------------
// // // //       // Small wait for page content
// // // //       // ------------------------------------------

// // // //       await detailPage.waitForTimeout(
// // // //         500
// // // //       );

// // // //       // ------------------------------------------
// // // //       // Read detail page text
// // // //       // ------------------------------------------

// // // //       const detailText =
// // // //         await detailPage
// // // //           .locator("body")
// // // //           .innerText();

// // // //       // ------------------------------------------
// // // //       // Extract detail data
// // // //       // ------------------------------------------

// // // //       const details =
// // // //         extractDetailData(
// // // //           detailText
// // // //         );

// // // //       console.log(
// // // //         `Reference: ${
// // // //           details.tenderNumber ||
// // // //           "Not found"
// // // //         }`
// // // //       );

// // // //       console.log(
// // // //         `Tender ID: ${
// // // //           details.tenderId ||
// // // //           "Not found"
// // // //         }`
// // // //       );

// // // //       console.log(
// // // //         `Organisation: ${
// // // //           details.organisationChain ||
// // // //           "Not found"
// // // //         }`
// // // //       );

// // // //       console.log(
// // // //         `Closing Date: ${
// // // //           details.closingDate ||
// // // //           "Not found"
// // // //         }`
// // // //       );

// // // //       console.log(
// // // //         `Bid Opening Date: ${
// // // //           details.bidOpeningDate ||
// // // //           "Not found"
// // // //         }`
// // // //       );

// // // //       // ------------------------------------------
// // // //       // Merge detail data with table data
// // // //       //
// // // //       // Detail page values have priority.
// // // //       // ------------------------------------------

// // // //       enrichedTenders.push({
// // // //         ...tender,

// // // //         tenderNumber:
// // // //           details.tenderNumber ||
// // // //           tender.tenderNumber,

// // // //         tenderId:
// // // //           details.tenderId ||
// // // //           tender.tenderId,

// // // //         organisationChain:
// // // //           details.organisationChain ||
// // // //           tender.organisationChain,

// // // //         closingDate:
// // // //           details.closingDate ||
// // // //           tender.closingDate,

// // // //         bidOpeningDate:
// // // //           details.bidOpeningDate ||
// // // //           tender.bidOpeningDate,

// // // //         detailHref,

// // // //         sourceUrl:
// // // //           detailHref,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error(
// // // //         `Failed to inspect tender detail: ${tender.title}`,
// // // //         error
// // // //       );

// // // //       // Keep original table data
// // // //       // if detail page fails.
// // // //       enrichedTenders.push(
// // // //         tender
// // // //       );
// // // //     } finally {
// // // //       // ------------------------------------------
// // // //       // Always close detail page
// // // //       // ------------------------------------------

// // // //       if (detailPage) {
// // // //         try {
// // // //           await detailPage.close();
// // // //         } catch (closeError) {
// // // //           console.error(
// // // //             "Failed to close detail page:",
// // // //             closeError
// // // //           );
// // // //         }
// // // //       }
// // // //     }
// // // //   }

// // // //   console.log(
// // // //     `Tender detail inspection completed. Enriched ${
// // // //       enrichedTenders.length
// // // //     } tender(s).`
// // // //   );

// // // //   return enrichedTenders;
// // // // }


// // // import type { Page } from "playwright";

// // // // ============================================================
// // // // TYPES
// // // // ============================================================

// // // export type ParsedTender = {
// // //   title: string;
// // //   tenderNumber: string;
// // //   closingDate: string | null;
// // //   bidOpeningDate: string | null;
// // //   sourceUrl: string | null;
// // //   detailHref: string | null;
// // //   isCorrigendum: boolean;
// // //   tenderId: string | null;
// // //   organisationChain: string | null;
// // // };

// // // export type TenderDetailData = {
// // //   tenderNumber: string;
// // //   tenderId: string | null;
// // //   organisationChain: string | null;
// // //   closingDate: string | null;
// // //   bidOpeningDate: string | null;
// // // };

// // // // ============================================================
// // // // CONSTANTS
// // // // ============================================================

// // // const PORTAL_HOME_URL =
// // //   "https://tendersodisha.gov.in/";

// // // const PORTAL_DATE_PATTERN =
// // //   "\\d{1,2}-[A-Za-z]{3}-\\d{4}\\s+\\d{1,2}:\\d{2}\\s*(?:AM|PM)";

// // // // ============================================================
// // // // TEXT HELPERS
// // // // ============================================================

// // // function cleanText(
// // //   value: string | null | undefined
// // // ): string {
// // //   return (value ?? "")
// // //     .replace(/\u00a0/g, " ")
// // //     .replace(/\s+/g, " ")
// // //     .trim();
// // // }

// // // function cleanTitle(
// // //   value: string
// // // ): string {
// // //   return cleanText(value)
// // //     .replace(/^\d+\s*[.\-:]?\s*/, "")
// // //     .trim();
// // // }

// // // function normalizeForMatch(
// // //   value: string | null | undefined
// // // ): string {
// // //   return cleanText(value).toLowerCase();
// // // }

// // // function cleanTenderId(
// // //   value: string
// // // ): string | null {
// // //   const text = cleanText(value);

// // //   const match = text.match(
// // //     /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/
// // //   );

// // //   return match
// // //     ? match[1]
// // //     : null;
// // // }

// // // // ============================================================
// // // // DATE EXTRACTION
// // // // ============================================================

// // // function extractDateAfterLabel(
// // //   text: string,
// // //   label: string
// // // ): string | null {
// // //   const pattern = new RegExp(
// // //     `${label}\\s+(${PORTAL_DATE_PATTERN})`,
// // //     "i"
// // //   );

// // //   const match = text.match(pattern);

// // //   return match
// // //     ? cleanText(match[1])
// // //     : null;
// // // }

// // // function extractBidOpeningDate(
// // //   text: string
// // // ): string | null {
// // //   return extractDateAfterLabel(
// // //     text,
// // //     "Bid Opening Date"
// // //   );
// // // }

// // // function extractClosingDateFromDetail(
// // //   text: string
// // // ): string | null {
// // //   return extractDateAfterLabel(
// // //     text,
// // //     "Bid Submission End Date"
// // //   );
// // // }

// // // // ============================================================
// // // // DETAIL PAGE EXTRACTION
// // // // ============================================================

// // // function extractOrganisationChain(
// // //   text: string
// // // ): string | null {
// // //   const match = text.match(
// // //     /Organisation Chain\s+(.+?)(?=\s+Tender Reference Number|\s+Tender ID|\s+Tender Type|\s+Form Of Contract|$)/i
// // //   );

// // //   if (!match) {
// // //     return null;
// // //   }

// // //   const organisation =
// // //     cleanText(match[1]);

// // //   return organisation || null;
// // // }

// // // function extractTenderIdFromDetail(
// // //   text: string
// // // ): string | null {
// // //   const match = text.match(
// // //     /Tender ID\s+(\d{4}_[A-Za-z0-9]+_\d+_\d+)/i
// // //   );

// // //   if (match) {
// // //     return match[1];
// // //   }

// // //   return cleanTenderId(text);
// // // }

// // // function extractTenderReferenceNumber(
// // //   text: string
// // // ): string | null {
// // //   const match = text.match(
// // //     /Tender Reference Number\s+(.+?)(?=\s+Tender ID|\s+Tender Type|\s+Form Of Contract|\s+No\. of Covers|\s+Payment Mode|\s+Is Multi Currency Allowed|$)/i
// // //   );

// // //   if (!match) {
// // //     return null;
// // //   }

// // //   const reference =
// // //     cleanText(match[1]);

// // //   return reference || null;
// // // }

// // // // ============================================================
// // // // EXTRACT DETAIL DATA
// // // // ============================================================

// // // export function extractDetailData(
// // //   text: string
// // // ): TenderDetailData {
// // //   const cleanPageText =
// // //     cleanText(text);

// // //   return {
// // //     tenderNumber:
// // //       extractTenderReferenceNumber(
// // //         cleanPageText
// // //       ) ?? "",

// // //     tenderId:
// // //       extractTenderIdFromDetail(
// // //         cleanPageText
// // //       ),

// // //     organisationChain:
// // //       extractOrganisationChain(
// // //         cleanPageText
// // //       ),

// // //     closingDate:
// // //       extractClosingDateFromDetail(
// // //         cleanPageText
// // //       ),

// // //     bidOpeningDate:
// // //       extractBidOpeningDate(
// // //         cleanPageText
// // //       ),
// // //   };
// // // }

// // // // ============================================================
// // // // FIND TABLE HEADERS
// // // // ============================================================

// // // async function getTableHeaders(
// // //   table: ReturnType<Page["locator"]>
// // // ): Promise<string[]> {
// // //   const headers: string[] = [];

// // //   // ----------------------------------------------------------
// // //   // First try THEAD
// // //   // ----------------------------------------------------------

// // //   const thead =
// // //     table
// // //       .locator("thead tr")
// // //       .first()
// // //       .locator("th, td");

// // //   const theadCount =
// // //     await thead.count();

// // //   if (theadCount > 0) {
// // //     for (
// // //       let i = 0;
// // //       i < theadCount;
// // //       i++
// // //     ) {
// // //       headers.push(
// // //         cleanText(
// // //           await thead
// // //             .nth(i)
// // //             .innerText()
// // //         )
// // //       );
// // //     }

// // //     return headers;
// // //   }

// // //   // ----------------------------------------------------------
// // //   // Fallback: search all rows
// // //   // ----------------------------------------------------------

// // //   const rows =
// // //     table.locator("tr");

// // //   const rowCount =
// // //     await rows.count();

// // //   for (
// // //     let rowIndex = 0;
// // //     rowIndex < rowCount;
// // //     rowIndex++
// // //   ) {
// // //     const row =
// // //       rows.nth(rowIndex);

// // //     const cells =
// // //       row.locator("th, td");

// // //     const cellCount =
// // //       await cells.count();

// // //     if (cellCount === 0) {
// // //       continue;
// // //     }

// // //     const possibleHeaders: string[] =
// // //       [];

// // //     for (
// // //       let i = 0;
// // //       i < cellCount;
// // //       i++
// // //     ) {
// // //       possibleHeaders.push(
// // //         cleanText(
// // //           await cells
// // //             .nth(i)
// // //             .innerText()
// // //         )
// // //       );
// // //     }

// // //     const combined =
// // //       possibleHeaders
// // //         .join(" ")
// // //         .toLowerCase();

// // //     if (
// // //       combined.includes(
// // //         "tender title"
// // //       ) ||
// // //       combined.includes(
// // //         "corrigendum title"
// // //       ) ||
// // //       combined.includes(
// // //         "reference no"
// // //       )
// // //     ) {
// // //       return possibleHeaders;
// // //     }
// // //   }

// // //   return [];
// // // }

// // // // ============================================================
// // // // FIND HEADER INDEX
// // // // ============================================================

// // // function findHeaderIndex(
// // //   headers: string[],
// // //   keywords: string[]
// // // ): number {
// // //   const normalized =
// // //     headers.map((header) =>
// // //       normalizeForMatch(header)
// // //     );

// // //   return normalized.findIndex(
// // //     (header) =>
// // //       keywords.some(
// // //         (keyword) =>
// // //           header.includes(
// // //             keyword
// // //           )
// // //       )
// // //   );
// // // }

// // // // ============================================================
// // // // PARSE TABLE
// // // // ============================================================

// // // async function parseTable(
// // //   page: Page,
// // //   tableSelector: string,
// // //   isCorrigendum: boolean
// // // ): Promise<ParsedTender[]> {
// // //   console.log(
// // //     `Looking for table: ${tableSelector}`
// // //   );

// // //   const tableLocator =
// // //     page.locator(tableSelector);

// // //   const tableCount =
// // //     await tableLocator.count();

// // //   console.log(
// // //     `Found ${tableCount} table(s) for selector: ${tableSelector}`
// // //   );

// // //   if (tableCount === 0) {
// // //     return [];
// // //   }

// // //   const results: ParsedTender[] =
// // //     [];

// // //   for (
// // //     let tableIndex = 0;
// // //     tableIndex < tableCount;
// // //     tableIndex++
// // //   ) {
// // //     try {
// // //       const table =
// // //         tableLocator.nth(
// // //           tableIndex
// // //         );

// // //       // ======================================================
// // //       // HEADERS
// // //       // ======================================================

// // //       const headers =
// // //         await getTableHeaders(
// // //           table
// // //         );

// // //       console.log(
// // //         `Table ${tableIndex + 1} headers:`,
// // //         headers
// // //       );

// // //       // ======================================================
// // //       // COLUMN INDEXES
// // //       // ======================================================

// // //       const titleIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "tender title",
// // //             "corrigendum title",
// // //           ]
// // //         );

// // //       const referenceIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "reference no",
// // //             "reference number",
// // //             "tender reference",
// // //           ]
// // //         );

// // //       const closingIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "closing date",
// // //           ]
// // //         );

// // //       const bidOpeningIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "bid opening date",
// // //           ]
// // //         );

// // //       console.log(
// // //         `Column indexes -> title: ${titleIndex}, reference: ${referenceIndex}, closing: ${closingIndex}, bid opening: ${bidOpeningIndex}`
// // //       );

// // //       // ======================================================
// // //       // ROWS
// // //       // ======================================================

// // //       let rows =
// // //         table.locator(
// // //           "tbody tr"
// // //         );

// // //       let rowCount =
// // //         await rows.count();

// // //       if (rowCount === 0) {
// // //         rows =
// // //           table.locator("tr");

// // //         rowCount =
// // //           await rows.count();
// // //       }

// // //       console.log(
// // //         `Table ${tableIndex + 1}: ${rowCount} row(s)`
// // //       );

// // //       // ======================================================
// // //       // PARSE EACH ROW
// // //       // ======================================================

// // //       for (
// // //         let rowIndex = 0;
// // //         rowIndex < rowCount;
// // //         rowIndex++
// // //       ) {
// // //         try {
// // //           const row =
// // //             rows.nth(rowIndex);

// // //           const cells =
// // //             row.locator("td");

// // //           const cellCount =
// // //             await cells.count();

// // //           if (
// // //             cellCount < 3
// // //           ) {
// // //             continue;
// // //           }

// // //           // --------------------------------------------------
// // //           // Read cells
// // //           // --------------------------------------------------

// // //           const cellTexts: string[] =
// // //             [];

// // //           for (
// // //             let cellIndex = 0;
// // //             cellIndex < cellCount;
// // //             cellIndex++
// // //           ) {
// // //             const text =
// // //               await cells
// // //                 .nth(cellIndex)
// // //                 .innerText();

// // //             cellTexts.push(
// // //               cleanText(text)
// // //             );
// // //           }

// // //           const rowText =
// // //             cellTexts.join(" ");

// // //           const lowerRowText =
// // //             rowText.toLowerCase();

// // //           // --------------------------------------------------
// // //           // Skip header row
// // //           // --------------------------------------------------

// // //           if (
// // //             lowerRowText.includes(
// // //               "tender title"
// // //             ) ||
// // //             lowerRowText.includes(
// // //               "corrigendum title"
// // //             ) ||
// // //             lowerRowText.includes(
// // //               "reference no"
// // //             )
// // //           ) {
// // //             continue;
// // //           }

// // //           // --------------------------------------------------
// // //           // Safe cell getter
// // //           // --------------------------------------------------

// // //           function getCellText(
// // //             index: number
// // //           ): string {
// // //             if (
// // //               index < 0 ||
// // //               index >=
// // //                 cellTexts.length
// // //             ) {
// // //               return "";
// // //             }

// // //             return cleanText(
// // //               cellTexts[index]
// // //             );
// // //           }

// // //           // ==================================================
// // //           // TITLE
// // //           // ==================================================

// // //           let title = "";

// // //           if (
// // //             titleIndex >= 0 &&
// // //             titleIndex < cellCount
// // //           ) {
// // //             title =
// // //               cleanTitle(
// // //                 getCellText(
// // //                   titleIndex
// // //                 )
// // //               );
// // //           }

// // //           if (!title) {
// // //             title =
// // //               cleanTitle(
// // //                 getCellText(0)
// // //               );
// // //           }

// // //           if (!title) {
// // //             continue;
// // //           }

// // //           // ==================================================
// // //           // REFERENCE NUMBER
// // //           // ==================================================

// // //           let tenderNumber = "";

// // //           if (
// // //             referenceIndex >= 0 &&
// // //             referenceIndex < cellCount
// // //           ) {
// // //             tenderNumber =
// // //               getCellText(
// // //                 referenceIndex
// // //               );
// // //           }

// // //           // ==================================================
// // //           // CLOSING DATE
// // //           // ==================================================

// // //           let closingDate:
// // //             string | null = null;

// // //           if (
// // //             closingIndex >= 0 &&
// // //             closingIndex < cellCount
// // //           ) {
// // //             closingDate =
// // //               getCellText(
// // //                 closingIndex
// // //               ) || null;
// // //           }

// // //           // ==================================================
// // //           // BID OPENING DATE
// // //           // ==================================================

// // //           let bidOpeningDate:
// // //             string | null = null;

// // //           if (
// // //             bidOpeningIndex >= 0 &&
// // //             bidOpeningIndex < cellCount
// // //           ) {
// // //             bidOpeningDate =
// // //               getCellText(
// // //                 bidOpeningIndex
// // //               ) || null;
// // //           }

// // //           // ==================================================
// // //           // DATE FALLBACK
// // //           // ==================================================

// // //           const dateMatches =
// // //             rowText.match(
// // //               new RegExp(
// // //                 PORTAL_DATE_PATTERN,
// // //                 "gi"
// // //               )
// // //             ) || [];

// // //           if (
// // //             !closingDate &&
// // //             dateMatches.length >= 1
// // //           ) {
// // //             closingDate =
// // //               cleanText(
// // //                 dateMatches[0]
// // //               );
// // //           }

// // //           if (
// // //             !bidOpeningDate &&
// // //             dateMatches.length >= 2
// // //           ) {
// // //             bidOpeningDate =
// // //               cleanText(
// // //                 dateMatches[1]
// // //               );
// // //           }

// // //           // ==================================================
// // //           // DETAIL LINK
// // //           // ==================================================

// // //           let titleCell;

// // //           if (
// // //             titleIndex >= 0 &&
// // //             titleIndex < cellCount
// // //           ) {
// // //             titleCell =
// // //               cells.nth(
// // //                 titleIndex
// // //               );
// // //           } else {
// // //             titleCell =
// // //               cells.nth(0);
// // //           }

// // //           const link =
// // //             titleCell
// // //               .locator("a[href]")
// // //               .first();

// // //           let detailHref:
// // //             string | null = null;

// // //           if (
// // //             await link.count() > 0
// // //           ) {
// // //             detailHref =
// // //               await link.getAttribute(
// // //                 "href"
// // //               );
// // //           }

// // //           // ==================================================
// // //           // TENDER ID
// // //           // ==================================================

// // //           const tenderIdMatch =
// // //             rowText.match(
// // //               /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/
// // //             );

// // //           const tenderId =
// // //             tenderIdMatch
// // //               ? tenderIdMatch[1]
// // //               : null;

// // //           // ==================================================
// // //           // DEBUG
// // //           // ==================================================

// // //           if (
// // //             rowIndex === 1
// // //           ) {
// // //             console.log(
// // //               "Sample parsed row:",
// // //               {
// // //                 title,
// // //                 tenderNumber,
// // //                 closingDate,
// // //                 bidOpeningDate,
// // //                 detailHref,
// // //                 tenderId,
// // //               }
// // //             );
// // //           }

// // //           // ==================================================
// // //           // SAVE RESULT
// // //           // ==================================================

// // //           results.push({
// // //             title,
// // //             tenderNumber,
// // //             closingDate,
// // //             bidOpeningDate,
// // //             sourceUrl:
// // //               detailHref,
// // //             detailHref,
// // //             isCorrigendum,
// // //             tenderId,
// // //             organisationChain:
// // //               null,
// // //           });
// // //         } catch (rowError) {
// // //           console.error(
// // //             `Failed to parse row ${
// // //               rowIndex + 1
// // //             } in table ${
// // //               tableIndex + 1
// // //             }:`,
// // //             rowError
// // //           );
// // //         }
// // //       }
// // //     } catch (tableError) {
// // //       console.error(
// // //         `Failed to parse table ${
// // //           tableIndex + 1
// // //         }:`,
// // //         tableError
// // //       );
// // //     }
// // //   }

// // //   console.log(
// // //     `Finished parsing ${tableSelector}. Total results: ${results.length}`
// // //   );

// // //   return results;
// // // }

// // // // ============================================================
// // // // WAIT FOR TABLE
// // // // ============================================================

// // // export async function waitForActiveTenderTable(
// // //   page: Page
// // // ): Promise<void> {
// // //   console.log(
// // //     "Waiting for tender table..."
// // //   );

// // //   await page.waitForSelector(
// // //     "#activeTenders, table.list_table",
// // //     {
// // //       state: "attached",
// // //       timeout: 45000,
// // //     }
// // //   );

// // //   console.log(
// // //     "Tender table detected."
// // //   );
// // // }

// // // // ============================================================
// // // // PARSE LATEST TENDERS
// // // // ============================================================

// // // export async function parseLatestTenders(
// // //   page: Page
// // // ): Promise<ParsedTender[]> {
// // //   console.log(
// // //     "Opening Odisha Tender Portal homepage..."
// // //   );

// // //   try {
// // //     await page.goto(
// // //       PORTAL_HOME_URL,
// // //       {
// // //         waitUntil: "commit",
// // //         timeout: 30000,
// // //       }
// // //     );
// // //   } catch (navigationError) {
// // //     console.warn(
// // //       "Initial portal navigation warning:",
// // //       navigationError
// // //     );
// // //   }

// // //   console.log(
// // //     `Current URL after navigation: ${page.url()}`
// // //   );

// // //   await page.waitForTimeout(
// // //     5000
// // //   );

// // //   console.log(
// // //     `URL after waiting: ${page.url()}`
// // //   );

// // //   await waitForActiveTenderTable(
// // //     page
// // //   );

// // //   console.log(
// // //     "Tender table found."
// // //   );

// // //   // ----------------------------------------------------------
// // //   // PRIMARY TABLE
// // //   // ----------------------------------------------------------

// // //   if (
// // //     await page
// // //       .locator("#activeTenders")
// // //       .count() > 0
// // //   ) {
// // //     console.log(
// // //       "Parsing #activeTenders table..."
// // //     );

// // //     const results =
// // //       await parseTable(
// // //         page,
// // //         "#activeTenders",
// // //         false
// // //       );

// // //     if (
// // //       results.length > 0
// // //     ) {
// // //       console.log(
// // //         `Parsed ${results.length} tenders from #activeTenders.`
// // //       );

// // //       return results;
// // //     }
// // //   }

// // //   // ----------------------------------------------------------
// // //   // FALLBACK TABLE
// // //   // ----------------------------------------------------------

// // //   console.log(
// // //     "Using table.list_table fallback..."
// // //   );

// // //   const fallbackResults =
// // //     await parseTable(
// // //       page,
// // //       "table.list_table",
// // //       false
// // //     );

// // //   console.log(
// // //     `Parsed ${fallbackResults.length} tenders from fallback table.`
// // //   );

// // //   return fallbackResults;
// // // }

// // // // ============================================================
// // // // PARSE LATEST CORRIGENDA
// // // // ============================================================

// // // export async function parseLatestCorrigenda(
// // //   page: Page
// // // ): Promise<ParsedTender[]> {
// // //   const tables =
// // //     page.locator(
// // //       "table.list_table"
// // //     );

// // //   const tableCount =
// // //     await tables.count();

// // //   const results: ParsedTender[] =
// // //     [];

// // //   console.log(
// // //     `Searching ${tableCount} table(s) for corrigenda...`
// // //   );

// // //   for (
// // //     let tableIndex = 0;
// // //     tableIndex < tableCount;
// // //     tableIndex++
// // //   ) {
// // //     try {
// // //       const table =
// // //         tables.nth(
// // //           tableIndex
// // //         );

// // //       const tableText =
// // //         normalizeForMatch(
// // //           await table.innerText()
// // //         );

// // //       if (
// // //         !tableText.includes(
// // //           "corrigendum"
// // //         )
// // //       ) {
// // //         continue;
// // //       }

// // //       console.log(
// // //         `Parsing corrigendum table ${
// // //           tableIndex + 1
// // //         }...`
// // //       );

// // //       const headers =
// // //         await getTableHeaders(
// // //           table
// // //         );

// // //       console.log(
// // //         "Corrigendum headers:",
// // //         headers
// // //       );

// // //       const titleIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "corrigendum title",
// // //             "tender title",
// // //           ]
// // //         );

// // //       const referenceIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "reference no",
// // //             "reference number",
// // //             "tender reference",
// // //           ]
// // //         );

// // //       const closingIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "closing date",
// // //           ]
// // //         );

// // //       const bidOpeningIndex =
// // //         findHeaderIndex(
// // //           headers,
// // //           [
// // //             "bid opening date",
// // //           ]
// // //         );

// // //       let rows =
// // //         table.locator(
// // //           "tbody tr"
// // //         );

// // //       let rowCount =
// // //         await rows.count();

// // //       if (
// // //         rowCount === 0
// // //       ) {
// // //         rows =
// // //           table.locator("tr");

// // //         rowCount =
// // //           await rows.count();
// // //       }

// // //       for (
// // //         let rowIndex = 0;
// // //         rowIndex < rowCount;
// // //         rowIndex++
// // //       ) {
// // //         try {
// // //           const row =
// // //             rows.nth(rowIndex);

// // //           const cells =
// // //             row.locator("td");

// // //           const cellCount =
// // //             await cells.count();

// // //           if (
// // //             cellCount < 3
// // //           ) {
// // //             continue;
// // //           }

// // //           const cellTexts: string[] =
// // //             [];

// // //           for (
// // //             let i = 0;
// // //             i < cellCount;
// // //             i++
// // //           ) {
// // //             cellTexts.push(
// // //               cleanText(
// // //                 await cells
// // //                   .nth(i)
// // //                   .innerText()
// // //               )
// // //             );
// // //           }

// // //           const rowText =
// // //             cellTexts.join(" ");

// // //           const lowerRowText =
// // //             rowText.toLowerCase();

// // //           if (
// // //             lowerRowText.includes(
// // //               "corrigendum title"
// // //             ) ||
// // //             lowerRowText.includes(
// // //               "reference no"
// // //             )
// // //           ) {
// // //             continue;
// // //           }

// // //           function getCellText(
// // //             index: number
// // //           ): string {
// // //             if (
// // //               index < 0 ||
// // //               index >=
// // //                 cellTexts.length
// // //             ) {
// // //               return "";
// // //             }

// // //             return cleanText(
// // //               cellTexts[index]
// // //             );
// // //           }

// // //           let title = "";

// // //           if (
// // //             titleIndex >= 0
// // //           ) {
// // //             title =
// // //               cleanTitle(
// // //                 getCellText(
// // //                   titleIndex
// // //                 )
// // //               );
// // //           }

// // //           if (!title) {
// // //             title =
// // //               cleanTitle(
// // //                 getCellText(0)
// // //               );
// // //           }

// // //           if (!title) {
// // //             continue;
// // //           }

// // //           let tenderNumber = "";

// // //           if (
// // //             referenceIndex >= 0
// // //           ) {
// // //             tenderNumber =
// // //               getCellText(
// // //                 referenceIndex
// // //               );
// // //           }

// // //           let closingDate:
// // //             string | null = null;

// // //           if (
// // //             closingIndex >= 0
// // //           ) {
// // //             closingDate =
// // //               getCellText(
// // //                 closingIndex
// // //               ) || null;
// // //           }

// // //           let bidOpeningDate:
// // //             string | null = null;

// // //           if (
// // //             bidOpeningIndex >= 0
// // //           ) {
// // //             bidOpeningDate =
// // //               getCellText(
// // //                 bidOpeningIndex
// // //               ) || null;
// // //           }

// // //           const dateMatches =
// // //             rowText.match(
// // //               new RegExp(
// // //                 PORTAL_DATE_PATTERN,
// // //                 "gi"
// // //               )
// // //             ) || [];

// // //           if (
// // //             !closingDate &&
// // //             dateMatches.length >= 1
// // //           ) {
// // //             closingDate =
// // //               cleanText(
// // //                 dateMatches[0]
// // //               );
// // //           }

// // //           if (
// // //             !bidOpeningDate &&
// // //             dateMatches.length >= 2
// // //           ) {
// // //             bidOpeningDate =
// // //               cleanText(
// // //                 dateMatches[1]
// // //               );
// // //           }

// // //           let titleCell;

// // //           if (
// // //             titleIndex >= 0 &&
// // //             titleIndex < cellCount
// // //           ) {
// // //             titleCell =
// // //               cells.nth(
// // //                 titleIndex
// // //               );
// // //           } else {
// // //             titleCell =
// // //               cells.nth(0);
// // //           }

// // //           const link =
// // //             titleCell
// // //               .locator("a[href]")
// // //               .first();

// // //           let detailHref:
// // //             string | null = null;

// // //           if (
// // //             await link.count() > 0
// // //           ) {
// // //             detailHref =
// // //               await link.getAttribute(
// // //                 "href"
// // //               );
// // //           }

// // //           const tenderIdMatch =
// // //             rowText.match(
// // //               /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/
// // //             );

// // //           const tenderId =
// // //             tenderIdMatch
// // //               ? tenderIdMatch[1]
// // //               : null;

// // //           results.push({
// // //             title,
// // //             tenderNumber,
// // //             closingDate,
// // //             bidOpeningDate,
// // //             sourceUrl:
// // //               detailHref,
// // //             detailHref,
// // //             isCorrigendum: true,
// // //             tenderId,
// // //             organisationChain:
// // //               null,
// // //           });
// // //         } catch (rowError) {
// // //           console.error(
// // //             `Failed to parse corrigendum row ${
// // //               rowIndex + 1
// // //             }:`,
// // //             rowError
// // //           );
// // //         }
// // //       }
// // //     } catch (tableError) {
// // //       console.error(
// // //         `Failed to parse corrigendum table ${
// // //           tableIndex + 1
// // //         }:`,
// // //         tableError
// // //       );
// // //     }
// // //   }

// // //   console.log(
// // //     `Total corrigenda parsed: ${results.length}`
// // //   );

// // //   return results;
// // // }

// // // // ============================================================
// // // // FIND EXACT TENDER ROW
// // // // ============================================================

// // // export async function findExactTenderRow(
// // //   page: Page,
// // //   tender: ParsedTender
// // // ): Promise<{
// // //   found: boolean;
// // //   href: string | null;
// // // }> {
// // //   const rows =
// // //     page.locator(
// // //       "#activeTenders tr, table.list_table tr"
// // //     );

// // //   const rowCount =
// // //     await rows.count();

// // //   const targetTitle =
// // //     normalizeForMatch(
// // //       tender.title
// // //     );

// // //   const targetTenderNumber =
// // //     normalizeForMatch(
// // //       tender.tenderNumber
// // //     );

// // //   for (
// // //     let i = 0;
// // //     i < rowCount;
// // //     i++
// // //   ) {
// // //     try {
// // //       const row =
// // //         rows.nth(i);

// // //       const rowText =
// // //         normalizeForMatch(
// // //           await row.innerText()
// // //         );

// // //       if (
// // //         !rowText.includes(
// // //           targetTitle
// // //         )
// // //       ) {
// // //         continue;
// // //       }

// // //       if (
// // //         targetTenderNumber &&
// // //         !rowText.includes(
// // //           targetTenderNumber
// // //         )
// // //       ) {
// // //         continue;
// // //       }

// // //       const link =
// // //         row
// // //           .locator("a[href]")
// // //           .first();

// // //       if (
// // //         await link.count() > 0
// // //       ) {
// // //         return {
// // //           found: true,
// // //           href:
// // //             await link.getAttribute(
// // //               "href"
// // //             ),
// // //         };
// // //       }
// // //     } catch (error) {
// // //       console.error(
// // //         `Failed while checking tender row ${
// // //           i + 1
// // //         }:`,
// // //         error
// // //       );
// // //     }
// // //   }

// // //   return {
// // //     found: false,
// // //     href: null,
// // //   };
// // // }

// // // // ============================================================
// // // // INSPECT TENDER DETAILS
// // // // ============================================================

// // // export async function inspectTenderDetails(
// // //   page: Page,
// // //   tenders: ParsedTender[]
// // // ): Promise<ParsedTender[]> {
// // //   const enrichedTenders:
// // //     ParsedTender[] = [];

// // //   console.log(
// // //     `Inspecting ${tenders.length} tender detail page(s)...`
// // //   );

// // //   for (
// // //     const tender of tenders
// // //   ) {
// // //     let detailPage:
// // //       Page | null = null;

// // //     try {
// // //       let detailHref =
// // //         tender.detailHref;

// // //       // --------------------------------------------------------
// // //       // Find URL if missing
// // //       // --------------------------------------------------------

// // //       if (!detailHref) {
// // //         const rowResult =
// // //           await findExactTenderRow(
// // //             page,
// // //             tender
// // //           );

// // //         if (
// // //           rowResult.found
// // //         ) {
// // //           detailHref =
// // //             rowResult.href;
// // //         }
// // //       }

// // //       if (!detailHref) {
// // //         console.warn(
// // //           `No detail URL found for: ${tender.title}`
// // //         );

// // //         enrichedTenders.push(
// // //           tender
// // //         );

// // //         continue;
// // //       }

// // //       // --------------------------------------------------------
// // //       // Open detail page
// // //       // --------------------------------------------------------

// // //       detailPage =
// // //         await page
// // //           .context()
// // //           .newPage();

// // //       let absoluteUrl =
// // //         detailHref;

// // //       if (
// // //         !detailHref.startsWith(
// // //           "http://"
// // //         ) &&
// // //         !detailHref.startsWith(
// // //           "https://"
// // //         )
// // //       ) {
// // //         absoluteUrl =
// // //           new URL(
// // //             detailHref,
// // //             page.url()
// // //           ).toString();
// // //       }

// // //       console.log(
// // //         `Opening detail URL: ${absoluteUrl}`
// // //       );

// // //       try {
// // //         await detailPage.goto(
// // //           absoluteUrl,
// // //           {
// // //             waitUntil:
// // //               "domcontentloaded",
// // //             timeout: 30000,
// // //           }
// // //         );
// // //       } catch (navigationError) {
// // //         console.warn(
// // //           `Detail page navigation warning for ${tender.title}:`,
// // //           navigationError
// // //         );
// // //       }

// // //       await detailPage.waitForTimeout(
// // //         500
// // //       );

// // //       // --------------------------------------------------------
// // //       // Read detail page
// // //       // --------------------------------------------------------

// // //       const detailText =
// // //         await detailPage
// // //           .locator("body")
// // //           .innerText();

// // //       // --------------------------------------------------------
// // //       // Extract detail data
// // //       // --------------------------------------------------------

// // //       const details =
// // //         extractDetailData(
// // //           detailText
// // //         );

// // //       console.log(
// // //         "----------------------------------------"
// // //       );

// // //       console.log(
// // //         `Tender Title: ${tender.title}`
// // //       );

// // //       console.log(
// // //         `Reference: ${
// // //           details.tenderNumber ||
// // //           "Not found"
// // //         }`
// // //       );

// // //       console.log(
// // //         `Tender ID: ${
// // //           details.tenderId ||
// // //           "Not found"
// // //         }`
// // //       );

// // //       console.log(
// // //         `Organisation: ${
// // //           details.organisationChain ||
// // //           "Not found"
// // //         }`
// // //       );

// // //       console.log(
// // //         `Closing Date: ${
// // //           details.closingDate ||
// // //           "Not found"
// // //         }`
// // //       );

// // //       console.log(
// // //         `Bid Opening Date: ${
// // //           details.bidOpeningDate ||
// // //           "Not found"
// // //         }`
// // //       );

// // //       console.log(
// // //         "----------------------------------------"
// // //       );

// // //       // --------------------------------------------------------
// // //       // Merge detail information
// // //       // --------------------------------------------------------

// // //       enrichedTenders.push({
// // //         ...tender,

// // //         tenderNumber:
// // //           details.tenderNumber ||
// // //           tender.tenderNumber,

// // //         tenderId:
// // //           details.tenderId ||
// // //           tender.tenderId,

// // //         organisationChain:
// // //           details.organisationChain ||
// // //           tender.organisationChain,

// // //         closingDate:
// // //           details.closingDate ||
// // //           tender.closingDate,

// // //         bidOpeningDate:
// // //           details.bidOpeningDate ||
// // //           tender.bidOpeningDate,

// // //         detailHref,

// // //         sourceUrl:
// // //           detailHref,
// // //       });
// // //     } catch (error) {
// // //       console.error(
// // //         `Failed to inspect tender detail: ${tender.title}`,
// // //         error
// // //       );

// // //       // Keep original data if
// // //       // detail page fails.
// // //       enrichedTenders.push(
// // //         tender
// // //       );
// // //     } finally {
// // //       if (detailPage) {
// // //         try {
// // //           await detailPage.close();
// // //         } catch (closeError) {
// // //           console.error(
// // //             "Failed to close detail page:",
// // //             closeError
// // //           );
// // //         }
// // //       }
// // //     }
// // //   }

// // //   console.log(
// // //     `Tender detail inspection completed. Enriched ${enrichedTenders.length} tender(s).`
// // //   );

// // //   return enrichedTenders;
// // // }


// // import type { Locator, Page } from "playwright";

// // // ============================================================
// // // TYPES
// // // ============================================================

// // export type ParsedTender = {
// //   title: string;
// //   tenderNumber: string;
// //   closingDate: string | null;
// //   bidOpeningDate: string | null;
// //   sourceUrl: string | null;
// //   detailHref: string | null;
// //   isCorrigendum: boolean;
// //   tenderId: string | null;
// //   organisationChain: string | null;
// // };

// // export type TenderDetailData = {
// //   tenderNumber: string;
// //   tenderId: string | null;
// //   organisationChain: string | null;
// //   closingDate: string | null;
// //   bidOpeningDate: string | null;
// // };

// // // ============================================================
// // // CONSTANTS
// // // ============================================================

// // const PORTAL_HOME_URL =
// //   "https://tendersodisha.gov.in/";

// // const PORTAL_DATE_PATTERN =
// //   "\\d{1,2}-[A-Za-z]{3}-\\d{4}\\s+\\d{1,2}:\\d{2}\\s*(?:AM|PM)";

// // const TENDER_ID_PATTERN =
// //   /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/;

// // // ============================================================
// // // BASIC HELPERS
// // // ============================================================

// // function cleanText(
// //   value: string | null | undefined
// // ): string {
// //   return (value ?? "")
// //     .replace(/\u00a0/g, " ")
// //     .replace(/\s+/g, " ")
// //     .trim();
// // }

// // function cleanTitle(
// //   value: string | null | undefined
// // ): string {
// //   return cleanText(value)
// //     .replace(/^\d+\s*[.\-:]?\s*/, "")
// //     .trim();
// // }

// // function normalizeForMatch(
// //   value: string | null | undefined
// // ): string {
// //   return cleanText(value).toLowerCase();
// // }

// // function cleanTenderId(
// //   value: string
// // ): string | null {
// //   const text = cleanText(value);

// //   const match =
// //     text.match(TENDER_ID_PATTERN);

// //   return match
// //     ? match[1]
// //     : null;
// // }

// // // ============================================================
// // // DATE EXTRACTION
// // // ============================================================

// // function extractDateAfterLabel(
// //   text: string,
// //   label: string
// // ): string | null {
// //   const pattern = new RegExp(
// //     `${label}\\s+(${PORTAL_DATE_PATTERN})`,
// //     "i"
// //   );

// //   const match =
// //     text.match(pattern);

// //   return match
// //     ? cleanText(match[1])
// //     : null;
// // }

// // function extractBidOpeningDate(
// //   text: string
// // ): string | null {
// //   return extractDateAfterLabel(
// //     text,
// //     "Bid Opening Date"
// //   );
// // }

// // function extractClosingDateFromDetail(
// //   text: string
// // ): string | null {
// //   return extractDateAfterLabel(
// //     text,
// //     "Bid Submission End Date"
// //   );
// // }

// // // ============================================================
// // // DETAIL PAGE EXTRACTION
// // // ============================================================

// // function extractOrganisationChain(
// //   text: string
// // ): string | null {
// //   const match = text.match(
// //     /Organisation Chain\s+(.+?)(?=\s+Tender Reference Number|\s+Tender ID|\s+Tender Type|\s+Form Of Contract|$)/i
// //   );

// //   if (!match) {
// //     return null;
// //   }

// //   const organisation =
// //     cleanText(match[1]);

// //   return organisation || null;
// // }

// // function extractTenderIdFromDetail(
// //   text: string
// // ): string | null {
// //   const match = text.match(
// //     /Tender ID\s+(\d{4}_[A-Za-z0-9]+_\d+_\d+)/i
// //   );

// //   if (match) {
// //     return match[1];
// //   }

// //   return cleanTenderId(text);
// // }

// // function extractTenderReferenceNumber(
// //   text: string
// // ): string | null {
// //   const match = text.match(
// //     /Tender Reference Number\s+(.+?)(?=\s+Tender ID|\s+Tender Type|\s+Form Of Contract|\s+No\. of Covers|\s+Payment Mode|\s+Is Multi Currency Allowed|$)/i
// //   );

// //   if (!match) {
// //     return null;
// //   }

// //   const reference =
// //     cleanText(match[1]);

// //   return reference || null;
// // }

// // // ============================================================
// // // EXTRACT DETAIL DATA
// // // ============================================================

// // export function extractDetailData(
// //   text: string
// // ): TenderDetailData {
// //   const cleanPageText =
// //     cleanText(text);

// //   return {
// //     tenderNumber:
// //       extractTenderReferenceNumber(
// //         cleanPageText
// //       ) ?? "",

// //     tenderId:
// //       extractTenderIdFromDetail(
// //         cleanPageText
// //       ),

// //     organisationChain:
// //       extractOrganisationChain(
// //         cleanPageText
// //       ),

// //     closingDate:
// //       extractClosingDateFromDetail(
// //         cleanPageText
// //       ),

// //     bidOpeningDate:
// //       extractBidOpeningDate(
// //         cleanPageText
// //       ),
// //   };
// // }

// // // ============================================================
// // // FIND TABLE HEADERS
// // // ============================================================

// // async function getTableHeaders(
// //   table: Locator
// // ): Promise<string[]> {
// //   const headers: string[] = [];

// //   // ----------------------------------------------------------
// //   // 1. Try THEAD
// //   // ----------------------------------------------------------

// //   const theadRows =
// //     table.locator("thead tr");

// //   const theadRowCount =
// //     await theadRows.count();

// //   for (
// //     let rowIndex = 0;
// //     rowIndex < theadRowCount;
// //     rowIndex++
// //   ) {
// //     const row =
// //       theadRows.nth(rowIndex);

// //     const cells =
// //       row.locator("th, td");

// //     const cellCount =
// //       await cells.count();

// //     const currentHeaders: string[] =
// //       [];

// //     for (
// //       let cellIndex = 0;
// //       cellIndex < cellCount;
// //       cellIndex++
// //     ) {
// //       currentHeaders.push(
// //         cleanText(
// //           await cells
// //             .nth(cellIndex)
// //             .innerText()
// //         )
// //       );
// //     }

// //     const combined =
// //       currentHeaders
// //         .join(" ")
// //         .toLowerCase();

// //     if (
// //       combined.includes(
// //         "tender title"
// //       ) ||
// //       combined.includes(
// //         "corrigendum title"
// //       ) ||
// //       combined.includes(
// //         "reference no"
// //       )
// //     ) {
// //       return currentHeaders;
// //     }
// //   }

// //   // ----------------------------------------------------------
// //   // 2. Search normal TR rows
// //   // ----------------------------------------------------------

// //   const rows =
// //     table.locator("tr");

// //   const rowCount =
// //     await rows.count();

// //   for (
// //     let rowIndex = 0;
// //     rowIndex < rowCount;
// //     rowIndex++
// //   ) {
// //     const row =
// //       rows.nth(rowIndex);

// //     const cells =
// //       row.locator("th, td");

// //     const cellCount =
// //       await cells.count();

// //     if (cellCount === 0) {
// //       continue;
// //     }

// //     const possibleHeaders: string[] =
// //       [];

// //     for (
// //       let cellIndex = 0;
// //       cellIndex < cellCount;
// //       cellIndex++
// //     ) {
// //       possibleHeaders.push(
// //         cleanText(
// //           await cells
// //             .nth(cellIndex)
// //             .innerText()
// //         )
// //       );
// //     }

// //     const combined =
// //       possibleHeaders
// //         .join(" ")
// //         .toLowerCase();

// //     if (
// //       combined.includes(
// //         "tender title"
// //       ) ||
// //       combined.includes(
// //         "corrigendum title"
// //       ) ||
// //       combined.includes(
// //         "reference no"
// //       )
// //     ) {
// //       return possibleHeaders;
// //     }
// //   }

// //   return headers;
// // }

// // // ============================================================
// // // FIND HEADER INDEX
// // // ============================================================

// // function findHeaderIndex(
// //   headers: string[],
// //   keywords: string[]
// // ): number {
// //   const normalized =
// //     headers.map((header) =>
// //       normalizeForMatch(header)
// //     );

// //   return normalized.findIndex(
// //     (header) =>
// //       keywords.some((keyword) =>
// //         header.includes(keyword)
// //       )
// //   );
// // }

// // // ============================================================
// // // FIND DETAIL LINK FROM ROW
// // // ============================================================

// // async function findDetailLink(
// //   row: Locator
// // ): Promise<string | null> {
// //   const links =
// //     row.locator("a[href]");

// //   const linkCount =
// //     await links.count();

// //   if (linkCount === 0) {
// //     return null;
// //   }

// //   // ----------------------------------------------------------
// //   // First priority:
// //   // links that look like tender/detail links
// //   // ----------------------------------------------------------

// //   for (
// //     let i = 0;
// //     i < linkCount;
// //     i++
// //   ) {
// //     const link =
// //       links.nth(i);

// //     const href =
// //       await link.getAttribute(
// //         "href"
// //       );

// //     if (!href) {
// //       continue;
// //     }

// //     const text =
// //       cleanText(
// //         await link.innerText()
// //       );

// //     const lowerHref =
// //       href.toLowerCase();

// //     const lowerText =
// //       text.toLowerCase();

// //     // Ignore javascript links

// //     if (
// //       lowerHref.startsWith(
// //         "javascript:"
// //       )
// //     ) {
// //       continue;
// //     }

// //     // Prefer detail-like links

// //     if (
// //       lowerHref.includes(
// //         "tender"
// //       ) ||
// //       lowerHref.includes(
// //         "view"
// //       ) ||
// //       lowerHref.includes(
// //         "direct"
// //       ) ||
// //       lowerText.includes(
// //         "view"
// //       )
// //     ) {
// //       return href;
// //     }
// //   }

// //   // ----------------------------------------------------------
// //   // Fallback:
// //   // first valid href
// //   // ----------------------------------------------------------

// //   for (
// //     let i = 0;
// //     i < linkCount;
// //     i++
// //   ) {
// //     const href =
// //       await links
// //         .nth(i)
// //         .getAttribute(
// //           "href"
// //         );

// //     if (
// //       href &&
// //       !href
// //         .toLowerCase()
// //         .startsWith(
// //           "javascript:"
// //         )
// //     ) {
// //       return href;
// //     }
// //   }

// //   return null;
// // }

// // // ============================================================
// // // FIND TITLE FROM ROW
// // // ============================================================

// // async function findTitleFromRow(
// //   row: Locator,
// //   cellTexts: string[]
// // ): Promise<string> {
// //   // ----------------------------------------------------------
// //   // First priority:
// //   // useful link text
// //   // ----------------------------------------------------------

// //   const links =
// //     row.locator("a[href]");

// //   const linkCount =
// //     await links.count();

// //   for (
// //     let linkIndex = 0;
// //     linkIndex < linkCount;
// //     linkIndex++
// //   ) {
// //     const link =
// //       links.nth(linkIndex);

// //     const linkText =
// //       cleanText(
// //         await link.innerText()
// //       );

// //     if (
// //       !linkText ||
// //       linkText.length <= 5
// //     ) {
// //       continue;
// //     }

// //     // Ignore generic buttons

// //     if (
// //       /^view$/i.test(linkText) ||
// //       /^details?$/i.test(
// //         linkText
// //       ) ||
// //       /^click here$/i.test(
// //         linkText
// //       )
// //     ) {
// //       continue;
// //     }

// //     const title =
// //       cleanTitle(linkText);

// //     if (title) {
// //       return title;
// //     }
// //   }

// //   // ----------------------------------------------------------
// //   // Second priority:
// //   // first useful cell
// //   // ----------------------------------------------------------

// //   for (
// //     const cellText of cellTexts
// //   ) {
// //     if (!cellText) {
// //       continue;
// //     }

// //     // Ignore simple numbers

// //     if (/^\d+$/.test(cellText)) {
// //       continue;
// //     }

// //     // Ignore dates

// //     if (
// //       new RegExp(
// //         `^${PORTAL_DATE_PATTERN}$`,
// //         "i"
// //       ).test(cellText)
// //     ) {
// //       continue;
// //     }

// //     const title =
// //       cleanTitle(cellText);

// //     if (title) {
// //       return title;
// //     }
// //   }

// //   return "";
// // }

// // // ============================================================
// // // PARSE PUBLIC TABLE
// // // ============================================================
// // //
// // // IMPORTANT:
// // //
// // // Homepage table is NOT treated as the source of truth.
// // //
// // // We only use it to find:
// // //
// // // 1. Tender title
// // // 2. Detail page URL
// // // 3. Optional Tender ID
// // //
// // // Reference number and dates are obtained from the
// // // tender detail page by inspectTenderDetails().
// // //
// // // ============================================================

// // async function parseTable(
// //   page: Page,
// //   tableSelector: string,
// //   isCorrigendum: boolean
// // ): Promise<ParsedTender[]> {
// //   console.log(
// //     `Looking for table: ${tableSelector}`
// //   );

// //   const tableLocator =
// //     page.locator(tableSelector);

// //   const tableCount =
// //     await tableLocator.count();

// //   console.log(
// //     `Found ${tableCount} table(s) for selector: ${tableSelector}`
// //   );

// //   if (tableCount === 0) {
// //     return [];
// //   }

// //   const results: ParsedTender[] =
// //     [];

// //   for (
// //     let tableIndex = 0;
// //     tableIndex < tableCount;
// //     tableIndex++
// //   ) {
// //     try {
// //       const table =
// //         tableLocator.nth(
// //           tableIndex
// //         );

// //       let rows =
// //         table.locator(
// //           "tbody tr"
// //         );

// //       let rowCount =
// //         await rows.count();

// //       if (rowCount === 0) {
// //         rows =
// //           table.locator("tr");

// //         rowCount =
// //           await rows.count();
// //       }

// //       console.log(
// //         `Table ${tableIndex + 1}: ${rowCount} row(s)`
// //       );

// //       for (
// //         let rowIndex = 0;
// //         rowIndex < rowCount;
// //         rowIndex++
// //       ) {
// //         try {
// //           const row =
// //             rows.nth(rowIndex);

// //           const cells =
// //             row.locator("td");

// //           const cellCount =
// //             await cells.count();

// //           if (cellCount === 0) {
// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // Read cells
// //           // --------------------------------------------------

// //           const cellTexts: string[] =
// //             [];

// //           for (
// //             let cellIndex = 0;
// //             cellIndex < cellCount;
// //             cellIndex++
// //           ) {
// //             const text =
// //               await cells
// //                 .nth(cellIndex)
// //                 .innerText();

// //             cellTexts.push(
// //               cleanText(text)
// //             );
// //           }

// //           const rowText =
// //             cellTexts.join(" ");

// //           if (!rowText) {
// //             continue;
// //           }

// //           const lowerRowText =
// //             rowText.toLowerCase();

// //           // --------------------------------------------------
// //           // Skip header rows
// //           // --------------------------------------------------

// //           if (
// //             lowerRowText.includes(
// //               "tender title"
// //             ) ||
// //             lowerRowText.includes(
// //               "corrigendum title"
// //             ) ||
// //             lowerRowText.includes(
// //               "reference no"
// //             )
// //           ) {
// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // Find title
// //           // --------------------------------------------------

// //           const title =
// //             await findTitleFromRow(
// //               row,
// //               cellTexts
// //             );

// //           if (!title) {
// //             console.warn(
// //               `Skipping row ${
// //                 rowIndex + 1
// //               }: title not found`
// //             );

// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // Find detail link
// //           // --------------------------------------------------

// //           const detailHref =
// //             await findDetailLink(
// //               row
// //             );

// //           if (!detailHref) {
// //             console.warn(
// //               `No detail link found for: ${title}`
// //             );
// //           }

// //           // --------------------------------------------------
// //           // Optional Tender ID
// //           //
// //           // Usually detail page gives the reliable value.
// //           // --------------------------------------------------

// //           const tenderIdMatch =
// //             rowText.match(
// //               TENDER_ID_PATTERN
// //             );

// //           const tenderId =
// //             tenderIdMatch
// //               ? tenderIdMatch[1]
// //               : null;

// //           // --------------------------------------------------
// //           // IMPORTANT
// //           //
// //           // Do NOT read reference/date values from homepage.
// //           // --------------------------------------------------

// //           console.log(
// //             "Parsed table row:",
// //             {
// //               rowIndex:
// //                 rowIndex + 1,
// //               title,
// //               detailHref,
// //               tenderId,
// //             }
// //           );

// //           results.push({
// //             title,

// //             tenderNumber: "",

// //             closingDate: null,

// //             bidOpeningDate: null,

// //             sourceUrl:
// //               detailHref,

// //             detailHref,

// //             isCorrigendum,

// //             tenderId,

// //             organisationChain:
// //               null,
// //           });
// //         } catch (rowError) {
// //           console.error(
// //             `Failed to parse row ${
// //               rowIndex + 1
// //             } in table ${
// //               tableIndex + 1
// //             }:`,
// //             rowError
// //           );
// //         }
// //       }
// //     } catch (tableError) {
// //       console.error(
// //         `Failed to parse table ${
// //           tableIndex + 1
// //         }:`,
// //         tableError
// //       );
// //     }
// //   }

// //   console.log(
// //     `Finished parsing ${tableSelector}. Total results: ${results.length}`
// //   );

// //   return results;
// // }

// // // ============================================================
// // // WAIT FOR ACTIVE TENDER TABLE
// // // ============================================================

// // export async function waitForActiveTenderTable(
// //   page: Page
// // ): Promise<void> {
// //   console.log(
// //     "Waiting for tender table..."
// //   );

// //   await page.waitForSelector(
// //     "#activeTenders, table.list_table",
// //     {
// //       state: "attached",
// //       timeout: 45000,
// //     }
// //   );

// //   console.log(
// //     "Tender table detected."
// //   );
// // }

// // // ============================================================
// // // PARSE LATEST TENDERS
// // // ============================================================

// // export async function parseLatestTenders(
// //   page: Page
// // ): Promise<ParsedTender[]> {
// //   console.log(
// //     "Opening Odisha Tender Portal homepage..."
// //   );

// //   try {
// //     await page.goto(
// //       PORTAL_HOME_URL,
// //       {
// //         waitUntil: "commit",
// //         timeout: 30000,
// //       }
// //     );
// //   } catch (navigationError) {
// //     console.warn(
// //       "Initial portal navigation warning:",
// //       navigationError
// //     );
// //   }

// //   console.log(
// //     `Current URL after navigation: ${page.url()}`
// //   );

// //   // Give portal time to finish loading

// //   await page.waitForTimeout(
// //     5000
// //   );

// //   console.log(
// //     `URL after waiting: ${page.url()}`
// //   );

// //   await waitForActiveTenderTable(
// //     page
// //   );

// //   console.log(
// //     "Tender table found."
// //   );

// //   // ----------------------------------------------------------
// //   // PRIMARY TABLE
// //   // ----------------------------------------------------------

// //   if (
// //     await page
// //       .locator(
// //         "#activeTenders"
// //       )
// //       .count() > 0
// //   ) {
// //     console.log(
// //       "Parsing #activeTenders table..."
// //     );

// //     const results =
// //       await parseTable(
// //         page,
// //         "#activeTenders",
// //         false
// //       );

// //     if (
// //       results.length > 0
// //     ) {
// //       console.log(
// //         `Parsed ${results.length} tenders from #activeTenders.`
// //       );

// //       return results;
// //     }
// //   }

// //   // ----------------------------------------------------------
// //   // FALLBACK
// //   // ----------------------------------------------------------

// //   console.log(
// //     "Using table.list_table fallback..."
// //   );

// //   const fallbackResults =
// //     await parseTable(
// //       page,
// //       "table.list_table",
// //       false
// //     );

// //   console.log(
// //     `Parsed ${fallbackResults.length} tenders from fallback table.`
// //   );

// //   return fallbackResults;
// // }

// // // ============================================================
// // // PARSE LATEST CORRIGENDA
// // // ============================================================
// // //
// // // IMPORTANT:
// // //
// // // Corrigendum homepage rows can contain:
// // //
// // // - duplicate rows
// // // - "More..." navigation links
// // // - rows without useful detail links
// // //
// // // Therefore this function filters and deduplicates them.
// // //
// // // ============================================================

// // export async function parseLatestCorrigenda(
// //   page: Page
// // ): Promise<ParsedTender[]> {
// //   const tables =
// //     page.locator(
// //       "table.list_table"
// //     );

// //   const tableCount =
// //     await tables.count();

// //   const results: ParsedTender[] =
// //     [];

// //   console.log(
// //     `Searching ${tableCount} table(s) for corrigenda...`
// //   );

// //   for (
// //     let tableIndex = 0;
// //     tableIndex < tableCount;
// //     tableIndex++
// //   ) {
// //     try {
// //       const table =
// //         tables.nth(
// //           tableIndex
// //         );

// //       const tableText =
// //         normalizeForMatch(
// //           await table.innerText()
// //         );

// //       // Only process tables containing corrigendum data

// //       if (
// //         !tableText.includes(
// //           "corrigendum"
// //         )
// //       ) {
// //         continue;
// //       }

// //       console.log(
// //         `Parsing corrigendum table ${
// //           tableIndex + 1
// //         }...`
// //       );

// //       // ------------------------------------------------------
// //       // Rows
// //       // ------------------------------------------------------

// //       let rows =
// //         table.locator(
// //           "tbody tr"
// //         );

// //       let rowCount =
// //         await rows.count();

// //       if (rowCount === 0) {
// //         rows =
// //           table.locator("tr");

// //         rowCount =
// //           await rows.count();
// //       }

// //       for (
// //         let rowIndex = 0;
// //         rowIndex < rowCount;
// //         rowIndex++
// //       ) {
// //         try {
// //           const row =
// //             rows.nth(
// //               rowIndex
// //             );

// //           const cells =
// //             row.locator("td");

// //           const cellCount =
// //             await cells.count();

// //           if (cellCount === 0) {
// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // Read cells
// //           // --------------------------------------------------

// //           const cellTexts: string[] =
// //             [];

// //           for (
// //             let cellIndex = 0;
// //             cellIndex < cellCount;
// //             cellIndex++
// //           ) {
// //             cellTexts.push(
// //               cleanText(
// //                 await cells
// //                   .nth(
// //                     cellIndex
// //                   )
// //                   .innerText()
// //               )
// //             );
// //           }

// //           const rowText =
// //             cellTexts.join(" ");

// //           if (!rowText) {
// //             continue;
// //           }

// //           const lowerRowText =
// //             rowText.toLowerCase();

// //           // --------------------------------------------------
// //           // Skip header
// //           // --------------------------------------------------

// //           if (
// //             lowerRowText.includes(
// //               "corrigendum title"
// //             ) ||
// //             lowerRowText.includes(
// //               "reference no"
// //             )
// //           ) {
// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // TITLE
// //           // --------------------------------------------------

// //           const title =
// //             await findTitleFromRow(
// //               row,
// //               cellTexts
// //             );

// //           if (!title) {
// //             console.warn(
// //               `Skipping corrigendum row ${
// //                 rowIndex + 1
// //               }: title not found`
// //             );

// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // SKIP "MORE..." NAVIGATION ROW
// //           // --------------------------------------------------

// //           if (
// //             /^more\.{0,3}$/i.test(
// //               title
// //             )
// //           ) {
// //             console.log(
// //               "Skipping More... navigation row"
// //             );

// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // FIND DETAIL LINK
// //           // --------------------------------------------------

// //           const detailHref =
// //             await findDetailLink(
// //               row
// //             );

// //           if (!detailHref) {
// //             console.warn(
// //               `Skipping corrigendum without detail link: ${title}`
// //             );

// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // OPTIONAL TENDER ID
// //           // --------------------------------------------------

// //           const tenderIdMatch =
// //             rowText.match(
// //               TENDER_ID_PATTERN
// //             );

// //           const tenderId =
// //             tenderIdMatch
// //               ? tenderIdMatch[1]
// //               : null;

// //           // --------------------------------------------------
// //           // DUPLICATE CHECK
// //           // --------------------------------------------------
// //           //
// //           // Duplicate priority:
// //           //
// //           // 1. Same detail URL
// //           // 2. Same title + Tender ID
// //           //
// //           // This handles the duplicate "REV SCC" case.
// //           // --------------------------------------------------

// //           const normalizedTitle =
// //             normalizeForMatch(
// //               title
// //             );

// //           const duplicate =
// //             results.some(
// //               (existing) => {
// //                 // Same detail URL

// //                 if (
// //                   existing.detailHref ===
// //                   detailHref
// //                 ) {
// //                   return true;
// //                 }

// //                 // Same title + same Tender ID

// //                 if (
// //                   normalizeForMatch(
// //                     existing.title
// //                   ) ===
// //                     normalizedTitle &&
// //                   existing.tenderId ===
// //                     tenderId
// //                 ) {
// //                   return true;
// //                 }

// //                 // If both have no Tender ID,
// //                 // same title is enough to avoid
// //                 // obvious homepage duplicates.

// //                 if (
// //                   !existing.tenderId &&
// //                   !tenderId &&
// //                   normalizeForMatch(
// //                     existing.title
// //                   ) ===
// //                     normalizedTitle
// //                 ) {
// //                   return true;
// //                 }

// //                 return false;
// //               }
// //             );

// //           if (duplicate) {
// //             console.log(
// //               `Skipping duplicate corrigendum: ${title}`
// //             );

// //             continue;
// //           }

// //           // --------------------------------------------------
// //           // SAVE VALID CORRIGENDUM
// //           // --------------------------------------------------

// //           const corrigendum: ParsedTender =
// //             {
// //               title,

// //               tenderNumber: "",

// //               closingDate: null,

// //               bidOpeningDate: null,

// //               sourceUrl:
// //                 detailHref,

// //               detailHref,

// //               isCorrigendum: true,

// //               tenderId,

// //               organisationChain:
// //                 null,
// //             };

// //           results.push(
// //             corrigendum
// //           );

// //           console.log(
// //             "Parsed corrigendum row:",
// //             {
// //               rowIndex:
// //                 rowIndex + 1,

// //               title,

// //               detailHref,

// //               tenderId,
// //             }
// //           );
// //         } catch (rowError) {
// //           console.error(
// //             `Failed to parse corrigendum row ${
// //               rowIndex + 1
// //             }:`,
// //             rowError
// //           );
// //         }
// //       }
// //     } catch (tableError) {
// //       console.error(
// //         `Failed to parse corrigendum table ${
// //           tableIndex + 1
// //         }:`,
// //         tableError
// //       );
// //     }
// //   }

// //   console.log(
// //     `Total valid corrigenda parsed: ${results.length}`
// //   );

// //   return results;
// // }

// // // ============================================================
// // // FIND EXACT TENDER ROW
// // // ============================================================

// // export async function findExactTenderRow(
// //   page: Page,
// //   tender: ParsedTender
// // ): Promise<{
// //   found: boolean;
// //   href: string | null;
// // }> {
// //   const rows =
// //     page.locator(
// //       "#activeTenders tr, table.list_table tr"
// //     );

// //   const rowCount =
// //     await rows.count();

// //   const targetTitle =
// //     normalizeForMatch(
// //       tender.title
// //     );

// //   // ----------------------------------------------------------
// //   // First try Tender ID
// //   // ----------------------------------------------------------

// //   const targetTenderId =
// //     normalizeForMatch(
// //       tender.tenderId
// //     );

// //   for (
// //     let i = 0;
// //     i < rowCount;
// //     i++
// //   ) {
// //     try {
// //       const row =
// //         rows.nth(i);

// //       const rowText =
// //         normalizeForMatch(
// //           await row.innerText()
// //         );

// //       if (
// //         targetTenderId &&
// //         rowText.includes(
// //           targetTenderId
// //         )
// //       ) {
// //         const href =
// //           await findDetailLink(
// //             row
// //           );

// //         if (href) {
// //           return {
// //             found: true,
// //             href,
// //           };
// //         }
// //       }
// //     } catch (error) {
// //       console.error(
// //         `Failed while checking Tender ID row ${
// //           i + 1
// //         }:`,
// //         error
// //       );
// //     }
// //   }

// //   // ----------------------------------------------------------
// //   // Second try title only
// //   // ----------------------------------------------------------

// //   for (
// //     let i = 0;
// //     i < rowCount;
// //     i++
// //   ) {
// //     try {
// //       const row =
// //         rows.nth(i);

// //       const rowText =
// //         normalizeForMatch(
// //           await row.innerText()
// //         );

// //       if (
// //         !targetTitle ||
// //         !rowText.includes(
// //           targetTitle
// //         )
// //       ) {
// //         continue;
// //       }

// //       const href =
// //         await findDetailLink(
// //           row
// //         );

// //       if (href) {
// //         return {
// //           found: true,
// //           href,
// //         };
// //       }
// //     } catch (error) {
// //       console.error(
// //         `Failed while checking tender row ${
// //           i + 1
// //         }:`,
// //         error
// //       );
// //     }
// //   }

// //   return {
// //     found: false,
// //     href: null,
// //   };
// // }

// // // ============================================================
// // // INSPECT TENDER DETAILS
// // // ============================================================
// // //
// // // This is the most important part.
// // //
// // // Detail page is the SOURCE OF TRUTH for:
// // //
// // // - Tender Reference Number
// // // - Tender ID
// // // - Organisation Chain
// // // - Closing Date
// // // - Bid Opening Date
// // //
// // // ============================================================

// // export async function inspectTenderDetails(
// //   page: Page,
// //   tenders: ParsedTender[]
// // ): Promise<ParsedTender[]> {
// //   const enrichedTenders:
// //     ParsedTender[] = [];

// //   console.log(
// //     `Inspecting ${tenders.length} tender detail page(s)...`
// //   );

// //   for (
// //     const tender of tenders
// //   ) {
// //     let detailPage:
// //       Page | null = null;

// //     try {
// //       // ======================================================
// //       // FIND DETAIL URL
// //       // ======================================================

// //       let detailHref =
// //         tender.detailHref;

// //       if (!detailHref) {
// //         const rowResult =
// //           await findExactTenderRow(
// //             page,
// //             tender
// //           );

// //         if (
// //           rowResult.found
// //         ) {
// //           detailHref =
// //             rowResult.href;
// //         }
// //       }

// //       if (!detailHref) {
// //         console.warn(
// //           `No detail URL found for: ${tender.title}`
// //         );

// //         enrichedTenders.push(
// //           tender
// //         );

// //         continue;
// //       }

// //       // ======================================================
// //       // CREATE DETAIL PAGE
// //       // ======================================================

// //       detailPage =
// //         await page
// //           .context()
// //           .newPage();

// //       let absoluteUrl =
// //         detailHref;

// //       if (
// //         !detailHref.startsWith(
// //           "http://"
// //         ) &&
// //         !detailHref.startsWith(
// //           "https://"
// //         )
// //       ) {
// //         absoluteUrl =
// //           new URL(
// //             detailHref,
// //             page.url()
// //           ).toString();
// //       }

// //       console.log(
// //         `Opening detail URL: ${absoluteUrl}`
// //       );

// //       // ======================================================
// //       // OPEN DETAIL PAGE
// //       // ======================================================

// //       try {
// //         await detailPage.goto(
// //           absoluteUrl,
// //           {
// //             waitUntil:
// //               "domcontentloaded",

// //             timeout: 30000,
// //           }
// //         );
// //       } catch (navigationError) {
// //         console.warn(
// //           `Detail page navigation warning for ${tender.title}:`,
// //           navigationError
// //         );
// //       }

// //       await detailPage.waitForTimeout(
// //         500
// //       );

// //       // ======================================================
// //       // READ PAGE TEXT
// //       // ======================================================

// //       const detailText =
// //         await detailPage
// //           .locator("body")
// //           .innerText();

// //       // ======================================================
// //       // EXTRACT DETAILS
// //       // ======================================================

// //       const details =
// //         extractDetailData(
// //           detailText
// //         );

// //       console.log(
// //         "----------------------------------------"
// //       );

// //       console.log(
// //         `Tender Title: ${tender.title}`
// //       );

// //       console.log(
// //         `Reference: ${
// //           details.tenderNumber ||
// //           "Not found"
// //         }`
// //       );

// //       console.log(
// //         `Tender ID: ${
// //           details.tenderId ||
// //           "Not found"
// //         }`
// //       );

// //       console.log(
// //         `Organisation: ${
// //           details.organisationChain ||
// //           "Not found"
// //         }`
// //       );

// //       console.log(
// //         `Closing Date: ${
// //           details.closingDate ||
// //           "Not found"
// //         }`
// //       );

// //       console.log(
// //         `Bid Opening Date: ${
// //           details.bidOpeningDate ||
// //           "Not found"
// //         }`
// //       );

// //       console.log(
// //         "----------------------------------------"
// //       );

// //       // ======================================================
// //       // MERGE
// //       // ======================================================
// //       //
// //       // Detail page values have highest priority.
// //       //
// //       // ======================================================

// //       enrichedTenders.push({
// //         ...tender,

// //         tenderNumber:
// //           details.tenderNumber ||
// //           tender.tenderNumber,

// //         tenderId:
// //           details.tenderId ||
// //           tender.tenderId,

// //         organisationChain:
// //           details.organisationChain ||
// //           tender.organisationChain,

// //         closingDate:
// //           details.closingDate ||
// //           tender.closingDate,

// //         bidOpeningDate:
// //           details.bidOpeningDate ||
// //           tender.bidOpeningDate,

// //         detailHref,

// //         sourceUrl:
// //           detailHref,
// //       });
// //     } catch (error) {
// //       console.error(
// //         `Failed to inspect tender detail: ${tender.title}`,
// //         error
// //       );

// //       // Keep original data

// //       enrichedTenders.push(
// //         tender
// //       );
// //     } finally {
// //       // ======================================================
// //       // ALWAYS CLOSE DETAIL PAGE
// //       // ======================================================

// //       if (detailPage) {
// //         try {
// //           await detailPage.close();
// //         } catch (closeError) {
// //           console.error(
// //             "Failed to close detail page:",
// //             closeError
// //           );
// //         }
// //       }
// //     }
// //   }

// //   console.log(
// //     `Tender detail inspection completed. Enriched ${enrichedTenders.length} tender(s).`
// //   );

// //   return enrichedTenders;
// // }


// import type { Locator, Page } from "playwright";

// // ============================================================
// // TYPES
// // ============================================================

// export type ParsedTender = {
//   title: string;
//   tenderNumber: string;
//   closingDate: string | null;
//   bidOpeningDate: string | null;
//   sourceUrl: string | null;
//   detailHref: string | null;
//   isCorrigendum: boolean;
//   tenderId: string | null;
//   organisationChain: string | null;
// };

// export type TenderDetailData = {
//   tenderNumber: string;
//   tenderId: string | null;
//   organisationChain: string | null;
//   closingDate: string | null;
//   bidOpeningDate: string | null;
// };

// // ============================================================
// // CONSTANTS
// // ============================================================

// const PORTAL_HOME_URL =
//   "https://tendersodisha.gov.in/";

// const PORTAL_DATE_PATTERN =
//   "\\d{1,2}-[A-Za-z]{3}-\\d{4}\\s+\\d{1,2}:\\d{2}\\s*(?:AM|PM)";

// const TENDER_ID_PATTERN =
//   /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/;

// // ============================================================
// // BASIC HELPERS
// // ============================================================

// function cleanText(
//   value: string | null | undefined
// ): string {
//   return (value ?? "")
//     .replace(/\u00a0/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function cleanTitle(
//   value: string | null | undefined
// ): string {
//   return cleanText(value)
//     .replace(/^\d+\s*[.\-:]?\s*/, "")
//     .trim();
// }

// function normalizeForMatch(
//   value: string | null | undefined
// ): string {
//   return cleanText(value).toLowerCase();
// }

// function cleanTenderId(
//   value: string
// ): string | null {
//   const text = cleanText(value);

//   const match =
//     text.match(TENDER_ID_PATTERN);

//   return match
//     ? match[1]
//     : null;
// }

// // ============================================================
// // DATE EXTRACTION
// // ============================================================

// function extractDateAfterLabel(
//   text: string,
//   label: string
// ): string | null {
//   const pattern = new RegExp(
//     `${label}\\s+(${PORTAL_DATE_PATTERN})`,
//     "i"
//   );

//   const match =
//     text.match(pattern);

//   return match
//     ? cleanText(match[1])
//     : null;
// }

// function extractBidOpeningDate(
//   text: string
// ): string | null {
//   return extractDateAfterLabel(
//     text,
//     "Bid Opening Date"
//   );
// }

// function extractClosingDateFromDetail(
//   text: string
// ): string | null {
//   return extractDateAfterLabel(
//     text,
//     "Bid Submission End Date"
//   );
// }

// // ============================================================
// // DETAIL PAGE EXTRACTION
// // ============================================================

// function extractOrganisationChain(
//   text: string
// ): string | null {
//   const match = text.match(
//     /Organisation Chain\s+(.+?)(?=\s+Tender Reference Number|\s+Tender ID|\s+Tender Type|\s+Form Of Contract|$)/i
//   );

//   if (!match) {
//     return null;
//   }

//   const organisation =
//     cleanText(match[1]);

//   return organisation || null;
// }

// function extractTenderIdFromDetail(
//   text: string
// ): string | null {
//   const match = text.match(
//     /Tender ID\s+(\d{4}_[A-Za-z0-9]+_\d+_\d+)/i
//   );

//   if (match) {
//     return match[1];
//   }

//   return cleanTenderId(text);
// }

// function extractTenderReferenceNumber(
//   text: string
// ): string | null {
//   const match = text.match(
//     /Tender Reference Number\s+(.+?)(?=\s+Tender ID|\s+Tender Type|\s+Form Of Contract|\s+No\. of Covers|\s+Payment Mode|\s+Is Multi Currency Allowed|$)/i
//   );

//   if (!match) {
//     return null;
//   }

//   const reference =
//     cleanText(match[1]);

//   return reference || null;
// }

// // ============================================================
// // EXTRACT DETAIL DATA
// // ============================================================

// export function extractDetailData(
//   text: string
// ): TenderDetailData {
//   const cleanPageText =
//     cleanText(text);

//   return {
//     tenderNumber:
//       extractTenderReferenceNumber(
//         cleanPageText
//       ) ?? "",

//     tenderId:
//       extractTenderIdFromDetail(
//         cleanPageText
//       ),

//     organisationChain:
//       extractOrganisationChain(
//         cleanPageText
//       ),

//     closingDate:
//       extractClosingDateFromDetail(
//         cleanPageText
//       ),

//     bidOpeningDate:
//       extractBidOpeningDate(
//         cleanPageText
//       ),
//   };
// }

// // ============================================================
// // FIND TABLE HEADERS
// // ============================================================

// async function getTableHeaders(
//   table: Locator
// ): Promise<string[]> {
//   const headers: string[] = [];

//   // ----------------------------------------------------------
//   // 1. Try THEAD
//   // ----------------------------------------------------------

//   const theadRows =
//     table.locator("thead tr");

//   const theadRowCount =
//     await theadRows.count();

//   for (
//     let rowIndex = 0;
//     rowIndex < theadRowCount;
//     rowIndex++
//   ) {
//     const row =
//       theadRows.nth(rowIndex);

//     const cells =
//       row.locator("th, td");

//     const cellCount =
//       await cells.count();

//     const currentHeaders: string[] =
//       [];

//     for (
//       let cellIndex = 0;
//       cellIndex < cellCount;
//       cellIndex++
//     ) {
//       currentHeaders.push(
//         cleanText(
//           await cells
//             .nth(cellIndex)
//             .innerText()
//         )
//       );
//     }

//     const combined =
//       currentHeaders
//         .join(" ")
//         .toLowerCase();

//     if (
//       combined.includes(
//         "tender title"
//       ) ||
//       combined.includes(
//         "corrigendum title"
//       ) ||
//       combined.includes(
//         "reference no"
//       )
//     ) {
//       return currentHeaders;
//     }
//   }

//   // ----------------------------------------------------------
//   // 2. Search normal TR rows
//   // ----------------------------------------------------------

//   const rows =
//     table.locator("tr");

//   const rowCount =
//     await rows.count();

//   for (
//     let rowIndex = 0;
//     rowIndex < rowCount;
//     rowIndex++
//   ) {
//     const row =
//       rows.nth(rowIndex);

//     const cells =
//       row.locator("th, td");

//     const cellCount =
//       await cells.count();

//     if (cellCount === 0) {
//       continue;
//     }

//     const possibleHeaders: string[] =
//       [];

//     for (
//       let cellIndex = 0;
//       cellIndex < cellCount;
//       cellIndex++
//     ) {
//       possibleHeaders.push(
//         cleanText(
//           await cells
//             .nth(cellIndex)
//             .innerText()
//         )
//       );
//     }

//     const combined =
//       possibleHeaders
//         .join(" ")
//         .toLowerCase();

//     if (
//       combined.includes(
//         "tender title"
//       ) ||
//       combined.includes(
//         "corrigendum title"
//       ) ||
//       combined.includes(
//         "reference no"
//       )
//     ) {
//       return possibleHeaders;
//     }
//   }

//   return headers;
// }

// // ============================================================
// // FIND HEADER INDEX
// // ============================================================

// function findHeaderIndex(
//   headers: string[],
//   keywords: string[]
// ): number {
//   const normalized =
//     headers.map((header) =>
//       normalizeForMatch(header)
//     );

//   return normalized.findIndex(
//     (header) =>
//       keywords.some((keyword) =>
//         header.includes(keyword)
//       )
//   );
// }

// // ============================================================
// // FIND DETAIL LINK FROM ROW
// // ============================================================

// async function findDetailLink(
//   row: Locator
// ): Promise<string | null> {
//   const links =
//     row.locator("a[href]");

//   const linkCount =
//     await links.count();

//   if (linkCount === 0) {
//     return null;
//   }

//   // ----------------------------------------------------------
//   // First priority:
//   // links that look like tender/detail links
//   // ----------------------------------------------------------

//   for (
//     let i = 0;
//     i < linkCount;
//     i++
//   ) {
//     const link =
//       links.nth(i);

//     const href =
//       await link.getAttribute(
//         "href"
//       );

//     if (!href) {
//       continue;
//     }

//     const text =
//       cleanText(
//         await link.innerText()
//       );

//     const lowerHref =
//       href.toLowerCase();

//     const lowerText =
//       text.toLowerCase();

//     // Ignore javascript links
//     if (
//       lowerHref.startsWith(
//         "javascript:"
//       )
//     ) {
//       continue;
//     }

//     // Prefer detail-like links
//     if (
//       lowerHref.includes(
//         "tender"
//       ) ||
//       lowerHref.includes(
//         "view"
//       ) ||
//       lowerHref.includes(
//         "direct"
//       ) ||
//       lowerText.includes(
//         "view"
//       )
//     ) {
//       return href;
//     }
//   }

//   // ----------------------------------------------------------
//   // Fallback:
//   // first valid href
//   // ----------------------------------------------------------

//   for (
//     let i = 0;
//     i < linkCount;
//     i++
//   ) {
//     const href =
//       await links
//         .nth(i)
//         .getAttribute(
//           "href"
//         );

//     if (
//       href &&
//       !href
//         .toLowerCase()
//         .startsWith(
//           "javascript:"
//         )
//     ) {
//       return href;
//     }
//   }

//   return null;
// }

// // ============================================================
// // FIND TITLE FROM ROW
// // ============================================================

// async function findTitleFromRow(
//   row: Locator,
//   cellTexts: string[]
// ): Promise<string> {

//   // ----------------------------------------------------------
//   // First priority:
//   // useful link text
//   // ----------------------------------------------------------

//   const links =
//     row.locator("a[href]");

//   const linkCount =
//     await links.count();

//   for (
//     let linkIndex = 0;
//     linkIndex < linkCount;
//     linkIndex++
//   ) {
//     const link =
//       links.nth(linkIndex);

//     const linkText =
//       cleanText(
//         await link.innerText()
//       );

//     if (
//       !linkText ||
//       linkText.length <= 5
//     ) {
//       continue;
//     }

//     // Ignore generic buttons
//     if (
//       /^view$/i.test(linkText) ||
//       /^details?$/i.test(
//         linkText
//       ) ||
//       /^click here$/i.test(
//         linkText
//       )
//     ) {
//       continue;
//     }

//     const title =
//       cleanTitle(linkText);

//     if (title) {
//       return title;
//     }
//   }

//   // ----------------------------------------------------------
//   // Second priority:
//   // first useful cell
//   // ----------------------------------------------------------

//   for (
//     const cellText of cellTexts
//   ) {
//     if (!cellText) {
//       continue;
//     }

//     // Ignore simple numbers
//     if (/^\d+$/.test(cellText)) {
//       continue;
//     }

//     // Ignore dates
//     if (
//       new RegExp(
//         `^${PORTAL_DATE_PATTERN}$`,
//         "i"
//       ).test(cellText)
//     ) {
//       continue;
//     }

//     const title =
//       cleanTitle(cellText);

//     if (title) {
//       return title;
//     }
//   }

//   return "";
// }

// // ============================================================
// // PARSE PUBLIC TABLE
// // ============================================================
// //
// // IMPORTANT:
// //
// // Homepage table is NOT treated as the source of truth.
// //
// // We only use it to find:
// //
// // 1. Tender title
// // 2. Detail page URL
// // 3. Optional Tender ID
// //
// // Reference number and dates are obtained from the
// // tender detail page by inspectTenderDetails().
// //
// // ============================================================

// async function parseTable(
//   page: Page,
//   tableSelector: string,
//   isCorrigendum: boolean
// ): Promise<ParsedTender[]> {

//   console.log(
//     `Looking for table: ${tableSelector}`
//   );

//   const tableLocator =
//     page.locator(tableSelector);

//   const tableCount =
//     await tableLocator.count();

//   console.log(
//     `Found ${tableCount} table(s) for selector: ${tableSelector}`
//   );

//   if (tableCount === 0) {
//     return [];
//   }

//   const results: ParsedTender[] =
//     [];

//   for (
//     let tableIndex = 0;
//     tableIndex < tableCount;
//     tableIndex++
//   ) {
//     try {
//       const table =
//         tableLocator.nth(
//           tableIndex
//         );

//       let rows =
//         table.locator(
//           "tbody tr"
//         );

//       let rowCount =
//         await rows.count();

//       if (rowCount === 0) {
//         rows =
//           table.locator("tr");

//         rowCount =
//           await rows.count();
//       }

//       console.log(
//         `Table ${tableIndex + 1}: ${rowCount} row(s)`
//       );

//       for (
//         let rowIndex = 0;
//         rowIndex < rowCount;
//         rowIndex++
//       ) {
//         try {
//           const row =
//             rows.nth(rowIndex);

//           const cells =
//             row.locator("td");

//           const cellCount =
//             await cells.count();

//           if (cellCount === 0) {
//             continue;
//           }

//           // --------------------------------------------------
//           // Read cells
//           // --------------------------------------------------

//           const cellTexts: string[] =
//             [];

//           for (
//             let cellIndex = 0;
//             cellIndex < cellCount;
//             cellIndex++
//           ) {
//             const text =
//               await cells
//                 .nth(cellIndex)
//                 .innerText();

//             cellTexts.push(
//               cleanText(text)
//             );
//           }

//           const rowText =
//             cellTexts.join(" ");

//           if (!rowText) {
//             continue;
//           }

//           const lowerRowText =
//             rowText.toLowerCase();

//           // --------------------------------------------------
//           // Skip header rows
//           // --------------------------------------------------

//           if (
//             lowerRowText.includes(
//               "tender title"
//             ) ||
//             lowerRowText.includes(
//               "corrigendum title"
//             ) ||
//             lowerRowText.includes(
//               "reference no"
//             )
//           ) {
//             continue;
//           }

//           // --------------------------------------------------
//           // Find title
//           // --------------------------------------------------

//           const title =
//             await findTitleFromRow(
//               row,
//               cellTexts
//             );

//           if (!title) {
//             console.warn(
//               `Skipping row ${
//                 rowIndex + 1
//               }: title not found`
//             );

//             continue;
//           }

//           // --------------------------------------------------
//           // Find detail link
//           // --------------------------------------------------

//           const detailHref =
//             await findDetailLink(
//               row
//             );

//           if (!detailHref) {
//             console.warn(
//               `No detail link found for: ${title}`
//             );
//           }

//           // --------------------------------------------------
//           // Optional Tender ID
//           // --------------------------------------------------

//           const tenderIdMatch =
//             rowText.match(
//               TENDER_ID_PATTERN
//             );

//           const tenderId =
//             tenderIdMatch
//               ? tenderIdMatch[1]
//               : null;

//           // --------------------------------------------------
//           // Do NOT read reference/date values from homepage.
//           // --------------------------------------------------

//           console.log(
//             "Parsed table row:",
//             {
//               rowIndex:
//                 rowIndex + 1,
//               title,
//               detailHref,
//               tenderId,
//             }
//           );

//           results.push({
//             title,
//             tenderNumber: "",
//             closingDate: null,
//             bidOpeningDate: null,
//             sourceUrl:
//               detailHref,
//             detailHref,
//             isCorrigendum,
//             tenderId,
//             organisationChain:
//               null,
//           });

//         } catch (rowError) {
//           console.error(
//             `Failed to parse row ${
//               rowIndex + 1
//             } in table ${
//               tableIndex + 1
//             }:`,
//             rowError
//           );
//         }
//       }

//     } catch (tableError) {
//       console.error(
//         `Failed to parse table ${
//           tableIndex + 1
//         }:`,
//         tableError
//       );
//     }
//   }

//   console.log(
//     `Finished parsing ${tableSelector}. Total results: ${results.length}`
//   );

//   return results;
// }

// // ============================================================
// // WAIT FOR ACTIVE TENDER TABLE
// // ============================================================

// export async function waitForActiveTenderTable(
//   page: Page
// ): Promise<void> {

//   console.log(
//     "Waiting for tender table..."
//   );

//   await page.waitForSelector(
//     "#activeTenders, table.list_table",
//     {
//       state: "attached",
//       timeout: 45000,
//     }
//   );

//   console.log(
//     "Tender table detected."
//   );
// }

// // ============================================================
// // PARSE LATEST TENDERS
// // ============================================================

// export async function parseLatestTenders(
//   page: Page
// ): Promise<ParsedTender[]> {

//   console.log(
//     "Opening Odisha Tender Portal homepage..."
//   );

//   try {
//     await page.goto(
//       PORTAL_HOME_URL,
//       {
//         waitUntil: "commit",
//         timeout: 30000,
//       }
//     );
//   } catch (navigationError) {
//     console.warn(
//       "Initial portal navigation warning:",
//       navigationError
//     );
//   }

//   console.log(
//     `Current URL after navigation: ${page.url()}`
//   );

//   // Give portal time to finish loading
//   await page.waitForTimeout(
//     5000
//   );

//   console.log(
//     `URL after waiting: ${page.url()}`
//   );

//   await waitForActiveTenderTable(
//     page
//   );

//   console.log(
//     "Tender table found."
//   );

//   // ----------------------------------------------------------
//   // PRIMARY TABLE
//   // ----------------------------------------------------------

//   if (
//     await page
//       .locator(
//         "#activeTenders"
//       )
//       .count() > 0
//   ) {

//     console.log(
//       "Parsing #activeTenders table..."
//     );

//     const results =
//       await parseTable(
//         page,
//         "#activeTenders",
//         false
//       );

//     if (
//       results.length > 0
//     ) {

//       console.log(
//         `Parsed ${results.length} tenders from #activeTenders.`
//       );

//       // IMPORTANT:
//       // Open detail pages and enrich tender information.
//       console.log(
//         "Starting tender detail inspection..."
//       );

//       const enrichedResults =
//         await inspectTenderDetails(
//           page,
//           results
//         );

//       console.log(
//         `Detail inspection completed: ${enrichedResults.length} tenders`
//       );

//       return enrichedResults;
//     }
//   }

//   // ----------------------------------------------------------
//   // FALLBACK
//   // ----------------------------------------------------------

//   console.log(
//     "Using table.list_table fallback..."
//   );

//   const fallbackResults =
//     await parseTable(
//       page,
//       "table.list_table",
//       false
//     );

//   console.log(
//     `Parsed ${fallbackResults.length} tenders from fallback table.`
//   );

//   if (
//     fallbackResults.length === 0
//   ) {
//     return [];
//   }

//   // IMPORTANT:
//   // Also inspect fallback tender detail pages.
//   console.log(
//     "Starting tender detail inspection for fallback results..."
//   );

//   const enrichedResults =
//     await inspectTenderDetails(
//       page,
//       fallbackResults
//     );

//   console.log(
//     `Detail inspection completed: ${enrichedResults.length} tenders`
//   );

//   return enrichedResults;
// }

// // ============================================================
// // PARSE LATEST CORRIGENDA
// // ============================================================
// //
// // IMPORTANT:
// //
// // Corrigendum homepage rows can contain:
// //
// // - duplicate rows
// // - "More..." navigation links
// // - rows without useful detail links
// //
// // Therefore this function filters and deduplicates them.
// //
// // ============================================================

// export async function parseLatestCorrigenda(
//   page: Page
// ): Promise<ParsedTender[]> {

//   const tables =
//     page.locator(
//       "table.list_table"
//     );

//   const tableCount =
//     await tables.count();

//   const results: ParsedTender[] =
//     [];

//   console.log(
//     `Searching ${tableCount} table(s) for corrigenda...`
//   );

//   for (
//     let tableIndex = 0;
//     tableIndex < tableCount;
//     tableIndex++
//   ) {

//     try {
//       const table =
//         tables.nth(
//           tableIndex
//         );

//       const tableText =
//         normalizeForMatch(
//           await table.innerText()
//         );

//       // Only process tables containing corrigendum data
//       if (
//         !tableText.includes(
//           "corrigendum"
//         )
//       ) {
//         continue;
//       }

//       console.log(
//         `Parsing corrigendum table ${
//           tableIndex + 1
//         }...`
//       );

//       // ------------------------------------------------------
//       // Rows
//       // ------------------------------------------------------

//       let rows =
//         table.locator(
//           "tbody tr"
//         );

//       let rowCount =
//         await rows.count();

//       if (rowCount === 0) {
//         rows =
//           table.locator("tr");

//         rowCount =
//           await rows.count();
//       }

//       for (
//         let rowIndex = 0;
//         rowIndex < rowCount;
//         rowIndex++
//       ) {

//         try {
//           const row =
//             rows.nth(
//               rowIndex
//             );

//           const cells =
//             row.locator("td");

//           const cellCount =
//             await cells.count();

//           if (cellCount === 0) {
//             continue;
//           }

//           // --------------------------------------------------
//           // Read cells
//           // --------------------------------------------------

//           const cellTexts: string[] =
//             [];

//           for (
//             let cellIndex = 0;
//             cellIndex < cellCount;
//             cellIndex++
//           ) {
//             cellTexts.push(
//               cleanText(
//                 await cells
//                   .nth(
//                     cellIndex
//                   )
//                   .innerText()
//               )
//             );
//           }

//           const rowText =
//             cellTexts.join(" ");

//           if (!rowText) {
//             continue;
//           }

//           const lowerRowText =
//             rowText.toLowerCase();

//           // --------------------------------------------------
//           // Skip header
//           // --------------------------------------------------

//           if (
//             lowerRowText.includes(
//               "corrigendum title"
//             ) ||
//             lowerRowText.includes(
//               "reference no"
//             )
//           ) {
//             continue;
//           }

//           // --------------------------------------------------
//           // TITLE
//           // --------------------------------------------------

//           const title =
//             await findTitleFromRow(
//               row,
//               cellTexts
//             );

//           if (!title) {
//             console.warn(
//               `Skipping corrigendum row ${
//                 rowIndex + 1
//               }: title not found`
//             );

//             continue;
//           }

//           // --------------------------------------------------
//           // SKIP "MORE..." NAVIGATION ROW
//           // --------------------------------------------------

//           if (
//             /^more\.{0,3}$/i.test(
//               title
//             )
//           ) {
//             console.log(
//               "Skipping More... navigation row"
//             );

//             continue;
//           }

//           // --------------------------------------------------
//           // FIND DETAIL LINK
//           // --------------------------------------------------

//           const detailHref =
//             await findDetailLink(
//               row
//             );

//           if (!detailHref) {
//             console.warn(
//               `Skipping corrigendum without detail link: ${title}`
//             );

//             continue;
//           }

//           // --------------------------------------------------
//           // OPTIONAL TENDER ID
//           // --------------------------------------------------

//           const tenderIdMatch =
//             rowText.match(
//               TENDER_ID_PATTERN
//             );

//           const tenderId =
//             tenderIdMatch
//               ? tenderIdMatch[1]
//               : null;

//           // --------------------------------------------------
//           // DUPLICATE CHECK
//           // --------------------------------------------------

//           const normalizedTitle =
//             normalizeForMatch(
//               title
//             );

//           const duplicate =
//             results.some(
//               (existing) => {

//                 // Same detail URL
//                 if (
//                   existing.detailHref ===
//                   detailHref
//                 ) {
//                   return true;
//                 }

//                 // Same title + same Tender ID
//                 if (
//                   normalizeForMatch(
//                     existing.title
//                   ) ===
//                     normalizedTitle &&
//                   existing.tenderId ===
//                     tenderId
//                 ) {
//                   return true;
//                 }

//                 // If both have no Tender ID,
//                 // same title is enough to avoid
//                 // obvious homepage duplicates.
//                 if (
//                   !existing.tenderId &&
//                   !tenderId &&
//                   normalizeForMatch(
//                     existing.title
//                   ) ===
//                     normalizedTitle
//                 ) {
//                   return true;
//                 }

//                 return false;
//               }
//             );

//           if (duplicate) {
//             console.log(
//               `Skipping duplicate corrigendum: ${title}`
//             );

//             continue;
//           }

//           // --------------------------------------------------
//           // SAVE VALID CORRIGENDUM
//           // --------------------------------------------------

//           const corrigendum: ParsedTender =
//             {
//               title,
//               tenderNumber: "",
//               closingDate: null,
//               bidOpeningDate: null,
//               sourceUrl:
//                 detailHref,
//               detailHref,
//               isCorrigendum: true,
//               tenderId,
//               organisationChain:
//                 null,
//             };

//           results.push(
//             corrigendum
//           );

//           console.log(
//             "Parsed corrigendum row:",
//             {
//               rowIndex:
//                 rowIndex + 1,
//               title,
//               detailHref,
//               tenderId,
//             }
//           );

//         } catch (rowError) {
//           console.error(
//             `Failed to parse corrigendum row ${
//               rowIndex + 1
//             }:`,
//             rowError
//           );
//         }
//       }

//     } catch (tableError) {
//       console.error(
//         `Failed to parse corrigendum table ${
//           tableIndex + 1
//         }:`,
//         tableError
//       );
//     }
//   }

//   console.log(
//     `Total valid corrigenda parsed: ${results.length}`
//   );

//   if (
//     results.length === 0
//   ) {
//     return [];
//   }

//   // IMPORTANT:
//   // Inspect corrigendum detail pages too.
//   console.log(
//     "Starting corrigendum detail inspection..."
//   );

//   const enrichedResults =
//     await inspectTenderDetails(
//       page,
//       results
//     );

//   console.log(
//     `Corrigendum detail inspection completed: ${enrichedResults.length} corrigenda`
//   );

//   return enrichedResults;
// }

// // ============================================================
// // FIND EXACT TENDER ROW
// // ============================================================

// export async function findExactTenderRow(
//   page: Page,
//   tender: ParsedTender
// ): Promise<{
//   found: boolean;
//   href: string | null;
// }> {

//   const rows =
//     page.locator(
//       "#activeTenders tr, table.list_table tr"
//     );

//   const rowCount =
//     await rows.count();

//   const targetTitle =
//     normalizeForMatch(
//       tender.title
//     );

//   // ----------------------------------------------------------
//   // First try Tender ID
//   // ----------------------------------------------------------

//   const targetTenderId =
//     normalizeForMatch(
//       tender.tenderId
//     );

//   for (
//     let i = 0;
//     i < rowCount;
//     i++
//   ) {

//     try {
//       const row =
//         rows.nth(i);

//       const rowText =
//         normalizeForMatch(
//           await row.innerText()
//         );

//       if (
//         targetTenderId &&
//         rowText.includes(
//           targetTenderId
//         )
//       ) {

//         const href =
//           await findDetailLink(
//             row
//           );

//         if (href) {
//           return {
//             found: true,
//             href,
//           };
//         }
//       }

//     } catch (error) {
//       console.error(
//         `Failed while checking Tender ID row ${
//           i + 1
//         }:`,
//         error
//       );
//     }
//   }

//   // ----------------------------------------------------------
//   // Second try title only
//   // ----------------------------------------------------------

//   for (
//     let i = 0;
//     i < rowCount;
//     i++
//   ) {

//     try {
//       const row =
//         rows.nth(i);

//       const rowText =
//         normalizeForMatch(
//           await row.innerText()
//         );

//       if (
//         !targetTitle ||
//         !rowText.includes(
//           targetTitle
//         )
//       ) {
//         continue;
//       }

//       const href =
//         await findDetailLink(
//           row
//         );

//       if (href) {
//         return {
//           found: true,
//           href,
//         };
//       }

//     } catch (error) {
//       console.error(
//         `Failed while checking tender row ${
//           i + 1
//         }:`,
//         error
//       );
//     }
//   }

//   return {
//     found: false,
//     href: null,
//   };
// }

// // ============================================================
// // INSPECT TENDER DETAILS
// // ============================================================
// //
// // This is the most important part.
// //
// // Detail page is the SOURCE OF TRUTH for:
// //
// // - Tender Reference Number
// // - Tender ID
// // - Organisation Chain
// // - Closing Date
// // - Bid Opening Date
// //
// // ============================================================

// export async function inspectTenderDetails(
//   page: Page,
//   tenders: ParsedTender[]
// ): Promise<ParsedTender[]> {

//   const enrichedTenders:
//     ParsedTender[] = [];

//   console.log(
//     `Inspecting ${tenders.length} tender detail page(s)...`
//   );

//   for (
//     const tender of tenders
//   ) {

//     let detailPage:
//       Page | null = null;

//     try {

//       // ======================================================
//       // FIND DETAIL URL
//       // ======================================================

//       let detailHref =
//         tender.detailHref;

//       if (!detailHref) {

//         const rowResult =
//           await findExactTenderRow(
//             page,
//             tender
//           );

//         if (
//           rowResult.found
//         ) {
//           detailHref =
//             rowResult.href;
//         }
//       }

//       if (!detailHref) {

//         console.warn(
//           `No detail URL found for: ${tender.title}`
//         );

//         enrichedTenders.push(
//           tender
//         );

//         continue;
//       }

//       // ======================================================
//       // CREATE DETAIL PAGE
//       // ======================================================

//       detailPage =
//         await page
//           .context()
//           .newPage();

//       let absoluteUrl =
//         detailHref;

//       if (
//         !detailHref.startsWith(
//           "http://"
//         ) &&
//         !detailHref.startsWith(
//           "https://"
//         )
//       ) {

//         absoluteUrl =
//           new URL(
//             detailHref,
//             page.url()
//           ).toString();
//       }

//       console.log(
//         `Opening detail URL: ${absoluteUrl}`
//       );

//       // ======================================================
//       // OPEN DETAIL PAGE
//       // ======================================================

//       try {

//         await detailPage.goto(
//           absoluteUrl,
//           {
//             waitUntil:
//               "domcontentloaded",
//             timeout: 30000,
//           }
//         );

//       } catch (navigationError) {

//         console.warn(
//           `Detail page navigation warning for ${tender.title}:`,
//           navigationError
//         );
//       }

//       await detailPage.waitForTimeout(
//         500
//       );

//       // ======================================================
//       // READ PAGE TEXT
//       // ======================================================

//       const detailText =
//         await detailPage
//           .locator("body")
//           .innerText();

//       // ======================================================
//       // EXTRACT DETAILS
//       // ======================================================

//       const details =
//         extractDetailData(
//           detailText
//         );

//       console.log(
//         "----------------------------------------"
//       );

//       console.log(
//         `Tender Title: ${tender.title}`
//       );

//       console.log(
//         `Reference: ${
//           details.tenderNumber ||
//           "Not found"
//         }`
//       );

//       console.log(
//         `Tender ID: ${
//           details.tenderId ||
//           "Not found"
//         }`
//       );

//       console.log(
//         `Organisation: ${
//           details.organisationChain ||
//           "Not found"
//         }`
//       );

//       console.log(
//         `Closing Date: ${
//           details.closingDate ||
//           "Not found"
//         }`
//       );

//       console.log(
//         `Bid Opening Date: ${
//           details.bidOpeningDate ||
//           "Not found"
//         }`
//       );

//       console.log(
//         "----------------------------------------"
//       );

//       // ======================================================
//       // MERGE
//       // ======================================================

//       enrichedTenders.push({
//         ...tender,

//         tenderNumber:
//           details.tenderNumber ||
//           tender.tenderNumber,

//         tenderId:
//           details.tenderId ||
//           tender.tenderId,

//         organisationChain:
//           details.organisationChain ||
//           tender.organisationChain,

//         closingDate:
//           details.closingDate ||
//           tender.closingDate,

//         bidOpeningDate:
//           details.bidOpeningDate ||
//           tender.bidOpeningDate,

//         detailHref,

//         sourceUrl:
//           detailHref,
//       });

//     } catch (error) {

//       console.error(
//         `Failed to inspect tender detail: ${tender.title}`,
//         error
//       );

//       // Keep original data
//       enrichedTenders.push(
//         tender
//       );

//     } finally {

//       // ======================================================
//       // ALWAYS CLOSE DETAIL PAGE
//       // ======================================================

//       if (detailPage) {

//         try {
//           await detailPage.close();

//         } catch (closeError) {

//           console.error(
//             "Failed to close detail page:",
//             closeError
//           );
//         }
//       }
//     }
//   }

//   console.log(
//     `Tender detail inspection completed. Enriched ${enrichedTenders.length} tender(s).`
//   );

//   return enrichedTenders;
// }


import type { Locator, Page } from "playwright";

// ============================================================
// TYPES
// ============================================================

export type ParsedTender = {
  title: string;
  tenderNumber: string;
  closingDate: string | null;
  bidOpeningDate: string | null;
  sourceUrl: string | null;
  detailHref: string | null;
  isCorrigendum: boolean;
  tenderId: string | null;
  organisationChain: string | null;
};

export type TenderDetailData = {
  tenderNumber: string;
  tenderId: string | null;
  organisationChain: string | null;
  closingDate: string | null;
  bidOpeningDate: string | null;
};

// ============================================================
// CONSTANTS
// ============================================================

const PORTAL_HOME_URL =
  "https://tendersodisha.gov.in/";

const PORTAL_DATE_PATTERN =
  "\\d{1,2}-[A-Za-z]{3}-\\d{4}\\s+\\d{1,2}:\\d{2}\\s*(?:AM|PM)";

const TENDER_ID_PATTERN =
  /\b(\d{4}_[A-Za-z0-9]+_\d+_\d+)\b/;

// ============================================================
// BASIC HELPERS
// ============================================================

function cleanText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTitle(
  value: string | null | undefined
): string {
  return cleanText(value)
    .replace(/^\d+\s*[.\-:]?\s*/, "")
    .trim();
}

function normalizeForMatch(
  value: string | null | undefined
): string {
  return cleanText(value).toLowerCase();
}

function cleanTenderId(
  value: string
): string | null {
  const text = cleanText(value);

  const match = text.match(
    TENDER_ID_PATTERN
  );

  return match
    ? match[1]
    : null;
}

// ============================================================
// VALUE VALIDATION
// ============================================================

function isPortalDate(
  value: string | null | undefined
): boolean {
  const text = cleanText(value);

  if (!text) {
    return false;
  }

  return new RegExp(
    `^${PORTAL_DATE_PATTERN}$`,
    "i"
  ).test(text);
}

function isLikelyInvalidReference(
  value: string | null | undefined
): boolean {
  const reference = cleanText(value);

  if (!reference) {
    return true;
  }

  // A date/time must never be used as a reference number.
  if (isPortalDate(reference)) {
    return true;
  }

  // Avoid values that are clearly UI labels.
  const lower = reference.toLowerCase();

  const invalidLabels = [
    "tender title",
    "corrigendum title",
    "reference no",
    "closing date",
    "bid opening date",
    "bid submission end date",
    "organisation chain",
    "tender id",
  ];

  if (
    invalidLabels.some((label) =>
      lower === label
    )
  ) {
    return true;
  }

  return false;
}

// ============================================================
// DATE EXTRACTION
// ============================================================

function extractDateAfterLabel(
  text: string,
  label: string
): string | null {
  const pattern = new RegExp(
    `${label}\\s*[:\\-]?\\s*(${PORTAL_DATE_PATTERN})`,
    "i"
  );

  const match = text.match(pattern);

  return match
    ? cleanText(match[1])
    : null;
}

function extractBidOpeningDate(
  text: string
): string | null {
  return extractDateAfterLabel(
    text,
    "Bid Opening Date"
  );
}

function extractClosingDateFromDetail(
  text: string
): string | null {
  return extractDateAfterLabel(
    text,
    "Bid Submission End Date"
  );
}

// ============================================================
// DETAIL PAGE EXTRACTION
// ============================================================

function extractOrganisationChain(
  text: string
): string | null {
  const match = text.match(
    /Organisation Chain\s*[:\-]?\s*(.+?)(?=\s+Tender Reference Number|\s+Tender ID|\s+Tender Type|\s+Form Of Contract|\s+No\.?\s+of Covers|\s+Payment Mode|\s+Is Multi Currency Allowed|\s+Bid Submission Start Date|\s+Bid Submission End Date|\s+Bid Opening Date|$)/i
  );

  if (!match) {
    return null;
  }

  const organisation =
    cleanText(match[1]);

  if (!organisation) {
    return null;
  }

  // Do not accept a date/time as organisation.
  if (isPortalDate(organisation)) {
    return null;
  }

  return organisation;
}

function extractTenderIdFromDetail(
  text: string
): string | null {
  const match = text.match(
    /Tender ID\s*[:\-]?\s*(\d{4}_[A-Za-z0-9]+_\d+_\d+)/i
  );

  if (match) {
    return match[1];
  }

  return cleanTenderId(text);
}

function extractTenderReferenceNumber(
  text: string
): string | null {
  const match = text.match(
    /Tender Reference Number\s*[:\-]?\s*(.+?)(?=\s+Tender ID|\s+Tender Type|\s+Form Of Contract|\s+No\.?\s+of Covers|\s+Payment Mode|\s+Is Multi Currency Allowed|\s+Bid Submission Start Date|\s+Bid Submission End Date|\s+Bid Opening Date|$)/i
  );

  if (!match) {
    return null;
  }

  const reference =
    cleanText(match[1]);

  if (
    isLikelyInvalidReference(reference)
  ) {
    return null;
  }

  return reference;
}

// ============================================================
// EXTRACT DETAIL DATA
// ============================================================

export function extractDetailData(
  text: string
): TenderDetailData {
  const cleanPageText =
    cleanText(text);

  return {
    tenderNumber:
      extractTenderReferenceNumber(
        cleanPageText
      ) ?? "",

    tenderId:
      extractTenderIdFromDetail(
        cleanPageText
      ),

    organisationChain:
      extractOrganisationChain(
        cleanPageText
      ),

    closingDate:
      extractClosingDateFromDetail(
        cleanPageText
      ),

    bidOpeningDate:
      extractBidOpeningDate(
        cleanPageText
      ),
  };
}

// ============================================================
// FIND TABLE HEADERS
// ============================================================

async function getTableHeaders(
  table: Locator
): Promise<string[]> {
  const headers: string[] = [];

  // ----------------------------------------------------------
  // 1. Try THEAD
  // ----------------------------------------------------------

  const theadRows =
    table.locator("thead tr");

  const theadRowCount =
    await theadRows.count();

  for (
    let rowIndex = 0;
    rowIndex < theadRowCount;
    rowIndex++
  ) {
    const row =
      theadRows.nth(rowIndex);

    const cells =
      row.locator("th, td");

    const cellCount =
      await cells.count();

    const currentHeaders: string[] =
      [];

    for (
      let cellIndex = 0;
      cellIndex < cellCount;
      cellIndex++
    ) {
      currentHeaders.push(
        cleanText(
          await cells
            .nth(cellIndex)
            .innerText()
        )
      );
    }

    const combined =
      currentHeaders
        .join(" ")
        .toLowerCase();

    if (
      combined.includes(
        "tender title"
      ) ||
      combined.includes(
        "corrigendum title"
      ) ||
      combined.includes(
        "reference no"
      )
    ) {
      return currentHeaders;
    }
  }

  // ----------------------------------------------------------
  // 2. Search normal TR rows
  // ----------------------------------------------------------

  const rows =
    table.locator("tr");

  const rowCount =
    await rows.count();

  for (
    let rowIndex = 0;
    rowIndex < rowCount;
    rowIndex++
  ) {
    const row =
      rows.nth(rowIndex);

    const cells =
      row.locator("th, td");

    const cellCount =
      await cells.count();

    if (cellCount === 0) {
      continue;
    }

    const possibleHeaders: string[] =
      [];

    for (
      let cellIndex = 0;
      cellIndex < cellCount;
      cellIndex++
    ) {
      possibleHeaders.push(
        cleanText(
          await cells
            .nth(cellIndex)
            .innerText()
        )
      );
    }

    const combined =
      possibleHeaders
        .join(" ")
        .toLowerCase();

    if (
      combined.includes(
        "tender title"
      ) ||
      combined.includes(
        "corrigendum title"
      ) ||
      combined.includes(
        "reference no"
      )
    ) {
      return possibleHeaders;
    }
  }

  return headers;
}

// ============================================================
// FIND HEADER INDEX
// ============================================================

function findHeaderIndex(
  headers: string[],
  keywords: string[]
): number {
  const normalized =
    headers.map((header) =>
      normalizeForMatch(header)
    );

  return normalized.findIndex(
    (header) =>
      keywords.some((keyword) =>
        header.includes(keyword)
      )
  );
}

// ============================================================
// FIND DETAIL LINK FROM ROW
// ============================================================

async function findDetailLink(
  row: Locator
): Promise<string | null> {
  const links =
    row.locator("a[href]");

  const linkCount =
    await links.count();

  if (linkCount === 0) {
    return null;
  }

  // ----------------------------------------------------------
  // First priority:
  // links that look like tender/detail links
  // ----------------------------------------------------------

  for (
    let i = 0;
    i < linkCount;
    i++
  ) {
    const link =
      links.nth(i);

    const href =
      await link.getAttribute(
        "href"
      );

    if (!href) {
      continue;
    }

    const text =
      cleanText(
        await link.innerText()
      );

    const lowerHref =
      href.toLowerCase();

    const lowerText =
      text.toLowerCase();

    // Ignore javascript links.
    if (
      lowerHref.startsWith(
        "javascript:"
      )
    ) {
      continue;
    }

    // Prefer detail-like links.
    if (
      lowerHref.includes(
        "tender"
      ) ||
      lowerHref.includes(
        "view"
      ) ||
      lowerHref.includes(
        "direct"
      ) ||
      lowerText.includes(
        "view"
      )
    ) {
      return href;
    }
  }

  // ----------------------------------------------------------
  // Fallback:
  // first valid href
  // ----------------------------------------------------------

  for (
    let i = 0;
    i < linkCount;
    i++
  ) {
    const href =
      await links
        .nth(i)
        .getAttribute(
          "href"
        );

    if (
      href &&
      !href
        .toLowerCase()
        .startsWith(
          "javascript:"
        )
    ) {
      return href;
    }
  }

  return null;
}

// ============================================================
// FIND TITLE FROM ROW
// ============================================================

async function findTitleFromRow(
  row: Locator,
  cellTexts: string[]
): Promise<string> {

  // ----------------------------------------------------------
  // First priority:
  // useful link text
  // ----------------------------------------------------------

  const links =
    row.locator("a[href]");

  const linkCount =
    await links.count();

  for (
    let linkIndex = 0;
    linkIndex < linkCount;
    linkIndex++
  ) {
    const link =
      links.nth(linkIndex);

    const linkText =
      cleanText(
        await link.innerText()
      );

    if (
      !linkText ||
      linkText.length <= 5
    ) {
      continue;
    }

    // Ignore generic buttons.
    if (
      /^view$/i.test(linkText) ||
      /^details?$/i.test(
        linkText
      ) ||
      /^click here$/i.test(
        linkText
      ) ||
      /^more\.{0,3}$/i.test(
        linkText
      )
    ) {
      continue;
    }

    const title =
      cleanTitle(linkText);

    if (title) {
      return title;
    }
  }

  // ----------------------------------------------------------
  // Second priority:
  // first useful cell
  // ----------------------------------------------------------

  for (
    const cellText of cellTexts
  ) {
    if (!cellText) {
      continue;
    }

    // Ignore simple numbers.
    if (/^\d+$/.test(cellText)) {
      continue;
    }

    // Ignore dates.
    if (
      isPortalDate(cellText)
    ) {
      continue;
    }

    // Ignore Tender IDs.
    if (
      TENDER_ID_PATTERN.test(
        cellText
      )
    ) {
      continue;
    }

    const title =
      cleanTitle(cellText);

    if (title) {
      return title;
    }
  }

  return "";
}

// ============================================================
// PARSE PUBLIC TABLE
// ============================================================
//
// IMPORTANT:
//
// Homepage table is NOT treated as the source of truth.
//
// We only use it to find:
//
// 1. Tender title
// 2. Detail page URL
// 3. Optional Tender ID
//
// Reference number and dates are obtained from the
// tender detail page by inspectTenderDetails().
//
// ============================================================

async function parseTable(
  page: Page,
  tableSelector: string,
  isCorrigendum: boolean
): Promise<ParsedTender[]> {

  console.log(
    `Looking for table: ${tableSelector}`
  );

  const tableLocator =
    page.locator(tableSelector);

  const tableCount =
    await tableLocator.count();

  console.log(
    `Found ${tableCount} table(s) for selector: ${tableSelector}`
  );

  if (tableCount === 0) {
    return [];
  }

  const results: ParsedTender[] =
    [];

  for (
    let tableIndex = 0;
    tableIndex < tableCount;
    tableIndex++
  ) {
    try {
      const table =
        tableLocator.nth(
          tableIndex
        );

      let rows =
        table.locator(
          "tbody tr"
        );

      let rowCount =
        await rows.count();

      if (rowCount === 0) {
        rows =
          table.locator("tr");

        rowCount =
          await rows.count();
      }

      console.log(
        `Table ${tableIndex + 1}: ${rowCount} row(s)`
      );

      for (
        let rowIndex = 0;
        rowIndex < rowCount;
        rowIndex++
      ) {
        try {
          const row =
            rows.nth(rowIndex);

          const cells =
            row.locator("td");

          const cellCount =
            await cells.count();

          if (cellCount === 0) {
            continue;
          }

          // --------------------------------------------------
          // Read cells
          // --------------------------------------------------

          const cellTexts: string[] =
            [];

          for (
            let cellIndex = 0;
            cellIndex < cellCount;
            cellIndex++
          ) {
            const text =
              await cells
                .nth(cellIndex)
                .innerText();

            cellTexts.push(
              cleanText(text)
            );
          }

          const rowText =
            cellTexts.join(" ");

          if (!rowText) {
            continue;
          }

          const lowerRowText =
            rowText.toLowerCase();

          // --------------------------------------------------
          // Skip header rows
          // --------------------------------------------------

          if (
            lowerRowText.includes(
              "tender title"
            ) ||
            lowerRowText.includes(
              "corrigendum title"
            ) ||
            lowerRowText.includes(
              "reference no"
            )
          ) {
            continue;
          }

          // --------------------------------------------------
          // Find title
          // --------------------------------------------------

          const title =
            await findTitleFromRow(
              row,
              cellTexts
            );

          if (!title) {
            console.warn(
              `Skipping row ${
                rowIndex + 1
              }: title not found`
            );

            continue;
          }

          // --------------------------------------------------
          // Find detail link
          // --------------------------------------------------

          const detailHref =
            await findDetailLink(
              row
            );

          if (!detailHref) {
            console.warn(
              `No detail link found for: ${title}`
            );
          }

          // --------------------------------------------------
          // Optional Tender ID
          // --------------------------------------------------

          const tenderIdMatch =
            rowText.match(
              TENDER_ID_PATTERN
            );

          const tenderId =
            tenderIdMatch
              ? tenderIdMatch[1]
              : null;

          // --------------------------------------------------
          // Do NOT read reference/date values
          // from homepage.
          // --------------------------------------------------

          console.log(
            "Parsed table row:",
            {
              rowIndex:
                rowIndex + 1,
              title,
              detailHref,
              tenderId,
            }
          );

          results.push({
            title,
            tenderNumber: "",
            closingDate: null,
            bidOpeningDate: null,
            sourceUrl:
              detailHref,
            detailHref,
            isCorrigendum,
            tenderId,
            organisationChain:
              null,
          });

        } catch (rowError) {
          console.error(
            `Failed to parse row ${
              rowIndex + 1
            } in table ${
              tableIndex + 1
            }:`,
            rowError
          );
        }
      }

    } catch (tableError) {
      console.error(
        `Failed to parse table ${
          tableIndex + 1
        }:`,
        tableError
      );
    }
  }

  console.log(
    `Finished parsing ${tableSelector}. Total results: ${results.length}`
  );

  return results;
}

// ============================================================
// WAIT FOR ACTIVE TENDER TABLE
// ============================================================

export async function waitForActiveTenderTable(
  page: Page
): Promise<void> {

  console.log(
    "Waiting for tender table..."
  );

  await page.waitForSelector(
    "#activeTenders, table.list_table",
    {
      state: "attached",
      timeout: 45000,
    }
  );

  console.log(
    "Tender table detected."
  );
}

// ============================================================
// PARSE LATEST TENDERS
// ============================================================

export async function parseLatestTenders(
  page: Page
): Promise<ParsedTender[]> {

  console.log(
    "Opening Odisha Tender Portal homepage..."
  );

  try {
    await page.goto(
      PORTAL_HOME_URL,
      {
        waitUntil: "commit",
        timeout: 30000,
      }
    );

  } catch (navigationError) {
    console.warn(
      "Initial portal navigation warning:",
      navigationError
    );
  }

  console.log(
    `Current URL after navigation: ${page.url()}`
  );

  // Give portal time to finish loading.
  await page.waitForTimeout(
    5000
  );

  console.log(
    `URL after waiting: ${page.url()}`
  );

  await waitForActiveTenderTable(
    page
  );

  console.log(
    "Tender table found."
  );

  // ----------------------------------------------------------
  // PRIMARY TABLE
  // ----------------------------------------------------------

  if (
    await page
      .locator(
        "#activeTenders"
      )
      .count() > 0
  ) {

    console.log(
      "Parsing #activeTenders table..."
    );

    const results =
      await parseTable(
        page,
        "#activeTenders",
        false
      );

    if (
      results.length > 0
    ) {

      console.log(
        `Parsed ${results.length} tenders from #activeTenders.`
      );

      // IMPORTANT:
      // Open detail pages and enrich tender information.

      console.log(
        "Starting tender detail inspection..."
      );

      const enrichedResults =
        await inspectTenderDetails(
          page,
          results
        );

      console.log(
        `Detail inspection completed: ${enrichedResults.length} tenders`
      );

      return enrichedResults;
    }
  }

  // ----------------------------------------------------------
  // FALLBACK
  // ----------------------------------------------------------

  console.log(
    "Using table.list_table fallback..."
  );

  const fallbackResults =
    await parseTable(
      page,
      "table.list_table",
      false
    );

  console.log(
    `Parsed ${fallbackResults.length} tenders from fallback table.`
  );

  if (
    fallbackResults.length === 0
  ) {
    return [];
  }

  // IMPORTANT:
  // Also inspect fallback tender detail pages.

  console.log(
    "Starting tender detail inspection for fallback results..."
  );

  const enrichedResults =
    await inspectTenderDetails(
      page,
      fallbackResults
    );

  console.log(
    `Detail inspection completed: ${enrichedResults.length} tenders`
  );

  return enrichedResults;
}

// ============================================================
// PARSE LATEST CORRIGENDA
// ============================================================
//
// Corrigendum homepage rows can contain:
//
// - duplicate rows
// - "More..." navigation links
// - rows without useful detail links
//
// Therefore this function filters and deduplicates them.
//
// ============================================================

export async function parseLatestCorrigenda(
  page: Page
): Promise<ParsedTender[]> {

  const tables =
    page.locator(
      "table.list_table"
    );

  const tableCount =
    await tables.count();

  const results: ParsedTender[] =
    [];

  console.log(
    `Searching ${tableCount} table(s) for corrigenda...`
  );

  for (
    let tableIndex = 0;
    tableIndex < tableCount;
    tableIndex++
  ) {
    try {

      const table =
        tables.nth(
          tableIndex
        );

      const tableText =
        normalizeForMatch(
          await table.innerText()
        );

      // Only process tables containing corrigendum data.
      if (
        !tableText.includes(
          "corrigendum"
        )
      ) {
        continue;
      }

      console.log(
        `Parsing corrigendum table ${
          tableIndex + 1
        }...`
      );

      // ------------------------------------------------------
      // Rows
      // ------------------------------------------------------

      let rows =
        table.locator(
          "tbody tr"
        );

      let rowCount =
        await rows.count();

      if (rowCount === 0) {
        rows =
          table.locator("tr");

        rowCount =
          await rows.count();
      }

      for (
        let rowIndex = 0;
        rowIndex < rowCount;
        rowIndex++
      ) {
        try {

          const row =
            rows.nth(
              rowIndex
            );

          const cells =
            row.locator("td");

          const cellCount =
            await cells.count();

          if (cellCount === 0) {
            continue;
          }

          // --------------------------------------------------
          // Read cells
          // --------------------------------------------------

          const cellTexts: string[] =
            [];

          for (
            let cellIndex = 0;
            cellIndex < cellCount;
            cellIndex++
          ) {
            cellTexts.push(
              cleanText(
                await cells
                  .nth(
                    cellIndex
                  )
                  .innerText()
              )
            );
          }

          const rowText =
            cellTexts.join(" ");

          if (!rowText) {
            continue;
          }

          const lowerRowText =
            rowText.toLowerCase();

          // --------------------------------------------------
          // Skip header
          // --------------------------------------------------

          if (
            lowerRowText.includes(
              "corrigendum title"
            ) ||
            lowerRowText.includes(
              "reference no"
            )
          ) {
            continue;
          }

          // --------------------------------------------------
          // TITLE
          // --------------------------------------------------

          const title =
            await findTitleFromRow(
              row,
              cellTexts
            );

          if (!title) {
            console.warn(
              `Skipping corrigendum row ${
                rowIndex + 1
              }: title not found`
            );

            continue;
          }

          // --------------------------------------------------
          // SKIP "MORE..." NAVIGATION ROW
          // --------------------------------------------------

          if (
            /^more\.{0,3}$/i.test(
              title
            )
          ) {
            console.log(
              "Skipping More... navigation row"
            );

            continue;
          }

          // --------------------------------------------------
          // FIND DETAIL LINK
          // --------------------------------------------------

          const detailHref =
            await findDetailLink(
              row
            );

          if (!detailHref) {
            console.warn(
              `Skipping corrigendum without detail link: ${title}`
            );

            continue;
          }

          // --------------------------------------------------
          // OPTIONAL TENDER ID
          // --------------------------------------------------

          const tenderIdMatch =
            rowText.match(
              TENDER_ID_PATTERN
            );

          const tenderId =
            tenderIdMatch
              ? tenderIdMatch[1]
              : null;

          // --------------------------------------------------
          // DUPLICATE CHECK
          // --------------------------------------------------

          const normalizedTitle =
            normalizeForMatch(
              title
            );

          const duplicate =
            results.some(
              (existing) => {

                // Same detail URL.
                if (
                  existing.detailHref ===
                  detailHref
                ) {
                  return true;
                }

                // Same title + same Tender ID.
                if (
                  normalizeForMatch(
                    existing.title
                  ) ===
                    normalizedTitle &&
                  existing.tenderId ===
                    tenderId
                ) {
                  return true;
                }

                // If both have no Tender ID,
                // same title is enough to avoid
                // obvious homepage duplicates.
                if (
                  !existing.tenderId &&
                  !tenderId &&
                  normalizeForMatch(
                    existing.title
                  ) ===
                    normalizedTitle
                ) {
                  return true;
                }

                return false;
              }
            );

          if (duplicate) {
            console.log(
              `Skipping duplicate corrigendum: ${title}`
            );

            continue;
          }

          // --------------------------------------------------
          // SAVE VALID CORRIGENDUM
          // --------------------------------------------------

          const corrigendum:
            ParsedTender = {

            title,

            tenderNumber: "",

            closingDate: null,

            bidOpeningDate: null,

            sourceUrl:
              detailHref,

            detailHref,

            isCorrigendum: true,

            tenderId,

            organisationChain:
              null,
          };

          results.push(
            corrigendum
          );

          console.log(
            "Parsed corrigendum row:",
            {
              rowIndex:
                rowIndex + 1,
              title,
              detailHref,
              tenderId,
            }
          );

        } catch (rowError) {
          console.error(
            `Failed to parse corrigendum row ${
              rowIndex + 1
            }:`,
            rowError
          );
        }
      }

    } catch (tableError) {
      console.error(
        `Failed to parse corrigendum table ${
          tableIndex + 1
        }:`,
        tableError
      );
    }
  }

  console.log(
    `Total valid corrigenda parsed: ${results.length}`
  );

  if (
    results.length === 0
  ) {
    return [];
  }

  // IMPORTANT:
  // Inspect corrigendum detail pages too.

  console.log(
    "Starting corrigendum detail inspection..."
  );

  const enrichedResults =
    await inspectTenderDetails(
      page,
      results
    );

  console.log(
    `Corrigendum detail inspection completed: ${enrichedResults.length} corrigenda`
  );

  return enrichedResults;
}

// ============================================================
// FIND EXACT TENDER ROW
// ============================================================

export async function findExactTenderRow(
  page: Page,
  tender: ParsedTender
): Promise<{
  found: boolean;
  href: string | null;
}> {

  const rows =
    page.locator(
      "#activeTenders tr, table.list_table tr"
    );

  const rowCount =
    await rows.count();

  const targetTitle =
    normalizeForMatch(
      tender.title
    );

  // ----------------------------------------------------------
  // First try Tender ID
  // ----------------------------------------------------------

  const targetTenderId =
    normalizeForMatch(
      tender.tenderId
    );

  for (
    let i = 0;
    i < rowCount;
    i++
  ) {
    try {

      const row =
        rows.nth(i);

      const rowText =
        normalizeForMatch(
          await row.innerText()
        );

      if (
        targetTenderId &&
        rowText.includes(
          targetTenderId
        )
      ) {

        const href =
          await findDetailLink(
            row
          );

        if (href) {
          return {
            found: true,
            href,
          };
        }
      }

    } catch (error) {

      console.error(
        `Failed while checking Tender ID row ${
          i + 1
        }:`,
        error
      );
    }
  }

  // ----------------------------------------------------------
  // Second try title only
  // ----------------------------------------------------------

  for (
    let i = 0;
    i < rowCount;
    i++
  ) {
    try {

      const row =
        rows.nth(i);

      const rowText =
        normalizeForMatch(
          await row.innerText()
        );

      if (
        !targetTitle ||
        !rowText.includes(
          targetTitle
        )
      ) {
        continue;
      }

      const href =
        await findDetailLink(
          row
        );

      if (href) {
        return {
          found: true,
          href,
        };
      }

    } catch (error) {

      console.error(
        `Failed while checking tender row ${
          i + 1
        }:`,
        error
      );
    }
  }

  return {
    found: false,
    href: null,
  };
}

// ============================================================
// INSPECT TENDER DETAILS
// ============================================================
//
// Detail page is the SOURCE OF TRUTH for:
//
// - Tender Reference Number
// - Tender ID
// - Organisation Chain
// - Closing Date
// - Bid Opening Date
//
// ============================================================

export async function inspectTenderDetails(
  page: Page,
  tenders: ParsedTender[]
): Promise<ParsedTender[]> {

  const enrichedTenders:
    ParsedTender[] = [];

  console.log(
    `Inspecting ${tenders.length} tender detail page(s)...`
  );

  for (
    const tender of tenders
  ) {

    let detailPage:
      Page | null = null;

    try {

      // ======================================================
      // FIND DETAIL URL
      // ======================================================

      let detailHref =
        tender.detailHref;

      if (!detailHref) {

        const rowResult =
          await findExactTenderRow(
            page,
            tender
          );

        if (
          rowResult.found
        ) {
          detailHref =
            rowResult.href;
        }
      }

      if (!detailHref) {

        console.warn(
          `No detail URL found for: ${tender.title}`
        );

        enrichedTenders.push(
          tender
        );

        continue;
      }

      // ======================================================
      // CREATE DETAIL PAGE
      // ======================================================

      detailPage =
        await page
          .context()
          .newPage();

      let absoluteUrl =
        detailHref;

      if (
        !detailHref.startsWith(
          "http://"
        ) &&
        !detailHref.startsWith(
          "https://"
        )
      ) {
        absoluteUrl =
          new URL(
            detailHref,
            page.url()
          ).toString();
      }

      console.log(
        `Opening detail URL: ${absoluteUrl}`
      );

      // ======================================================
      // OPEN DETAIL PAGE
      // ======================================================

      try {

        await detailPage.goto(
          absoluteUrl,
          {
            waitUntil:
              "domcontentloaded",
            timeout: 30000,
          }
        );

      } catch (navigationError) {

        console.warn(
          `Detail page navigation warning for ${tender.title}:`,
          navigationError
        );
      }

      await detailPage.waitForTimeout(
        500
      );

      // ======================================================
      // READ PAGE TEXT
      // ======================================================

      const detailText =
        await detailPage
          .locator("body")
          .innerText();

      // ======================================================
      // EXTRACT DETAILS
      // ======================================================

      const details =
        extractDetailData(
          detailText
        );

      console.log(
        "----------------------------------------"
      );

      console.log(
        `Tender Title: ${tender.title}`
      );

      console.log(
        `Reference: ${
          details.tenderNumber ||
          "Not found"
        }`
      );

      console.log(
        `Tender ID: ${
          details.tenderId ||
          "Not found"
        }`
      );

      console.log(
        `Organisation: ${
          details.organisationChain ||
          "Not found"
        }`
      );

      console.log(
        `Closing Date: ${
          details.closingDate ||
          "Not found"
        }`
      );

      console.log(
        `Bid Opening Date: ${
          details.bidOpeningDate ||
          "Not found"
        }`
      );

      console.log(
        "----------------------------------------"
      );

      // ======================================================
      // SAFE MERGE
      // ======================================================

      const validReference =
        details.tenderNumber &&
        !isLikelyInvalidReference(
          details.tenderNumber
        )
          ? details.tenderNumber
          : tender.tenderNumber;

      const validTenderId =
        details.tenderId ||
        tender.tenderId;

      const validOrganisation =
        details.organisationChain ||
        tender.organisationChain;

      const validClosingDate =
        details.closingDate ||
        tender.closingDate;

      const validBidOpeningDate =
        details.bidOpeningDate ||
        tender.bidOpeningDate;

      enrichedTenders.push({
        ...tender,

        tenderNumber:
          validReference,

        tenderId:
          validTenderId,

        organisationChain:
          validOrganisation,

        closingDate:
          validClosingDate,

        bidOpeningDate:
          validBidOpeningDate,

        detailHref,

        sourceUrl:
          detailHref,
      });

    } catch (error) {

      console.error(
        `Failed to inspect tender detail: ${tender.title}`,
        error
      );

      // Keep original data.
      enrichedTenders.push(
        tender
      );

    } finally {

      // ======================================================
      // ALWAYS CLOSE DETAIL PAGE
      // ======================================================

      if (detailPage) {

        try {
          await detailPage.close();

        } catch (closeError) {

          console.error(
            "Failed to close detail page:",
            closeError
          );
        }
      }
    }
  }

  console.log(
    `Tender detail inspection completed. Enriched ${enrichedTenders.length} tender(s).`
  );

  return enrichedTenders;
}

