// // // // import { db } from "@/db";
// // // // import { tenders } from "@/db/schema";
// // // // import { inArray } from "drizzle-orm";

// // // // export async function getExistingTenderKeys(
// // // //   externalKeys: string[]
// // // // ): Promise<Set<string>> {
// // // //   if (externalKeys.length === 0) {
// // // //     return new Set();
// // // //   }

// // // //   const result = await db
// // // //     .select({
// // // //       externalKey: tenders.externalKey,
// // // //     })
// // // //     .from(tenders)
// // // //     .where(inArray(tenders.externalKey, externalKeys));

// // // //   return new Set(result.map((item) => item.externalKey));
// // // // }

// // // import { db } from "@/db";
// // // import { organisations, tenders } from "@/db/schema";
// // // import { eq, inArray } from "drizzle-orm";

// // // export type ParsedTenderForDb = {
// // //   title: string;
// // //   tenderNumber: string;
// // //   closingDate: string | null;
// // //   bidOpeningDate: string | null;
// // //   sourceUrl: string | null;
// // //   isCorrigendum: boolean;
// // //   tenderId: string | null;
// // //   organisationChain: string | null;
// // // };

// // // export function parsePortalDate(value: string | null): Date | null {
// // //   if (!value) return null;

// // //   const match = value
// // //     .trim()
// // //     .match(
// // //       /^(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
// // //     );

// // //   if (!match) return null;

// // //   const [, day, monthName, year, hourRaw, minute, ampm] = match;

// // //   const months: Record<string, string> = {
// // //     jan: "01",
// // //     feb: "02",
// // //     mar: "03",
// // //     apr: "04",
// // //     may: "05",
// // //     jun: "06",
// // //     jul: "07",
// // //     aug: "08",
// // //     sep: "09",
// // //     oct: "10",
// // //     nov: "11",
// // //     dec: "12",
// // //   };

// // //   const month = months[monthName.toLowerCase()];

// // //   if (!month) return null;

// // //   let hour = Number(hourRaw);

// // //   if (ampm.toUpperCase() === "PM" && hour !== 12) {
// // //     hour += 12;
// // //   }

// // //   if (ampm.toUpperCase() === "AM" && hour === 12) {
// // //     hour = 0;
// // //   }

// // //   const formattedHour = String(hour).padStart(2, "0");

// // //   // Odisha portal dates are treated as IST (+05:30)
// // //   return new Date(
// // //     `${year}-${month}-${String(day).padStart(2, "0")}T${formattedHour}:${minute}:00+05:30`
// // //   );
// // // }

// // // export async function getExistingTenderKeys(
// // //   externalKeys: string[]
// // // ): Promise<Set<string>> {
// // //   if (externalKeys.length === 0) {
// // //     return new Set();
// // //   }

// // //   const result = await db
// // //     .select({
// // //       externalKey: tenders.externalKey,
// // //     })
// // //     .from(tenders)
// // //     .where(inArray(tenders.externalKey, externalKeys));

// // //   return new Set(result.map((item) => item.externalKey));
// // // }

// // // export async function findOrCreateOrganisation(
// // //   organisationName: string
// // // ): Promise<number> {
// // //   const name = organisationName.trim();

// // //   if (!name) {
// // //     throw new Error("Organisation name is required");
// // //   }

// // //   const existing = await db
// // //     .select({
// // //       id: organisations.id,
// // //     })
// // //     .from(organisations)
// // //     .where(eq(organisations.name, name))
// // //     .limit(1);

// // //   if (existing.length > 0) {
// // //     return existing[0].id;
// // //   }

// // //   const created = await db
// // //     .insert(organisations)
// // //     .values({
// // //       name,
// // //     })
// // //     .onConflictDoNothing({
// // //       target: organisations.name,
// // //     })
// // //     .returning({
// // //       id: organisations.id,
// // //     });

// // //   if (created.length > 0) {
// // //     return created[0].id;
// // //   }

// // //   const existingAfterConflict = await db
// // //     .select({
// // //       id: organisations.id,
// // //     })
// // //     .from(organisations)
// // //     .where(eq(organisations.name, name))
// // //     .limit(1);

// // //   if (existingAfterConflict.length === 0) {
// // //     throw new Error("Failed to create or find organisation");
// // //   }

// // //   return existingAfterConflict[0].id;
// // // }

// // // export async function insertTender(
// // //   item: ParsedTenderForDb,
// // //   externalKey: string
// // // ) {
// // //   if (item.isCorrigendum) {
// // //     throw new Error("Corrigenda are not supported by insertTender yet");
// // //   }

// // //   if (!item.organisationChain) {
// // //     throw new Error("Organisation chain is required");
// // //   }

// // //   const organisationId = await findOrCreateOrganisation(
// // //     item.organisationChain
// // //   );

// // //   const inserted = await db
// // //     .insert(tenders)
// // //     .values({
// // //       organisationId,
// // //       externalKey,
// // //       title: item.title,
// // //       tenderNumber: item.tenderNumber,
// // //       closingDate: parsePortalDate(item.closingDate),
// // //       sourceUrl: null,
// // //       isCorrigendum: false,
// // //       rawData: {
// // //         tenderId: item.tenderId,
// // //         tenderNumber: item.tenderNumber,
// // //         title: item.title,
// // //         closingDate: item.closingDate,
// // //         bidOpeningDate: item.bidOpeningDate,
// // //         organisationChain: item.organisationChain,
// // //       },
// // //     })
// // //     .onConflictDoNothing({
// // //       target: tenders.externalKey,
// // //     })
// // //     .returning();

// // //   if (inserted.length === 0) {
// // //     return {
// // //       inserted: false,
// // //       tender: null,
// // //     };
// // //   }

// // //   return {
// // //     inserted: true,
// // //     tender: inserted[0],
// // //   };
// // // }


// // import { db } from "@/db";
// // import { organisations, tenders } from "@/db/schema";
// // import { eq, inArray } from "drizzle-orm";

// // export type ParsedTenderForDb = {
// //   title: string;
// //   tenderNumber: string;
// //   closingDate: string | null;
// //   bidOpeningDate: string | null;
// //   sourceUrl: string | null;
// //   isCorrigendum: boolean;
// //   tenderId: string | null;
// //   organisationChain: string | null;
// // };

// // /* ---------------------------------------------------------
// //    PORTAL DATE → JS DATE
// // --------------------------------------------------------- */

// // export function parsePortalDate(
// //   value: string | null
// // ): Date | null {
// //   if (!value) return null;

// //   const match = value
// //     .trim()
// //     .match(
// //       /^(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
// //     );

// //   if (!match) {
// //     console.warn(
// //       "Invalid portal date:",
// //       value
// //     );

// //     return null;
// //   }

// //   const [
// //     ,
// //     day,
// //     monthName,
// //     year,
// //     hourRaw,
// //     minute,
// //     ampm,
// //   ] = match;

// //   const months: Record<
// //     string,
// //     string
// //   > = {
// //     jan: "01",
// //     feb: "02",
// //     mar: "03",
// //     apr: "04",
// //     may: "05",
// //     jun: "06",
// //     jul: "07",
// //     aug: "08",
// //     sep: "09",
// //     oct: "10",
// //     nov: "11",
// //     dec: "12",
// //   };

// //   const month =
// //     months[monthName.toLowerCase()];

// //   if (!month) return null;

// //   let hour = Number(hourRaw);

// //   if (
// //     ampm.toUpperCase() === "PM" &&
// //     hour !== 12
// //   ) {
// //     hour += 12;
// //   }

// //   if (
// //     ampm.toUpperCase() === "AM" &&
// //     hour === 12
// //   ) {
// //     hour = 0;
// //   }

// //   const formattedHour =
// //     String(hour).padStart(2, "0");

// //   const formattedDay =
// //     String(day).padStart(2, "0");

// //   return new Date(
// //     `${year}-${month}-${formattedDay}T${formattedHour}:${minute}:00+05:30`
// //   );
// // }

// // /* ---------------------------------------------------------
// //    EXISTING TENDER KEYS
// // --------------------------------------------------------- */

// // export async function getExistingTenderKeys(
// //   externalKeys: string[]
// // ): Promise<Set<string>> {
// //   if (externalKeys.length === 0) {
// //     return new Set();
// //   }

// //   const result = await db
// //     .select({
// //       externalKey: tenders.externalKey,
// //     })
// //     .from(tenders)
// //     .where(
// //       inArray(
// //         tenders.externalKey,
// //         externalKeys
// //       )
// //     );

// //   return new Set(
// //     result.map(
// //       (item) => item.externalKey
// //     )
// //   );
// // }

// // /* ---------------------------------------------------------
// //    ORGANISATION
// // --------------------------------------------------------- */

// // export async function findOrCreateOrganisation(
// //   organisationName: string
// // ): Promise<number> {
// //   const name =
// //     organisationName.trim();

// //   if (!name) {
// //     throw new Error(
// //       "Organisation name is required"
// //     );
// //   }

// //   const existing = await db
// //     .select({
// //       id: organisations.id,
// //     })
// //     .from(organisations)
// //     .where(
// //       eq(
// //         organisations.name,
// //         name
// //       )
// //     )
// //     .limit(1);

// //   if (existing.length > 0) {
// //     return existing[0].id;
// //   }

// //   const created = await db
// //     .insert(organisations)
// //     .values({
// //       name,
// //     })
// //     .onConflictDoNothing({
// //       target:
// //         organisations.name,
// //     })
// //     .returning({
// //       id: organisations.id,
// //     });

// //   if (created.length > 0) {
// //     return created[0].id;
// //   }

// //   const existingAfterConflict =
// //     await db
// //       .select({
// //         id: organisations.id,
// //       })
// //       .from(organisations)
// //       .where(
// //         eq(
// //           organisations.name,
// //           name
// //         )
// //       )
// //       .limit(1);

// //   if (
// //     existingAfterConflict.length === 0
// //   ) {
// //     throw new Error(
// //       "Failed to create or find organisation"
// //     );
// //   }

// //   return existingAfterConflict[0].id;
// // }

// // /* ---------------------------------------------------------
// //    INSERT TENDER
// // --------------------------------------------------------- */

// // export async function insertTender(
// //   item: ParsedTenderForDb,
// //   externalKey: string
// // ) {
// //   if (item.isCorrigendum) {
// //     throw new Error(
// //       "Corrigenda are not supported by insertTender yet"
// //     );
// //   }

// //   if (!item.organisationChain) {
// //     throw new Error(
// //       "Organisation chain is required"
// //     );
// //   }

// //   if (!item.tenderNumber) {
// //     throw new Error(
// //       "Tender reference number is required"
// //     );
// //   }

// //   const organisationId =
// //     await findOrCreateOrganisation(
// //       item.organisationChain
// //     );

// //   const closingDate =
// //     parsePortalDate(
// //       item.closingDate
// //     );

// //   const bidOpeningDate =
// //     parsePortalDate(
// //       item.bidOpeningDate
// //     );

// //   const inserted = await db
// //     .insert(tenders)
// //     .values({
// //       organisationId,

// //       externalKey,

// //       title: item.title,

// //       tenderNumber:
// //         item.tenderNumber,

// //       closingDate,

// //       sourceUrl:
// //         item.sourceUrl,

// //       isCorrigendum: false,

// //       rawData: {
// //         tenderId:
// //           item.tenderId,

// //         tenderNumber:
// //           item.tenderNumber,

// //         title:
// //           item.title,

// //         closingDate:
// //           item.closingDate,

// //         bidOpeningDate:
// //           item.bidOpeningDate,

// //         organisationChain:
// //           item.organisationChain,

// //         sourceUrl:
// //           item.sourceUrl,
// //       },
// //     })
// //     .onConflictDoNothing({
// //       target:
// //         tenders.externalKey,
// //     })
// //     .returning();

// //   if (inserted.length === 0) {
// //     return {
// //       inserted: false,
// //       tender: null,
// //     };
// //   }

// //   return {
// //     inserted: true,
// //     tender: inserted[0],
// //   };
// // }


// import { db } from "@/db";
// import { organisations, tenders } from "@/db/schema";
// import { eq, inArray } from "drizzle-orm";

// // ============================================================
// // TYPE
// // ============================================================

// export type ParsedTenderForDb = {
//   title: string;
//   tenderNumber: string;
//   closingDate: string | null;
//   bidOpeningDate: string | null;
//   sourceUrl: string | null;
//   isCorrigendum: boolean;
//   tenderId: string | null;
//   organisationChain: string | null;
// };

// // ============================================================
// // PORTAL DATE -> JS DATE
// // ============================================================

// export function parsePortalDate(
//   value: string | null
// ): Date | null {
//   if (!value) {
//     return null;
//   }

//   const match = value
//     .trim()
//     .match(
//       /^(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
//     );

//   if (!match) {
//     return null;
//   }

//   const [
//     ,
//     day,
//     monthName,
//     year,
//     hourRaw,
//     minute,
//     ampm,
//   ] = match;

//   const months: Record<string, string> = {
//     jan: "01",
//     feb: "02",
//     mar: "03",
//     apr: "04",
//     may: "05",
//     jun: "06",
//     jul: "07",
//     aug: "08",
//     sep: "09",
//     oct: "10",
//     nov: "11",
//     dec: "12",
//   };

//   const month = months[monthName.toLowerCase()];

//   if (!month) {
//     return null;
//   }

//   let hour = Number(hourRaw);

//   if (
//     ampm.toUpperCase() === "PM" &&
//     hour !== 12
//   ) {
//     hour += 12;
//   }

//   if (
//     ampm.toUpperCase() === "AM" &&
//     hour === 12
//   ) {
//     hour = 0;
//   }

//   const formattedHour = String(hour).padStart(2, "0");
//   const formattedDay = String(day).padStart(2, "0");

//   // Odisha portal dates are treated as IST (+05:30)
//   return new Date(
//     `${year}-${month}-${formattedDay}T${formattedHour}:${minute}:00+05:30`
//   );
// }

// // ============================================================
// // EXISTING EXTERNAL KEYS
// // ============================================================

// export async function getExistingTenderKeys(
//   externalKeys: string[]
// ): Promise<Set<string>> {
//   if (externalKeys.length === 0) {
//     return new Set();
//   }

//   const result = await db
//     .select({
//       externalKey: tenders.externalKey,
//     })
//     .from(tenders)
//     .where(
//       inArray(
//         tenders.externalKey,
//         externalKeys
//       )
//     );

//   return new Set(
//     result.map(
//       (item) => item.externalKey
//     )
//   );
// }

// // ============================================================
// // FIND OR CREATE ORGANISATION
// // ============================================================

// export async function findOrCreateOrganisation(
//   organisationName: string
// ): Promise<number> {
//   const name = organisationName.trim();

//   if (!name) {
//     throw new Error(
//       "Organisation name is required"
//     );
//   }

//   // ----------------------------------------------------------
//   // Find existing organisation
//   // ----------------------------------------------------------

//   const existing = await db
//     .select({
//       id: organisations.id,
//     })
//     .from(organisations)
//     .where(
//       eq(
//         organisations.name,
//         name
//       )
//     )
//     .limit(1);

//   if (existing.length > 0) {
//     return existing[0].id;
//   }

//   // ----------------------------------------------------------
//   // Create organisation
//   // ----------------------------------------------------------

//   const created = await db
//     .insert(organisations)
//     .values({
//       name,
//     })
//     .onConflictDoNothing({
//       target: organisations.name,
//     })
//     .returning({
//       id: organisations.id,
//     });

//   if (created.length > 0) {
//     return created[0].id;
//   }

//   // ----------------------------------------------------------
//   // Conflict happened -> fetch again
//   // ----------------------------------------------------------

//   const existingAfterConflict = await db
//     .select({
//       id: organisations.id,
//     })
//     .from(organisations)
//     .where(
//       eq(
//         organisations.name,
//         name
//       )
//     )
//     .limit(1);

//   if (
//     existingAfterConflict.length === 0
//   ) {
//     throw new Error(
//       "Failed to create or find organisation"
//     );
//   }

//   return existingAfterConflict[0].id;
// }

// // ============================================================
// // UPDATE EXISTING TENDER
// // ============================================================

// export async function updateTender(
//   tenderId: number,
//   item: ParsedTenderForDb
// ) {
//   // ----------------------------------------------------------
//   // Validate
//   // ----------------------------------------------------------

//   if (!item.title) {
//     throw new Error(
//       "Tender title is required"
//     );
//   }

//   if (!item.tenderNumber) {
//     throw new Error(
//       "Tender reference number is required"
//     );
//   }

//   // ----------------------------------------------------------
//   // Organisation
//   // ----------------------------------------------------------

//   let organisationId: number | undefined;

//   if (item.organisationChain) {
//     organisationId =
//       await findOrCreateOrganisation(
//         item.organisationChain
//       );
//   }

//   // ----------------------------------------------------------
//   // Update data
//   // ----------------------------------------------------------

//   const updateData: {
//     title: string;
//     tenderNumber: string;
//     closingDate: Date | null;
//     sourceUrl: string | null;
//     rawData: Record<string, unknown>;
//     organisationId?: number;
//   } = {
//     title: item.title,
//     tenderNumber: item.tenderNumber,

//     closingDate: parsePortalDate(
//       item.closingDate
//     ),

//     sourceUrl: item.sourceUrl,

//     rawData: {
//       tenderId: item.tenderId,
//       tenderNumber: item.tenderNumber,
//       title: item.title,
//       closingDate: item.closingDate,
//       bidOpeningDate: item.bidOpeningDate,
//       organisationChain:
//         item.organisationChain,
//       sourceUrl: item.sourceUrl,
//     },
//   };

//   if (
//     organisationId !== undefined
//   ) {
//     updateData.organisationId =
//       organisationId;
//   }

//   // ----------------------------------------------------------
//   // Update database
//   // ----------------------------------------------------------

//   const updated = await db
//     .update(tenders)
//     .set(updateData)
//     .where(
//       eq(
//         tenders.id,
//         tenderId
//       )
//     )
//     .returning();

//   if (updated.length === 0) {
//     return {
//       updated: false,
//       tender: null,
//     };
//   }

//   return {
//     updated: true,
//     tender: updated[0],
//   };
// }

// // ============================================================
// // INSERT NEW TENDER
// // ============================================================

// // export async function insertTender(
// //   item: ParsedTenderForDb,
// //   externalKey: string
// // ) {
// //   // ----------------------------------------------------------
// //   // Corrigenda are not handled yet
// //   // ----------------------------------------------------------

// //   if (item.isCorrigendum) {
// //     throw new Error(
// //       "Corrigenda are not supported by insertTender yet"
// //     );
// //   }

// //   // ----------------------------------------------------------
// //   // Validation
// //   // ----------------------------------------------------------

// //   if (!item.organisationChain) {
// //     throw new Error(
// //       "Organisation chain is required"
// //     );
// //   }

// //   if (!item.tenderNumber) {
// //     throw new Error(
// //       "Tender reference number is required"
// //     );
// //   }

// //   // ----------------------------------------------------------
// //   // Organisation
// //   // ----------------------------------------------------------

// //   const organisationId =
// //     await findOrCreateOrganisation(
// //       item.organisationChain
// //     );

// //   // ----------------------------------------------------------
// //   // Insert
// //   // ----------------------------------------------------------

// //   const inserted = await db
// //     .insert(tenders)
// //     .values({
// //       organisationId,

// //       externalKey,

// //       title: item.title,

// //       tenderNumber:
// //         item.tenderNumber,

// //       closingDate:
// //         parsePortalDate(
// //           item.closingDate
// //         ),

// //       sourceUrl:
// //         item.sourceUrl,

// //       isCorrigendum: false,

// //       rawData: {
// //         tenderId: item.tenderId,
// //         tenderNumber:
// //           item.tenderNumber,
// //         title: item.title,
// //         closingDate:
// //           item.closingDate,
// //         bidOpeningDate:
// //           item.bidOpeningDate,
// //         organisationChain:
// //           item.organisationChain,
// //         sourceUrl:
// //           item.sourceUrl,
// //       },
// //     })
// //     .onConflictDoNothing({
// //       target: tenders.externalKey,
// //     })
// //     .returning();

// //   if (inserted.length === 0) {
// //     return {
// //       inserted: false,
// //       tender: null,
// //     };
// //   }

// //   return {
// //     inserted: true,
// //     tender: inserted[0],
// //   };
// // }

// export async function insertTender(
//   item: ParsedTenderForDb,
//   externalKey: string
// ) {
//   // ----------------------------------------------------------
//   // Validation
//   // ----------------------------------------------------------

//   if (!item.title) {
//     throw new Error("Tender title is required");
//   }

//   if (!item.tenderNumber) {
//     throw new Error("Tender reference number is required");
//   }

//   if (!item.organisationChain) {
//     throw new Error("Organisation chain is required");
//   }

//   // ----------------------------------------------------------
//   // Organisation
//   // ----------------------------------------------------------

//   const organisationId = await findOrCreateOrganisation(
//     item.organisationChain
//   );

//   // ----------------------------------------------------------
//   // Dates
//   // ----------------------------------------------------------

//   const closingDate = parsePortalDate(item.closingDate);

//   // ----------------------------------------------------------
//   // Insert
//   // ----------------------------------------------------------

//   const inserted = await db
//     .insert(tenders)
//     .values({
//       organisationId,
//       externalKey,
//       title: item.title,
//       tenderNumber: item.tenderNumber,
//       closingDate,
//       sourceUrl: item.sourceUrl,
//       isCorrigendum: item.isCorrigendum,

//       rawData: {
//         tenderId: item.tenderId,
//         tenderNumber: item.tenderNumber,
//         title: item.title,
//         closingDate: item.closingDate,
//         bidOpeningDate: item.bidOpeningDate,
//         organisationChain: item.organisationChain,
//         sourceUrl: item.sourceUrl,
//         isCorrigendum: item.isCorrigendum,
//       },
//     })
//     .onConflictDoNothing({
//       target: tenders.externalKey,
//     })
//     .returning();

//   // ----------------------------------------------------------
//   // Already exists
//   // ----------------------------------------------------------

//   if (inserted.length === 0) {
//     return {
//       inserted: false,
//       tender: null,
//     };
//   }

//   // ----------------------------------------------------------
//   // Successfully inserted
//   // ----------------------------------------------------------

//   return {
//     inserted: true,
//     tender: inserted[0],
//   };
// }


// // ============================================================
// // UPSERT / REPAIR TENDER
// // ============================================================
// //
// // IMPORTANT:
// //
// // If the tender already exists using the same externalKey,
// // update its information.
// //
// // If it does not exist,
// // create a new record.
// //
// // This prevents old incorrect data from remaining unchanged.
// // ============================================================

// export async function upsertTender(
//   item: ParsedTenderForDb,
//   externalKey: string
// ) {
//   // ----------------------------------------------------------
//   // Corrigenda
//   // ----------------------------------------------------------

//   if (item.isCorrigendum) {
//     throw new Error(
//       "Corrigenda are not supported by upsertTender yet"
//     );
//   }

//   // ----------------------------------------------------------
//   // Validation
//   // ----------------------------------------------------------

//   if (!item.title) {
//     throw new Error(
//       "Tender title is required"
//     );
//   }

//   if (!item.tenderNumber) {
//     throw new Error(
//       "Tender reference number is required"
//     );
//   }

//   if (!item.organisationChain) {
//     throw new Error(
//       "Organisation chain is required"
//     );
//   }

//   // ----------------------------------------------------------
//   // Organisation
//   // ----------------------------------------------------------

//   const organisationId =
//     await findOrCreateOrganisation(
//       item.organisationChain
//     );

//   // ----------------------------------------------------------
//   // Check existing tender
//   // ----------------------------------------------------------

//   const existingByExternalKey =
//     await db
//       .select()
//       .from(tenders)
//       .where(
//         eq(
//           tenders.externalKey,
//           externalKey
//         )
//       )
//       .limit(1);

//   // ==========================================================
//   // EXISTING TENDER -> UPDATE
//   // ==========================================================

//   if (
//     existingByExternalKey.length > 0
//   ) {
//     const existing =
//       existingByExternalKey[0];

//     const updated = await db
//       .update(tenders)
//       .set({
//         organisationId,

//         title:
//           item.title,

//         tenderNumber:
//           item.tenderNumber,

//         closingDate:
//           parsePortalDate(
//             item.closingDate
//           ),

//         sourceUrl:
//           item.sourceUrl,

//         isCorrigendum: false,

//         rawData: {
//           tenderId:
//             item.tenderId,

//           tenderNumber:
//             item.tenderNumber,

//           title:
//             item.title,

//           closingDate:
//             item.closingDate,

//           bidOpeningDate:
//             item.bidOpeningDate,

//           organisationChain:
//             item.organisationChain,

//           sourceUrl:
//             item.sourceUrl,
//         },
//       })
//       .where(
//         eq(
//           tenders.id,
//           existing.id
//         )
//       )
//       .returning();

//     return {
//       inserted: false,
//       updated: true,
//       tender:
//         updated[0] ?? null,
//     };
//   }

//   // ==========================================================
//   // NEW TENDER -> INSERT
//   // ==========================================================

//   const inserted = await db
//     .insert(tenders)
//     .values({
//       organisationId,

//       externalKey,

//       title:
//         item.title,

//       tenderNumber:
//         item.tenderNumber,
//       closingDate:
//         parsePortalDate(
//           item.closingDate
//         ),

//       sourceUrl:
//         item.sourceUrl,

//       isCorrigendum: false,

//       rawData: {
//         tenderId:
//           item.tenderId,

//         tenderNumber:
//           item.tenderNumber,

//         title:
//           item.title,

//         closingDate:
//           item.closingDate,

//         bidOpeningDate:
//           item.bidOpeningDate,

//         organisationChain:
//           item.organisationChain,

//         sourceUrl:
//           item.sourceUrl,
//       },
//     })
//     .onConflictDoNothing({
//       target:
//         tenders.externalKey,
//     })
//     .returning();

//   // ----------------------------------------------------------
//   // Another process inserted it
//   // ----------------------------------------------------------

//   if (inserted.length === 0) {
//     return {
//       inserted: false,
//       updated: false,
//       tender: null,
//     };
//   }

//   // ----------------------------------------------------------
//   // Successfully inserted
//   // ----------------------------------------------------------

//   return {
//     inserted: true,
//     updated: false,
//     tender:
//       inserted[0],
//   };
// }


import { db } from "@/db";
import { organisations, tenders } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// ============================================================
// TYPE
// ============================================================

export type ParsedTenderForDb = {
  title: string;
  tenderNumber: string;
  closingDate: string | null;
  bidOpeningDate: string | null;
  sourceUrl: string | null;
  isCorrigendum: boolean;
  tenderId: string | null;
  organisationChain: string | null;
};

// ============================================================
// PORTAL DATE -> JS DATE
// Odisha portal uses IST (+05:30)
// Example:
// 17-Sep-2026 05:00 PM
// ============================================================

export function parsePortalDate(
  value: string | null
): Date | null {
  if (!value) {
    return null;
  }

  const match = value
    .trim()
    .match(
      /^(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (!match) {
    console.warn("Invalid portal date:", value);
    return null;
  }

  const [
    ,
    day,
    monthName,
    year,
    hourRaw,
    minute,
    ampm,
  ] = match;

  const months: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const month = months[monthName.toLowerCase()];

  if (!month) {
    console.warn("Invalid month:", monthName);
    return null;
  }

  let hour = Number(hourRaw);

  if (ampm.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  }

  if (ampm.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  const formattedHour = String(hour).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return new Date(
    `${year}-${month}-${formattedDay}T${formattedHour}:${minute}:00+05:30`
  );
}

// ============================================================
// EXISTING EXTERNAL KEYS
// ============================================================

export async function getExistingTenderKeys(
  externalKeys: string[]
): Promise<Set<string>> {
  if (externalKeys.length === 0) {
    return new Set();
  }

  const result = await db
    .select({
      externalKey: tenders.externalKey,
    })
    .from(tenders)
    .where(
      inArray(
        tenders.externalKey,
        externalKeys
      )
    );

  return new Set(
    result.map(
      (item) => item.externalKey
    )
  );
}

// ============================================================
// FIND OR CREATE ORGANISATION
// ============================================================

export async function findOrCreateOrganisation(
  organisationName: string
): Promise<number> {
  const name = organisationName.trim();

  if (!name) {
    throw new Error(
      "Organisation name is required"
    );
  }

  // ----------------------------------------------------------
  // Find existing organisation
  // ----------------------------------------------------------

  const existing = await db
    .select({
      id: organisations.id,
    })
    .from(organisations)
    .where(
      eq(
        organisations.name,
        name
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  // ----------------------------------------------------------
  // Create organisation
  // ----------------------------------------------------------

  const created = await db
    .insert(organisations)
    .values({
      name,
    })
    .onConflictDoNothing({
      target: organisations.name,
    })
    .returning({
      id: organisations.id,
    });

  if (created.length > 0) {
    return created[0].id;
  }

  // ----------------------------------------------------------
  // Conflict happened -> fetch again
  // ----------------------------------------------------------

  const existingAfterConflict = await db
    .select({
      id: organisations.id,
    })
    .from(organisations)
    .where(
      eq(
        organisations.name,
        name
      )
    )
    .limit(1);

  if (
    existingAfterConflict.length === 0
  ) {
    throw new Error(
      "Failed to create or find organisation"
    );
  }

  return existingAfterConflict[0].id;
}

// ============================================================
// UPDATE EXISTING TENDER
// ============================================================

export async function updateTender(
  tenderId: number,
  item: ParsedTenderForDb
) {
  // ----------------------------------------------------------
  // Validation
  // ----------------------------------------------------------

  if (!item.title) {
    throw new Error(
      "Tender title is required"
    );
  }

  if (!item.tenderNumber) {
    throw new Error(
      "Tender reference number is required"
    );
  }

  // ----------------------------------------------------------
  // Organisation
  // ----------------------------------------------------------

  let organisationId: number | undefined;

  if (item.organisationChain) {
    organisationId =
      await findOrCreateOrganisation(
        item.organisationChain
      );
  }

  // ----------------------------------------------------------
  // Update data
  // ----------------------------------------------------------

  const updateData: {
    title: string;
    tenderNumber: string;
    closingDate: Date | null;
    sourceUrl: string | null;
    rawData: Record<string, unknown>;
    organisationId?: number;
  } = {
    title: item.title,

    tenderNumber:
      item.tenderNumber,

    closingDate:
      parsePortalDate(
        item.closingDate
      ),

    sourceUrl:
      item.sourceUrl,

    rawData: {
      tenderId:
        item.tenderId,

      tenderNumber:
        item.tenderNumber,

      title:
        item.title,

      closingDate:
        item.closingDate,

      bidOpeningDate:
        item.bidOpeningDate,

      organisationChain:
        item.organisationChain,

      sourceUrl:
        item.sourceUrl,

      isCorrigendum:
        item.isCorrigendum,
    },
  };

  if (
    organisationId !== undefined
  ) {
    updateData.organisationId =
      organisationId;
  }

  // ----------------------------------------------------------
  // Update database
  // ----------------------------------------------------------

  const updated = await db
    .update(tenders)
    .set(updateData)
    .where(
      eq(
        tenders.id,
        tenderId
      )
    )
    .returning();

  if (updated.length === 0) {
    return {
      updated: false,
      tender: null,
    };
  }

  return {
    updated: true,
    tender: updated[0],
  };
}

// ============================================================
// INSERT NEW TENDER / CORRIGENDUM
// ============================================================

export async function insertTender(
  item: ParsedTenderForDb,
  externalKey: string
) {
  // ----------------------------------------------------------
  // Validation
  // ----------------------------------------------------------

  if (!item.title) {
    throw new Error(
      "Tender title is required"
    );
  }

  if (!item.tenderNumber) {
    throw new Error(
      "Tender reference number is required"
    );
  }

  if (!item.organisationChain) {
    throw new Error(
      "Organisation chain is required"
    );
  }

  if (!externalKey) {
    throw new Error(
      "External key is required"
    );
  }

  // ----------------------------------------------------------
  // Organisation
  // ----------------------------------------------------------

  const organisationId =
    await findOrCreateOrganisation(
      item.organisationChain
    );

  // ----------------------------------------------------------
  // Dates
  // ----------------------------------------------------------

  const closingDate =
    parsePortalDate(
      item.closingDate
    );

  // ----------------------------------------------------------
  // Insert
  // ----------------------------------------------------------

  const inserted = await db
    .insert(tenders)
    .values({
      organisationId,

      externalKey,

      title:
        item.title,

      tenderNumber:
        item.tenderNumber,

      closingDate,

      sourceUrl:
        item.sourceUrl,

      isCorrigendum:
        item.isCorrigendum,

      rawData: {
        tenderId:
          item.tenderId,

        tenderNumber:
          item.tenderNumber,

        title:
          item.title,

        closingDate:
          item.closingDate,

        bidOpeningDate:
          item.bidOpeningDate,

        organisationChain:
          item.organisationChain,

        sourceUrl:
          item.sourceUrl,

        isCorrigendum:
          item.isCorrigendum,
      },
    })
    .onConflictDoNothing({
      target:
        tenders.externalKey,
    })
    .returning();

  // ----------------------------------------------------------
  // Already exists
  // ----------------------------------------------------------

  if (inserted.length === 0) {
    return {
      inserted: false,
      tender: null,
    };
  }

  // ----------------------------------------------------------
  // Successfully inserted
  // ----------------------------------------------------------

  return {
    inserted: true,
    tender: inserted[0],
  };
}

// ============================================================
// UPSERT / REPAIR TENDER
// ============================================================

export async function upsertTender(
  item: ParsedTenderForDb,
  externalKey: string
) {
  // ----------------------------------------------------------
  // Validation
  // ----------------------------------------------------------

  if (!item.title) {
    throw new Error(
      "Tender title is required"
    );
  }

  if (!item.tenderNumber) {
    throw new Error(
      "Tender reference number is required"
    );
  }

  if (!item.organisationChain) {
    throw new Error(
      "Organisation chain is required"
    );
  }

  if (!externalKey) {
    throw new Error(
      "External key is required"
    );
  }

  // ----------------------------------------------------------
  // Organisation
  // ----------------------------------------------------------

  const organisationId =
    await findOrCreateOrganisation(
      item.organisationChain
    );

  // ----------------------------------------------------------
  // Check existing tender
  // ----------------------------------------------------------

  const existingByExternalKey =
    await db
      .select()
      .from(tenders)
      .where(
        eq(
          tenders.externalKey,
          externalKey
        )
      )
      .limit(1);

  // ==========================================================
  // EXISTING TENDER -> UPDATE
  // ==========================================================

  if (
    existingByExternalKey.length > 0
  ) {
    const existing =
      existingByExternalKey[0];

    const updated = await db
      .update(tenders)
      .set({
        organisationId,

        title:
          item.title,

        tenderNumber:
          item.tenderNumber,

        closingDate:
          parsePortalDate(
            item.closingDate
          ),

        sourceUrl:
          item.sourceUrl,

        isCorrigendum:
          item.isCorrigendum,

        rawData: {
          tenderId:
            item.tenderId,

          tenderNumber:
            item.tenderNumber,

          title:
            item.title,

          closingDate:
            item.closingDate,

          bidOpeningDate:
            item.bidOpeningDate,

          organisationChain:
            item.organisationChain,

          sourceUrl:
            item.sourceUrl,

          isCorrigendum:
            item.isCorrigendum,
        },
      })
      .where(
        eq(
          tenders.id,
          existing.id
        )
      )
      .returning();

    return {
      inserted: false,
      updated: true,
      tender:
        updated[0] ?? null,
    };
  }

  // ==========================================================
  // NEW TENDER -> INSERT
  // ==========================================================

  const inserted = await db
    .insert(tenders)
    .values({
      organisationId,

      externalKey,

      title:
        item.title,

      tenderNumber:
        item.tenderNumber,

      closingDate:
        parsePortalDate(
          item.closingDate
        ),

      sourceUrl:
        item.sourceUrl,

      isCorrigendum:
        item.isCorrigendum,

      rawData: {
        tenderId:
          item.tenderId,

        tenderNumber:
          item.tenderNumber,

        title:
          item.title,

        closingDate:
          item.closingDate,

        bidOpeningDate:
          item.bidOpeningDate,

        organisationChain:
          item.organisationChain,

        sourceUrl:
          item.sourceUrl,

        isCorrigendum:
          item.isCorrigendum,
      },
    })
    .onConflictDoNothing({
      target:
        tenders.externalKey,
    })
    .returning();

  // ----------------------------------------------------------
  // Another process inserted it
  // ----------------------------------------------------------

  if (inserted.length === 0) {
    return {
      inserted: false,
      updated: false,
      tender: null,
    };
  }

  // ----------------------------------------------------------
  // Successfully inserted
  // ----------------------------------------------------------

  return {
    inserted: true,
    updated: false,
    tender:
      inserted[0],
  };
}

