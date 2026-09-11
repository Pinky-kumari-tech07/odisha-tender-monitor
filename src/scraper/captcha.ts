export interface CaptchaProvider {
  solve(imageBase64: string): Promise<string>;
}

interface CreateTaskResponse {
  errorId: number;
  taskId?: number;
  errorCode?: string;
  errorDescription?: string;
}

interface GetTaskResultResponse {
  errorId: number;
  status: "processing" | "ready";
  solution?: {
    text: string;
  };
  errorCode?: string;
  errorDescription?: string;
}

class TwoCaptchaProvider implements CaptchaProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async solve(imageBase64: string): Promise<string> {
    // Step 1: Create CAPTCHA task
    const createResponse = await fetch(
      "https://api.2captcha.com/createTask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientKey: this.apiKey,
          task: {
            type: "ImageToTextTask",
            body: imageBase64,
          },
        }),
      }
    );

    const createData =
      (await createResponse.json()) as CreateTaskResponse;

    if (createData.errorId !== 0 || !createData.taskId) {
      throw new Error(
        createData.errorDescription ||
          createData.errorCode ||
          "Failed to create CAPTCHA task"
      );
    }

    const taskId = createData.taskId;

    // Step 2: Poll for result
    const maxAttempts = 12;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );

      const resultResponse = await fetch(
        "https://api.2captcha.com/getTaskResult",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientKey: this.apiKey,
            taskId,
          }),
        }
      );

      const resultData =
        (await resultResponse.json()) as GetTaskResultResponse;

      if (resultData.errorId !== 0) {
        throw new Error(
          resultData.errorDescription ||
            resultData.errorCode ||
            "Failed to get CAPTCHA result"
        );
      }

      if (
        resultData.status === "ready" &&
        resultData.solution?.text
      ) {
        return resultData.solution.text.trim();
      }

      console.log(
        `CAPTCHA still processing... attempt ${attempt}/${maxAttempts}`
      );
    }

    throw new Error("CAPTCHA solving timed out");
  }
}

export function createCaptchaProvider(): CaptchaProvider {
  const apiKey = process.env.CAPTCHA_API_KEY;

  if (!apiKey) {
    throw new Error("CAPTCHA_API_KEY is not configured");
  }

  return new TwoCaptchaProvider(apiKey);
}