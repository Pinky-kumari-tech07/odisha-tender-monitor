// import {
//   pgTable,
//   serial,
//   varchar,
//   text,
//   timestamp,
//   integer,
//   boolean,
//   jsonb,
// } from "drizzle-orm/pg-core";

// /* =========================
//    ORGANISATIONS
// ========================= */

// export const organisations = pgTable("organisations", {
//   id: serial("id").primaryKey(),

//   name: varchar("name", { length: 255 }).notNull().unique(),

//   tenderCount: integer("tender_count").default(0).notNull(),

//   lastScrapedAt: timestamp("last_scraped_at", {
//     withTimezone: true,
//   }),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),

//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),
// });

// /* =========================
//    TENDERS
// ========================= */

// export const tenders = pgTable("tenders", {
//   id: serial("id").primaryKey(),

//   organisationId: integer("organisation_id")
//     .notNull()
//     .references(() => organisations.id),

//   externalKey: varchar("external_key", {
//     length: 500,
//   })
//     .notNull()
//     .unique(),

//   title: text("title").notNull(),

//   tenderNumber: varchar("tender_number", {
//     length: 255,
//   }),

//   status: varchar("status", {
//     length: 100,
//   }),

//   publishedDate: timestamp("published_date", {
//     withTimezone: true,
//   }),

//   closingDate: timestamp("closing_date", {
//     withTimezone: true,
//   }),

//   sourceUrl: text("source_url"),

//   isCorrigendum: boolean("is_corrigendum")
//     .default(false)
//     .notNull(),

//   rawData: jsonb("raw_data"),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),

//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),
// });

// /* =========================
//    SNAPSHOTS
// ========================= */

// export const snapshots = pgTable("snapshots", {
//   id: serial("id").primaryKey(),

//   organisationId: integer("organisation_id")
//     .notNull()
//     .references(() => organisations.id),

//   capturedAt: timestamp("captured_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),

//   tenderCount: integer("tender_count").default(0).notNull(),

//   data: jsonb("data").notNull(),
// });

// /* =========================
//    JOB RUNS
// ========================= */

// export const jobRuns = pgTable("job_runs", {
//   id: serial("id").primaryKey(),

//   status: varchar("status", {
//     length: 50,
//   }).notNull(),

//   startedAt: timestamp("started_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),

//   finishedAt: timestamp("finished_at", {
//     withTimezone: true,
//   }),

//   parsedCount: integer("parsed_count").default(0).notNull(),

//   newCount: integer("new_count").default(0).notNull(),

//   notificationCount: integer("notification_count")
//     .default(0)
//     .notNull(),

//   errorType: varchar("error_type", {
//     length: 100,
//   }),

//   errorMessage: text("error_message"),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),
// });

// /* =========================
//    NOTIFICATION LOGS
// ========================= */

// export const notificationLogs = pgTable("notification_logs", {
//   id: serial("id").primaryKey(),

//   tenderId: integer("tender_id")
//     .notNull()
//     .references(() => tenders.id),

//   destination: varchar("destination", {
//     length: 255,
//   }).notNull(),

//   status: varchar("status", {
//     length: 50,
//   }).notNull(),

//   telegramMessageId: varchar("telegram_message_id", {
//     length: 255,
//   }),

//   errorMessage: text("error_message"),

//   attemptCount: integer("attempt_count")
//     .default(0)
//     .notNull(),

//   sentAt: timestamp("sent_at", {
//     withTimezone: true,
//   }),

//   createdAt: timestamp("created_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),

//   updatedAt: timestamp("updated_at", {
//     withTimezone: true,
//   })
//     .defaultNow()
//     .notNull(),
// });

import { sql } from "drizzle-orm";

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* =========================
   ORGANISATIONS
========================= */

export const organisations = pgTable("organisations", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 })
    .notNull()
    .unique(),

  tenderCount: integer("tender_count")
    .default(0)
    .notNull(),

  lastScrapedAt: timestamp("last_scraped_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* =========================
   TENDERS
========================= */

export const tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),

  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisations.id),

  externalKey: varchar("external_key", {
    length: 500,
  })
    .notNull()
    .unique(),

  title: text("title").notNull(),

  tenderNumber: varchar("tender_number", {
    length: 255,
  }),

  status: varchar("status", {
    length: 100,
  }),

  publishedDate: timestamp("published_date", {
    withTimezone: true,
  }),

  closingDate: timestamp("closing_date", {
    withTimezone: true,
  }),

  sourceUrl: text("source_url"),

  isCorrigendum: boolean("is_corrigendum")
    .default(false)
    .notNull(),

  rawData: jsonb("raw_data"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/* =========================
   SNAPSHOTS
========================= */

export const snapshots = pgTable("snapshots", {
  id: serial("id").primaryKey(),

  organisationId: integer("organisation_id")
    .notNull()
    .references(() => organisations.id),

  capturedAt: timestamp("captured_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  tenderCount: integer("tender_count")
    .default(0)
    .notNull(),

  data: jsonb("data").notNull(),
});

/* =========================
   JOB RUNS
========================= */

export const jobRuns = pgTable(
  "job_runs",
  {
    id: serial("id").primaryKey(),

    status: varchar("status", {
      length: 50,
    }).notNull(),

    startedAt: timestamp("started_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    finishedAt: timestamp("finished_at", {
      withTimezone: true,
    }),

    parsedCount: integer("parsed_count")
      .default(0)
      .notNull(),

    newCount: integer("new_count")
      .default(0)
      .notNull(),

    notificationCount: integer(
      "notification_count"
    )
      .default(0)
      .notNull(),

    errorType: varchar("error_type", {
      length: 100,
    }),

    errorMessage: text("error_message"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    uniqueIndex("job_runs_one_running_idx")
      .on(table.status)
      .where(
        sql`${table.status} = 'RUNNING'`
      ),
  ]
);

/* =========================
   NOTIFICATION LOGS
========================= */

export const notificationLogs = pgTable(
  "notification_logs",
  {
    id: serial("id").primaryKey(),

    tenderId: integer("tender_id")
      .notNull()
      .references(() => tenders.id),

    destination: varchar("destination", {
      length: 255,
    }).notNull(),

    status: varchar("status", {
      length: 50,
    }).notNull(),

    telegramMessageId: varchar(
      "telegram_message_id",
      {
        length: 255,
      }
    ),

    errorMessage: text("error_message"),

    attemptCount: integer("attempt_count")
      .default(0)
      .notNull(),

    sentAt: timestamp("sent_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  }
);