const API_URL =
  "https://mailcraft-backend-production.up.railway.app/api/email/generate";

const style = document.createElement("style");
style.textContent = `@keyframes mailcraft-spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

let selectedTone = "professional"; // default tone

let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(injectButtonIfNeeded, 300);
});
observer.observe(document.body, { childList: true, subtree: true });

function injectButtonIfNeeded() {
  if (document.querySelector(".mailcraft-wrapper")) return;

  const sendBtns = document.querySelectorAll("div[data-tooltip]");

  sendBtns.forEach((el) => {
    const tooltip = el.getAttribute("data-tooltip") || "";
    if (!tooltip.includes("Send")) return;
    if (!tooltip.includes("Ctrl")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "mailcraft-wrapper";
    Object.assign(wrapper.style, {
      display: "inline-flex",
      alignItems: "center",
      marginLeft: "8px",
      borderRadius: "20px",
      border: "1px solid rgba(99,102,241,0.5)",
      background: "rgba(99,102,241,0.08)",
      overflow: "hidden",
      transition: "border-color 0.15s",
    });

    const toneSelect = document.createElement("select");
    toneSelect.className = "mailcraft-tone";
    [
      "professional",
      "formal",
      "friendly",
      "apologetic",
      "assertive",
      "concise",
    ].forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      toneSelect.appendChild(opt);
    });
    Object.assign(toneSelect.style, {
      padding: "6px 8px 6px 12px",
      border: "none",
      borderRight: "1px solid rgba(99,102,241,0.3)",
      background: "transparent",
      color: "#6366f1",
      fontFamily: "Google Sans, Roboto, sans-serif",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      outline: "none",
      appearance: "auto",
    });
    toneSelect.value = selectedTone;
    toneSelect.addEventListener("change", () => {
      selectedTone = toneSelect.value;
    });

    const btn = document.createElement("button");
    btn.className = "mailcraft-btn";
    btn.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>
      </svg>
      Give Reply
    `;
    Object.assign(btn.style, {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "6px 14px",
      border: "none",
      background: "transparent",
      color: "#6366f1",
      fontFamily: "Google Sans, Roboto, sans-serif",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background 0.15s",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(99,102,241,0.15)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "transparent";
    });
    wrapper.addEventListener("mouseenter", () => {
      wrapper.style.borderColor = "rgba(99,102,241,0.9)";
    });
    wrapper.addEventListener("mouseleave", () => {
      wrapper.style.borderColor = "rgba(99,102,241,0.5)";
    });

    btn.addEventListener("click", () => handleClick(btn));

    wrapper.appendChild(toneSelect);
    wrapper.appendChild(btn);

    observer.disconnect();
    el.parentElement.parentElement.insertAdjacentElement("afterend", wrapper);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function handleClick(btn) {
  const composeBox = document.querySelector(
    "div[contenteditable='true'][aria-label='Message Body'], " +
      "div[contenteditable='true'].Am, " +
      "td.Ap div[contenteditable='true'], " +
      "div[contenteditable='true'][g_editable='true']",
  );

  if (!composeBox) {
    showToast("Compose box nahi mila!", true);
    return;
  }

  const emailBody = extractEmailBody();
  if (!emailBody) {
    showToast("Email body nahi mili!", true);
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round"
      style="animation:mailcraft-spin 0.8s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Generating…
  `;

  const resetBtn = () => {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>
      </svg>
      Give Reply
    `;
  };

  chrome.runtime.sendMessage(
    { type: "GENERATE_REPLY", emailContent: emailBody, tone: selectedTone },
    (response) => {
      resetBtn();

      // Chrome extension error
      if (chrome.runtime.lastError) {
        showToast("Extension error! Reload karo.", true);
        return;
      }

      // Backend ne error return kiya
      if (!response || response.error) {
        showToast(response?.error || "Backend connect nahi hua!", true);
        return;
      }

      // Reply missing ya backend ka error JSON aa gaya
      if (
        !response.reply ||
        response.reply.includes('"status":5') ||
        response.reply.includes('"error"') ||
        response.reply.trim().startsWith("{")
      ) {
        showToast("Backend error aaya! Thodi der baad retry karo.", true);
        return;
      }

      // Sab theek — compose box mein insert karo
      composeBox.click();
      composeBox.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(composeBox);
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand("insertText", false, response.reply);
      composeBox.dispatchEvent(new Event("input", { bubbles: true }));
      showToast("✦ Reply insert ho gaya!");
    },
  );
}

function extractEmailBody() {
  const selectors = [".a3s.aiL", ".a3s.aXjCH", ".ii.gt .a3s", ".a3s"];
  for (const sel of selectors) {
    const els = document.querySelectorAll(sel);
    if (els.length > 0) {
      const text = els[els.length - 1].innerText.trim();
      if (text) return text;
    }
  }
  return null;
}

function showToast(message, isError = false) {
  const existing = document.getElementById("mailcraft-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "mailcraft-toast";
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    zIndex: "99999",
    padding: "10px 18px",
    borderRadius: "10px",
    background: isError ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.15)",
    border: `1px solid ${isError ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.4)"}`,
    color: isError ? "#ef4444" : "#818cf8",
    fontFamily: "Google Sans, Roboto, sans-serif",
    fontSize: "13px",
    fontWeight: "500",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    transition: "opacity 0.3s",
  });

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
