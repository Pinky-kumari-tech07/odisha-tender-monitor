// import { NextResponse } from "next/server";

// import { openBrowser } from "@/scraper/browser";
// import {
//   parseLatestTenders,
//   parseLatestCorrigenda,
// } from "@/scraper/parser";
// import { normalizeTenders } from "@/scraper/normalize";

// import {
//   getExistingTenderKeys,
//   insertTender,
// } from "@/services/tenderService";

// import {
//   startJob,
//   completeJob,
//   failJob,
// } from "@/services/jobService";

// import {
//   formatNewTenderMessage,
//   sendTelegramMessage,
// } from "@/integrations/telegram";

// import { logNotification } from "@/services/notificationService";

// export async function GET() {
//   let jobId: number | null = null;
//   let browser: Awaited<ReturnType<typeof openBrowser>> | null = null;

//   let notificationCount = 0;
//   let notificationFailureCount = 0;

//   try {
//     // 1. Start job
//     jobId = await startJob();

//     // 2. Open browser
//     browser = await openBrowser();

//     // 3. Scrape latest tenders
//     const tenders = await parseLatestTenders(browser.page);

//     // 4. Scrape latest corrigendums
//     const corrigenda = await parseLatestCorrigenda(browser.page);

//     // 5. Combine results
//     const scrapedItems = [...tenders, ...corrigenda];

//     // 6. Normalize
//     const normalizedItems = normalizeTenders(scrapedItems);

//     // 7. Get existing database keys
//     const existingKeys = await getExistingTenderKeys(
//       normalizedItems.map((item) => item.externalKey)
//     );

//     // 8. Find new items
//     const newItems = normalizedItems.filter(
//       (item) => !existingKeys.has(item.externalKey)
//     );

//     // 9. Insert new items
//     let insertedCount = 0;

//     for (const item of newItems) {
//       const result = await insertTender(
//         {
//           title: item.title,
//           tenderNumber: item.tenderNumber,
//           closingDate: item.closingDate,
//           bidOpeningDate: item.bidOpeningDate,
//           sourceUrl: item.sourceUrl,
//           isCorrigendum: item.isCorrigendum,
//           tenderId: item.tenderId,
//           organisationChain: item.organisationChain,
//         },
//         item.externalKey
//       );

//       // Only send notification when tender was actually inserted
//       if (result.inserted && result.tender) {
//         insertedCount++;

//         try {
//           // 10. Create Telegram message
//           const telegramMessage = formatNewTenderMessage({
//             title: item.title,
//             tenderNumber: item.tenderNumber,
//             tenderId: item.tenderId,
//             organisation: item.organisationChain,
//             closingDate: item.closingDate,
//             bidOpeningDate: item.bidOpeningDate,
//             sourceUrl: item.sourceUrl,
//           });

//           // 11. Send Telegram
//           const telegramMessageId =
//             await sendTelegramMessage(telegramMessage);

//           // 12. Save successful notification log
//           await logNotification({
//             tenderId: result.tender.id,
//             destination: process.env.TELEGRAM_CHAT_ID ?? "telegram",
//             status: "SENT",
//             telegramMessageId,
//             attemptCount: 1,
//           });

//           notificationCount++;
//         } catch (notificationError) {
//           notificationFailureCount++;

//           const errorMessage =
//             notificationError instanceof Error
//               ? notificationError.message
//               : "Unknown Telegram notification error";

//           console.error(
//             `Telegram notification failed for tender ${result.tender.id}:`,
//             notificationError
//           );

//           // Save failed notification log
//           try {
//             await logNotification({
//               tenderId: result.tender.id,
//               destination: process.env.TELEGRAM_CHAT_ID ?? "telegram",
//               status: "FAILED",
//               telegramMessageId: null,
//               errorMessage,
//               attemptCount: 1,
//             });
//           } catch (logError) {
//             console.error(
//               "Failed to save notification log:",
//               logError
//             );
//           }
//         }
//       }
//     }

//     // 13. Complete job
//     await completeJob(jobId, {
//       parsedCount: normalizedItems.length,
//       newCount: newItems.length,
//       notificationCount,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Tender check completed",
//       scrapedCount: normalizedItems.length,
//       existingCount:
//         normalizedItems.length - newItems.length,
//       newCount: newItems.length,
//       insertedCount,
//       notificationCount,
//       notificationFailureCount,
//     });
//   } catch (error) {
//     console.error("Tender check failed:", error);

//     if (jobId !== null) {
//       try {
//         await failJob(
//           jobId,
//           "CRON_CHECK_ERROR",
//           error instanceof Error
//             ? error.message
//             : "Unknown error"
//         );
//       } catch (jobError) {
//         console.error(
//           "Failed to update job status:",
//           jobError
//         );
//       }
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Tender check failed",
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown error",
//       },
//       { status: 500 }
//     );
//   } finally {
//     if (browser) {
//       await browser.browser.close();
//     }
//   }
// }


// import { NextResponse } from "next/server";

// import { openBrowser } from "@/scraper/browser";

// import {
//   parseLatestTenders,
//   parseLatestCorrigenda,
// } from "@/scraper/parser";

// import { normalizeTenders } from "@/scraper/normalize";

// import {
//   getExistingTenderKeys,
//   insertTender,
// } from "@/services/tenderService";

// import {
//   startJob,
//   completeJob,
//   failJob,
// } from "@/services/jobService";

// import {
//   formatNewTenderMessage,
//   sendTelegramMessage,
// } from "@/integrations/telegram";

// import { logNotification } from "@/services/notificationService";

// export async function GET(request: Request) {
//   // ============================================================
//   // 0. CRON SECURITY
//   // ============================================================

//   const authHeader = request.headers.get("authorization");
//   const cronSecret = process.env.CRON_SECRET;

//   if (!cronSecret) {
//     console.error("CRON_SECRET is not configured");

//     return NextResponse.json(
//       {
//         success: false,
//         message: "CRON_SECRET is not configured",
//       },
//       { status: 500 }
//     );
//   }

//   if (authHeader !== `Bearer ${cronSecret}`) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Unauthorized",
//       },
//       { status: 401 }
//     );
//   }

//   // ============================================================
//   // VARIABLES
//   // ============================================================

//   let jobId: number | null = null;

//   let browser: Awaited<ReturnType<typeof openBrowser>> | null = null;

//   let notificationCount = 0;
//   let notificationFailureCount = 0;

//   try {
//     // ==========================================================
//     // 1. START JOB
//     // ==========================================================

//     jobId = await startJob();

//     // ==========================================================
//     // 2. OPEN BROWSER
//     // ==========================================================

//     browser = await openBrowser();

//     // ==========================================================
//     // 3. SCRAPE LATEST TENDERS
//     // ==========================================================

//     const tenders = await parseLatestTenders(browser.page);

//     // ==========================================================
//     // 4. SCRAPE LATEST CORRIGENDUMS
//     // ==========================================================

//     const corrigenda = await parseLatestCorrigenda(browser.page);

//     // ==========================================================
//     // 5. COMBINE RESULTS
//     // ==========================================================

//     const scrapedItems = [
//       ...tenders,
//       ...corrigenda,
//     ];

//     // ==========================================================
//     // 6. NORMALIZE
//     // ==========================================================

//     const normalizedItems = normalizeTenders(scrapedItems);

//     // ==========================================================
//     // 7. GET EXISTING DATABASE KEYS
//     // ==========================================================

//     const existingKeys = await getExistingTenderKeys(
//       normalizedItems.map(
//         (item) => item.externalKey
//       )
//     );

//     // ==========================================================
//     // 8. FIND NEW ITEMS
//     // ==========================================================

//     const newItems = normalizedItems.filter(
//       (item) => !existingKeys.has(item.externalKey)
//     );

//     // ==========================================================
//     // 9. INSERT NEW ITEMS
//     // ==========================================================

//     let insertedCount = 0;

//     for (const item of newItems) {
//       const result = await insertTender(
//         {
//           title: item.title,
//           tenderNumber: item.tenderNumber,
//           closingDate: item.closingDate,
//           bidOpeningDate: item.bidOpeningDate,
//           sourceUrl: item.sourceUrl,
//           isCorrigendum: item.isCorrigendum,
//           tenderId: item.tenderId,
//           organisationChain: item.organisationChain,
//         },
//         item.externalKey
//       );

//       // ========================================================
//       // ONLY SEND TELEGRAM IF DATABASE INSERT SUCCEEDED
//       // ========================================================

//       if (result.inserted && result.tender) {
//         insertedCount++;

//         try {
//           // ======================================================
//           // 10. CREATE TELEGRAM MESSAGE
//           // ======================================================

//           const telegramMessage =
//             formatNewTenderMessage({
//               title: item.title,
//               tenderNumber: item.tenderNumber,
//               tenderId: item.tenderId,
//               organisation: item.organisationChain,
//               closingDate: item.closingDate,
//               bidOpeningDate: item.bidOpeningDate,
//               sourceUrl: item.sourceUrl,
//             });

//           // ======================================================
//           // 11. SEND TELEGRAM
//           // ======================================================

//           const telegramMessageId =
//             await sendTelegramMessage(
//               telegramMessage
//             );

//           // ======================================================
//           // 12. SAVE SUCCESSFUL NOTIFICATION LOG
//           // ======================================================

//           await logNotification({
//             tenderId: result.tender.id,
//             destination:
//               process.env.TELEGRAM_CHAT_ID ??
//               "telegram",
//             status: "SENT",
//             telegramMessageId,
//             attemptCount: 1,
//           });

//           notificationCount++;
//         } catch (notificationError) {
//           // ======================================================
//           // TELEGRAM FAILED
//           // ======================================================

//           notificationFailureCount++;

//           const errorMessage =
//             notificationError instanceof Error
//               ? notificationError.message
//               : "Unknown Telegram notification error";

//           console.error(
//             `Telegram notification failed for tender ${result.tender.id}:`,
//             notificationError
//           );

//           // ======================================================
//           // SAVE FAILED NOTIFICATION LOG
//           // ======================================================

//           try {
//             await logNotification({
//               tenderId: result.tender.id,
//               destination:
//                 process.env.TELEGRAM_CHAT_ID ??
//                 "telegram",
//               status: "FAILED",
//               telegramMessageId: null,
//               errorMessage,
//               attemptCount: 1,
//             });
//           } catch (logError) {
//             console.error(
//               "Failed to save notification log:",
//               logError
//             );
//           }
//         }
//       }
//     }

//     // ==========================================================
//     // 13. COMPLETE JOB
//     // ==========================================================

//     await completeJob(jobId, {
//       parsedCount: normalizedItems.length,
//       newCount: newItems.length,
//       notificationCount,
//     });

//     // ==========================================================
//     // 14. RETURN SUCCESS RESPONSE
//     // ==========================================================

//     return NextResponse.json({
//       success: true,
//       message: "Tender check completed",

//       scrapedCount:
//         normalizedItems.length,

//       existingCount:
//         normalizedItems.length -
//         newItems.length,

//       newCount:
//         newItems.length,

//       insertedCount,

//       notificationCount,

//       notificationFailureCount,
//     });
//   } catch (error) {
//     // ============================================================
//     // JOB FAILED
//     // ============================================================

//     console.error(
//       "Tender check failed:",
//       error
//     );

//     // ============================================================
//     // UPDATE JOB AS FAILED
//     // ============================================================

//     if (jobId !== null) {
//       try {
//         await failJob(
//           jobId,
//           "CRON_CHECK_ERROR",
//           error instanceof Error
//             ? error.message
//             : "Unknown error"
//         );
//       } catch (jobError) {
//         console.error(
//           "Failed to update job status:",
//           jobError
//         );
//       }
//     }

//     // ============================================================
//     // RETURN ERROR
//     // ============================================================

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Tender check failed",
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown error",
//       },
//       { status: 500 }
//     );
//   } finally {
//     // ============================================================
//     // CLOSE BROWSER
//     // ============================================================

//     if (browser) {
//       await browser.browser.close();
//     }
//   }
// }



import { NextResponse } from "next/server";

import { openBrowser } from "@/scraper/browser";

import {
  parseLatestTenders,
  parseLatestCorrigenda,
} from "@/scraper/parser";

import { normalizeTenders } from "@/scraper/normalize";

import {
  getExistingTenderKeys,
  insertTender,
} from "@/services/tenderService";

import {
  startJob,
  completeJob,
  failJob,
} from "@/services/jobService";

import {
  formatNewTenderMessage,
  sendTelegramMessage,
} from "@/integrations/telegram";

import { logNotification } from "@/services/notificationService";

export async function GET(request: Request) {
  // ============================================================
  // 0. CRON SECURITY
  // ============================================================

  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not configured");

    return NextResponse.json(
      {
        success: false,
        message: "CRON_SECRET is not configured",
      },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  // ============================================================
  // VARIABLES
  // ============================================================

  let jobId: number | null = null;

  let browser: Awaited<ReturnType<typeof openBrowser>> | null = null;

  let notificationCount = 0;
  let notificationFailureCount = 0;

  try {
    // ==========================================================
    // 1. START JOB
    // ==========================================================

    jobId = await startJob();

    // ==========================================================
    // 2. OPEN BROWSER
    // ==========================================================

    browser = await openBrowser();

    // ==========================================================
    // 3. SCRAPE LATEST TENDERS
    // ==========================================================

    const tenders = await parseLatestTenders(browser.page);

    // ==========================================================
    // 4. SCRAPE LATEST CORRIGENDUMS
    // ==========================================================

    const corrigenda = await parseLatestCorrigenda(browser.page);

    // ==========================================================
    // 5. COMBINE RESULTS
    // ==========================================================

    const scrapedItems = [
      ...tenders,
      ...corrigenda,
    ];

    // ==========================================================
    // 6. NORMALIZE
    // ==========================================================

    const normalizedItems = normalizeTenders(scrapedItems);

    // ==========================================================
    // 7. GET EXISTING DATABASE KEYS
    // ==========================================================

    const existingKeys = await getExistingTenderKeys(
      normalizedItems.map((item) => item.externalKey)
    );

    // ==========================================================
    // 8. FIND NEW ITEMS
    // ==========================================================

    const newItems = normalizedItems.filter(
      (item) => !existingKeys.has(item.externalKey)
    );

    // ==========================================================
    // 9. INSERT NEW ITEMS
    // ==========================================================

    let insertedCount = 0;

    for (const item of newItems) {
      const result = await insertTender(
        {
          title: item.title,
          tenderNumber: item.tenderNumber,
          closingDate: item.closingDate,
          bidOpeningDate: item.bidOpeningDate,
          sourceUrl: item.sourceUrl,
          isCorrigendum: item.isCorrigendum,
          tenderId: item.tenderId,
          organisationChain: item.organisationChain,
        },
        item.externalKey
      );

      // ========================================================
      // ONLY SEND TELEGRAM IF DATABASE INSERT SUCCEEDED
      // ========================================================

      if (result.inserted && result.tender) {
        insertedCount++;

        try {
          // ======================================================
          // 10. CREATE TELEGRAM MESSAGE
          // ======================================================

          const telegramMessage = formatNewTenderMessage({
            title: item.title,
            tenderNumber: item.tenderNumber,
            tenderId: item.tenderId,
            organisation: item.organisationChain,
            closingDate: item.closingDate,
            bidOpeningDate: item.bidOpeningDate,
            sourceUrl: item.sourceUrl,
          });

          // ======================================================
          // 11. SEND TELEGRAM
          // ======================================================

          const telegramMessageId =
            await sendTelegramMessage(telegramMessage);

          // ======================================================
          // 12. SAVE SUCCESSFUL NOTIFICATION LOG
          // ======================================================

          await logNotification({
            tenderId: result.tender.id,
            destination:
              process.env.TELEGRAM_CHAT_ID ?? "telegram",
            status: "SENT",
            telegramMessageId,
            attemptCount: 1,
          });

          notificationCount++;
        } catch (notificationError) {
          // ======================================================
          // TELEGRAM FAILED
          // ======================================================

          notificationFailureCount++;

          const errorMessage =
            notificationError instanceof Error
              ? notificationError.message
              : "Unknown Telegram notification error";

          console.error(
            `Telegram notification failed for tender ${result.tender.id}:`,
            notificationError
          );

          // ======================================================
          // SAVE FAILED NOTIFICATION LOG
          // ======================================================

          try {
            await logNotification({
              tenderId: result.tender.id,
              destination:
                process.env.TELEGRAM_CHAT_ID ?? "telegram",
              status: "FAILED",
              telegramMessageId: null,
              errorMessage,
              attemptCount: 1,
            });
          } catch (logError) {
            console.error(
              "Failed to save notification log:",
              logError
            );
          }
        }
      }
    }

    // ==========================================================
    // 13. COMPLETE JOB
    // ==========================================================

    await completeJob(jobId, {
      parsedCount: normalizedItems.length,
      newCount: newItems.length,
      notificationCount,
    });

    // ==========================================================
    // 14. RETURN SUCCESS RESPONSE
    // ==========================================================

    return NextResponse.json({
      success: true,
      message: "Tender check completed",

      scrapedCount: normalizedItems.length,

      existingCount:
        normalizedItems.length - newItems.length,

      newCount: newItems.length,

      insertedCount,

      notificationCount,

      notificationFailureCount,
    });
  } catch (error) {
    // ============================================================
    // JOB FAILED
    // ============================================================

    console.error("Tender check failed:", error);

    // ============================================================
    // UPDATE JOB AS FAILED
    // ============================================================

    if (jobId !== null) {
      try {
        await failJob(
          jobId,
          "CRON_CHECK_ERROR",
          error instanceof Error
            ? error.message
            : "Unknown error"
        );
      } catch (jobError) {
        console.error(
          "Failed to update job status:",
          jobError
        );
      }
    }

    // ============================================================
    // RETURN ERROR
    // ============================================================

    return NextResponse.json(
      {
        success: false,
        message: "Tender check failed",

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // ============================================================
    // CLOSE BROWSER
    // ============================================================

    if (browser) {
      await browser.browser.close();
    }
  }
}