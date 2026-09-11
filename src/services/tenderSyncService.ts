import { db } from "@/db";
import { tenders } from "@/db/schema";
import { normalizeTenders } from "@/scraper/normalize";
import { findNewItems } from "@/scraper/diff";
import type { ParsedTender } from "@/scraper/parser";

export async function checkNewTenders(
  scrapedTenders: ParsedTender[]
) {
  // 1. Normalize scraped data
  const normalizedTenders =
    normalizeTenders(scrapedTenders);

  // 2. Get existing external keys from database
  const existingRows = await db
    .select({
      externalKey: tenders.externalKey,
    })
    .from(tenders);

  // 3. Convert database keys into a Set
  const existingKeys = new Set(
    existingRows.map((row) => row.externalKey)
  );

  // 4. Compare scraped data with database
  const diff = findNewItems(
    normalizedTenders,
    existingKeys
  );

  return {
    scrapedCount: normalizedTenders.length,
    existingCount: diff.existingItems.length,
    newCount: diff.newItems.length,
    newItems: diff.newItems,
    existingItems: diff.existingItems,
  };
}