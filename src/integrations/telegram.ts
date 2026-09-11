// type TelegramResponse = {
//   ok: boolean;
//   result?: {
//     message_id: number;
//   };
//   description?: string;
// };

// type TelegramTender = {
//   title: string;
//   tenderNumber: string | null;
//   tenderId: string | null;
//   organisation: string | null;
//   closingDate: string | null;
//   bidOpeningDate: string | null;
//   sourceUrl: string | null;
// };

// function getTelegramConfig() {
//   const token = process.env.TELEGRAM_BOT_TOKEN;
//   const chatId = process.env.TELEGRAM_CHAT_ID;

//   if (!token) {
//     throw new Error("TELEGRAM_BOT_TOKEN is not defined");
//   }

//   if (!chatId) {
//     throw new Error("TELEGRAM_CHAT_ID is not defined");
//   }

//   return { token, chatId };
// }

// function escapeTelegramHtml(value: string | null | undefined): string {
//   return (value ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");
// }

// export async function sendTelegramMessage(
//   message: string
// ): Promise<number> {
//   const { token, chatId } = getTelegramConfig();

//   const url = `https://api.telegram.org/bot${token}/sendMessage`;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       chat_id: chatId,
//       text: message,
//       parse_mode: "HTML",
//       disable_web_page_preview: true,
//     }),
//   });

//   const data = (await response.json()) as TelegramResponse;

//   if (!response.ok || !data.ok || !data.result) {
//     throw new Error(
//       data.description || "Telegram message could not be sent"
//     );
//   }

//   return data.result.message_id;
// }

// export function formatNewTenderMessage(
//   tender: TelegramTender
// ): string {
//   return [
//     "🔔 <b>New Odisha Tender Found</b>",
//     "",
//     `<b>Title:</b> ${escapeTelegramHtml(tender.title)}`,
//     `<b>Reference:</b> ${escapeTelegramHtml(tender.tenderNumber)}`,
//     `<b>Tender ID:</b> ${escapeTelegramHtml(tender.tenderId)}`,
//     `<b>Organisation:</b> ${escapeTelegramHtml(tender.organisation)}`,
//     `<b>Closing Date:</b> ${escapeTelegramHtml(tender.closingDate)}`,
//     `<b>Bid Opening:</b> ${escapeTelegramHtml(tender.bidOpeningDate)}`,
//     "",
//     tender.sourceUrl
//       ? `🔗 <a href="${tender.sourceUrl}">View Tender</a>`
//       : "",
//   ]
//     .filter(Boolean)
//     .join("\n");
// }


type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id: number;
  };
  description?: string;
};

type TelegramTender = {
  title: string;
  tenderNumber: string | null;
  tenderId: string | null;
  organisation: string | null;
  closingDate: string | null;
  bidOpeningDate: string | null;
  sourceUrl: string | null;
};

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined");
  }

  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is not defined");
  }

  return { token, chatId };
}

function escapeTelegramHtml(
  value: string | null | undefined
): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(
  message: string
): Promise<number> {
  const { token, chatId } = getTelegramConfig();

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const data = (await response.json()) as TelegramResponse;

  if (!response.ok || !data.ok || !data.result) {
    throw new Error(
      data.description || "Telegram message could not be sent"
    );
  }

  return data.result.message_id;
}

export function formatNewTenderMessage(
  tender: TelegramTender
): string {
  return [
    "🔔 <b>New Odisha Tender Found</b>",
    "",
    `<b>Title:</b> ${escapeTelegramHtml(tender.title)}`,
    `<b>Reference:</b> ${escapeTelegramHtml(tender.tenderNumber)}`,
    `<b>Tender ID:</b> ${escapeTelegramHtml(tender.tenderId)}`,
    `<b>Organisation:</b> ${escapeTelegramHtml(tender.organisation)}`,
    `<b>Closing Date:</b> ${escapeTelegramHtml(tender.closingDate)}`,
    `<b>Bid Opening:</b> ${escapeTelegramHtml(tender.bidOpeningDate)}`,
    "",
    tender.sourceUrl
      ? `🔗 <a href="${escapeTelegramHtml(tender.sourceUrl)}">View Tender</a>`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

