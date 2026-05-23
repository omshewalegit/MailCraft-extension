// MailCraft Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("MailCraft extension installed.");
  chrome.storage.local.set({ lastTone: "professional" });
});

// Handle fetch from content script (bypasses CORS/loopback block)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GENERATE_REPLY") {
    fetch("http://localhost:8080/api/email/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailContent: msg.emailContent, tone: msg.tone }),
    })
      .then((res) => res.text())
      .then((reply) => sendResponse({ reply }))
      .catch((err) => sendResponse({ error: err.message }));

    return true; // Required to keep channel open for async response
  }
});
