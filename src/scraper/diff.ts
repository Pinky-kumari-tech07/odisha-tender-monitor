// import { eq } from "drizzle-orm";
// import { db } from "@/db";
// import { tenders } from "@/db/schema";
// import { NormalizedTender } from "./normalize";

// export async function findNewTenders(
//   parsedTenders: NormalizedTender[]
// ): Promise<NormalizedTender[]> {
//   const newTenders: NormalizedTender[] = [];

//   for (const tender of parsedTenders) {
//     const existing = await db
//       .select({ id: tenders.id })
//       .from(tenders)
//       .where(eq(tenders.externalKey, tender.externalKey))
//       .limit(1);

//     if (existing.length === 0) {
//       newTenders.push(tender);
//     }
//   }

//   return newTenders;
// }

export type DiffResult<T> = {
  newItems: T[];
  existingItems: T[];
};

export function normalizeKey(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function createExternalKey(item: {
  tenderId?: string | null;
  tenderNumber: string;
  title: string;
  closingDate?: string | null;
  bidOpeningDate?: string | null;
  isCorrigendum: boolean;
}): string {
  // Best and most stable identity for normal tenders
  if (item.tenderId && !item.isCorrigendum) {
    return `tender:${normalizeKey(item.tenderId)}`;
  }

  // Fallback identity for corrigenda or items without Tender ID
  return [
    item.isCorrigendum ? "corrigendum" : "tender",
    normalizeKey(item.tenderNumber),
    normalizeKey(item.title),
    normalizeKey(item.closingDate),
    normalizeKey(item.bidOpeningDate),
  ].join(":");
}

export function findNewItems<T extends { externalKey: string }>(
  scrapedItems: T[],
  existingKeys: Set<string>
): DiffResult<T> {
  const newItems: T[] = [];
  const existingItems: T[] = [];

  for (const item of scrapedItems) {
    if (existingKeys.has(item.externalKey)) {
      existingItems.push(item);
    } else {
      newItems.push(item);
    }
  }

  return {
    newItems,
    existingItems,
  };
}