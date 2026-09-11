// import { ParsedTender } from "./parser";

// export type NormalizedTender = ParsedTender & {
//   externalKey: string;
// };

// function normalizeText(value: string): string {
//   return value
//     .replace(/^\d+\.\s*/, "")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();
// }

// function normalizeReference(value: string): string {
//   return value
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();
// }

// export function normalizeTender(
//   tender: ParsedTender
// ): NormalizedTender {
//   const normalizedTitle = normalizeText(tender.title);
//   const normalizedReference = normalizeReference(
//     tender.tenderNumber
//   );

//   const type = tender.isCorrigendum
//     ? "corrigendum"
//     : "tender";

//   const externalKey =
//     `${type}|${normalizedReference}|${normalizedTitle}`;

//   return {
//     ...tender,
//     title: tender.title.replace(/^\d+\.\s*/, "").trim(),
//     tenderNumber: tender.tenderNumber.trim(),
//     externalKey,
//   };
// }

// export function normalizeTenders(
//   tenders: ParsedTender[]
// ): NormalizedTender[] {
//   return tenders.map(normalizeTender);
// }

import type { ParsedTender } from "./parser";

export type NormalizedTender = ParsedTender & {
  externalKey: string;
};

function normalizeText(value: string): string {
  return value
    .replace(/^\d+\.\s*/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeReference(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizeTender(
  tender: ParsedTender
): NormalizedTender {
  const cleanTitle = tender.title
    .replace(/^\d+\.\s*/, "")
    .trim();

  const normalizedTitle = normalizeText(cleanTitle);
  const normalizedReference = normalizeReference(
    tender.tenderNumber
  );

  const type = tender.isCorrigendum
    ? "corrigendum"
    : "tender";

  let externalKey: string;

  // Best identity: Tender ID
  if (tender.tenderId) {
    externalKey = `${type}:${normalizeReference(
      tender.tenderId
    )}`;
  } else {
    // Fallback when Tender ID is unavailable
    externalKey = [
      type,
      normalizedReference,
      normalizedTitle,
    ].join(":");
  }

  return {
    ...tender,
    title: cleanTitle,
    tenderNumber: tender.tenderNumber.trim(),
    externalKey,
  };
}

export function normalizeTenders(
  tenders: ParsedTender[]
): NormalizedTender[] {
  return tenders.map(normalizeTender);
}