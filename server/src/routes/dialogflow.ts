import express from "express";
import type {Request, Response} from "express";
import fetch from "node-fetch";
import { GoogleAuth } from "google-auth-library";

const router = express.Router();

const PROJECT_ID = "comelec-487901";
const LOCATION = "us";
const APP_ID = "d73f32cb-7b93-4f8d-9a2e-72cc4bd12ff5";
const SESSION_ID = "pHVFuKO1er";
const VERSION_ID = "1a9d6dcd-f741-4e7c-bba2-0215a878c0c8";
const DEPLOYMENT_ID = "e7a381b7-0868-4022-a432-d95cbec216e8";

/**
 * Expected CES API Response Structure
 */
interface CESResponse {
  error?: {
    message?: string;
    code?: number;
  };
  outputs?: {
    text?: string | string[];
  }[];
}

router.post("/chat", async (req: Request, res: Response) => {
  const userMessage: string = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message is required." });
  }

  try {
    // 🔐 Generate access token automatically
    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) {
      return res.status(500).json({ reply: "Failed to obtain access token." });
    }

    const sessionUrl = `https://ces.googleapis.com/v1beta/projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/sessions/${SESSION_ID}:runSession`;

    const response = await fetch(sessionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config: {
          session: `projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/sessions/${SESSION_ID}`,
          app_version: `projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/versions/${VERSION_ID}`,
          deployment: `projects/${PROJECT_ID}/locations/${LOCATION}/apps/${APP_ID}/deployments/${DEPLOYMENT_ID}`,
        },
        inputs: [{ text: userMessage }],
      }),
    });

    const data: CESResponse = await response.json();

    console.log("CES raw response:", JSON.stringify(data, null, 2));

    // ❌ Handle CES error response
    if (data.error) {
      console.error("CES returned error:", data.error);
      return res.status(500).json({
        reply: data.error.message || "CES authentication error.",
      });
    }

    // ✅ Safely extract bot reply
    const botReply =
      data.outputs
        ?.map((output) =>
          typeof output.text === "string"
            ? output.text
            : Array.isArray(output.text)
            ? output.text.join(" ")
            : ""
        )
        .filter((text) => text.length > 1)
        .join(" ") || "Sorry, I didn't understand that.";

    return res.json({ reply: botReply });

  } catch (error) {
    console.error("Dialogflow CES Error:", error);
    return res.status(500).json({
      reply: "Error connecting to CES bot.",
    });
  }
});

export default router;