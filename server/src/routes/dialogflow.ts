import express from "express";
import fetch from "node-fetch";
import { GoogleAuth } from "google-auth-library";

const router = express.Router();

const PROJECT_ID = "comelec-487901";
const LOCATION = "us";
const APP_ID = "d73f32cb-7b93-4f8d-9a2e-72cc4bd12ff5";
const SESSION_ID = "pHVFuKO1er";
const VERSION_ID = "1a9d6dcd-f741-4e7c-bba2-0215a878c0c8";
const DEPLOYMENT_ID = "e7a381b7-0868-4022-a432-d95cbec216e8";

router.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // 🔐 Automatically generate access token
    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    const accessToken = accessTokenResponse.token;

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

    const data = await response.json();
    console.log("CES raw response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("CES returned error:", data.error);
      return res.status(500).json({ reply: "CES authentication error." });
    }

    // ✅ Clean output processing
    const botReply =
      data?.outputs
        ?.map((o: any) =>
          typeof o.text === "string"
            ? o.text
            : Array.isArray(o.text)
            ? o.text.join(" ")
            : ""
        )
        .filter((t: string) => t.length > 1)
        .join(" ") || "Sorry, I didn't understand that.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Dialogflow CES Error:", error);
    res.status(500).json({ reply: "Error connecting to CES bot." });
  }
});

export default router;
