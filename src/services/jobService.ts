// import { and, eq } from "drizzle-orm";
// import { db } from "@/db";
// import { jobRuns } from "@/db/schema";

// export async function isJobRunning(): Promise<boolean> {
//   const runningJobs = await db
//     .select({ id: jobRuns.id })
//     .from(jobRuns)
//     .where(eq(jobRuns.status, "RUNNING"))
//     .limit(1);

//   return runningJobs.length > 0;
// }

// export async function startJob(): Promise<number> {
//   const alreadyRunning = await isJobRunning();

//   if (alreadyRunning) {
//     throw new Error("A tender sync job is already running");
//   }

//   const result = await db
//     .insert(jobRuns)
//     .values({
//       status: "RUNNING",
//       parsedCount: 0,
//       newCount: 0,
//       notificationCount: 0,
//     })
//     .returning({ id: jobRuns.id });

//   if (result.length === 0) {
//     throw new Error("Failed to start job");
//   }

//   return result[0].id;
// }

// export async function completeJob(
//   jobId: number,
//   data: {
//     parsedCount: number;
//     newCount: number;
//     notificationCount: number;
//   }
// ): Promise<void> {
//   await db
//     .update(jobRuns)
//     .set({
//       status: "COMPLETED",
//       parsedCount: data.parsedCount,
//       newCount: data.newCount,
//       notificationCount: data.notificationCount,
//       finishedAt: new Date(),
//     })
//     .where(eq(jobRuns.id, jobId));
// }

// export async function failJob(
//   jobId: number,
//   errorType: string,
//   errorMessage: string
// ): Promise<void> {
//   await db
//     .update(jobRuns)
//     .set({
//       status: "FAILED",
//       errorType,
//       errorMessage,
//       finishedAt: new Date(),
//     })
//     .where(eq(jobRuns.id, jobId));
// }

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobRuns } from "@/db/schema";

export async function isJobRunning(): Promise<boolean> {
  const runningJobs = await db
    .select({ id: jobRuns.id })
    .from(jobRuns)
    .where(eq(jobRuns.status, "RUNNING"))
    .limit(1);

  return runningJobs.length > 0;
}

export async function startJob(): Promise<number> {
  const alreadyRunning = await isJobRunning();

  if (alreadyRunning) {
    throw new Error("A tender sync job is already running");
  }

  const result = await db
    .insert(jobRuns)
    .values({
      status: "RUNNING",
      parsedCount: 0,
      newCount: 0,
      notificationCount: 0,
    })
    .returning({
      id: jobRuns.id,
    });

  if (result.length === 0) {
    throw new Error("Failed to start job");
  }

  return result[0].id;
}

export async function completeJob(
  jobId: number,
  data: {
    parsedCount: number;
    newCount: number;
    notificationCount: number;
  }
): Promise<void> {
  await db
    .update(jobRuns)
    .set({
      status: "COMPLETED",
      parsedCount: data.parsedCount,
      newCount: data.newCount,
      notificationCount: data.notificationCount,
      finishedAt: new Date(),
    })
    .where(eq(jobRuns.id, jobId));
}

export async function failJob(
  jobId: number,
  errorType: string,
  errorMessage: string
): Promise<void> {
  await db
    .update(jobRuns)
    .set({
      status: "FAILED",
      errorType,
      errorMessage,
      finishedAt: new Date(),
    })
    .where(eq(jobRuns.id, jobId));
}