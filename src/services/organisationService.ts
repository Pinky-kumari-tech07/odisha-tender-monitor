import { eq } from "drizzle-orm";
import { db } from "@/db";
import { organisations } from "@/db/schema";

export async function findOrCreateOrganisation(
  organisationName: string
): Promise<number> {
  const name = organisationName.trim();

  if (!name) {
    throw new Error("Organisation name is required");
  }

  // Check if organisation already exists
  const existing = await db
    .select({
      id: organisations.id,
    })
    .from(organisations)
    .where(eq(organisations.name, name))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  // Create new organisation
  const created = await db
    .insert(organisations)
    .values({
      name,
    })
    .returning({
      id: organisations.id,
    });

  return created[0].id;
}