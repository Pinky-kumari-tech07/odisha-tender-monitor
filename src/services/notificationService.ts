import { db } from "@/db";
import { notificationLogs } from "@/db/schema";

type LogNotificationInput = {
  tenderId: number;
  destination: string;
  status: "SENT" | "FAILED";
  telegramMessageId?: number | null;
  errorMessage?: string | null;
  attemptCount?: number;
};

export async function logNotification(
  data: LogNotificationInput
): Promise<void> {
  await db.insert(notificationLogs).values({
    tenderId: data.tenderId,
    destination: data.destination,
    status: data.status,
    telegramMessageId: data.telegramMessageId
      ? String(data.telegramMessageId)
      : null,
    errorMessage: data.errorMessage ?? null,
    attemptCount: data.attemptCount ?? 1,
    sentAt: data.status === "SENT" ? new Date() : null,
    updatedAt: new Date(),
  });
}