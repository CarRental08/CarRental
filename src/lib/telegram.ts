/**
 * Telegram Notification Utility
 * Handles sending messages to a specific Telegram group using a Bot Token.
 */

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = "-1003533077604";

/**
 * Sends a message to the configured Telegram group.
 * @param message The HTML-formatted message to send.
 */
export async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("[Telegram] Bot Token is not set in environment variables. Notification skipped.");
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Telegram] API Error:", errorData);
    }
  } catch (error) {
    // We catch errors to ensure the main booking flow is never blocked by notification failures
    console.error("[Telegram] Failed to send notification:", error);
  }
}