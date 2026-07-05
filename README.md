<div align="center">
<img src="https://img.shields.io/badge/MailCraft-Extension-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white" />

# MailCraft Extension
**AI-powered email reply generator for Gmail**  
Built with Chrome Manifest V3 · Google Gemini AI

[![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-8B5CF6?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)



---

## 📌 Overview

MailCraft Extension integrates seamlessly into Gmail's compose window. With one click, it reads the open email thread, constructs an intelligent prompt, and injects a polished, ready-to-send reply — in the tone you choose.

No copy-pasting. No tab switching. Just click **Give Reply** and you're done.

---

## 🖼️ Screenshots

<img width="1423" height="687" alt="image" src="https://github.com/user-attachments/assets/bc945f69-47cd-4077-8a56-20cfef446119" />


<br/>

<img width="1455" height="413" alt="image" src="https://github.com/user-attachments/assets/9e98d017-9a26-4846-9ae2-8fec0f134ee4" />


<br/>

<img width="1478" height="456" alt="image" src="https://github.com/user-attachments/assets/457d7644-7c4a-4521-badf-d2026d90a4ee" />
<img width="1503" height="568" alt="image" src="https://github.com/user-attachments/assets/30f71926-e870-480c-9ec8-e684580d8680" />


<br/>

### Extension Popup 
<img width="375" height="540" alt="image" src="https://github.com/user-attachments/assets/27088c6e-5d96-40b2-b399-c20b1a4d2daa" />



---

## 📥 Installation

> No Chrome Web Store required. Install directly in 3 steps.

### Step 1 — Download

[**Download ZIP**](https://github.com/omshewalegit/MailCraft-extension/archive/refs/heads/main.zip)

Or clone:

```bash
git clone https://github.com/omshewalegit/MailCraft-extension.git
```

### Step 2 — Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select the extracted folder containing `manifest.json`

### Step 3 — Use in Gmail

1. Open any email in Gmail
2. Click **Reply**
3. Select a tone from the dropdown next to the Send button
4. Click **✦ Give Reply**
5. AI-generated reply is inserted instantly

---

## ✨ Features

- **One-click reply generation** directly inside Gmail
- **6 tone options** — Professional, Formal, Friendly, Apologetic, Assertive, Concise
- **Context-aware** — reads the full email thread before generating
- **Non-intrusive UI** — sits naturally next to Gmail's Send button
- **Instant insertion** — reply is inserted directly into the compose box

---

## 🖼️ How It Works

```
User opens email → clicks Reply
│
▼
MailCraft reads email thread
│
▼
User selects tone → clicks Give Reply
│
▼
background.js sends request to backend
│
▼
Gemini AI generates reply
│
▼
Reply inserted into Gmail compose box
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Extension | Chrome Manifest V3 |
| Content Script | Vanilla JavaScript |
| Background Worker | Service Worker |
| AI Backend | Spring Boot + Gemini API |
| Styling | Vanilla CSS |

---

## 🔗 Related Repositories

| Repo | Description |
|------|-------------|
| [MailCraft Backend](https://github.com/omshewalegit/MailCraft-backend) | REST API — Gemini integration |
| [MailCraft Frontend](https://github.com/omshewalegit/MailCraft-Frontend) | React web application |

---

## 🌐 Web App

Try the standalone web version:  
👉 **[mail-craft-frontend.vercel.app](https://mail-craft-frontend.vercel.app)**

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch `git checkout -b feature/amazing-feature`
3. Commit your changes `git commit -m 'Add amazing feature'`
4. Push to the branch `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

**If this project helped you, give it a ⭐**

*Built with ❤️ by [Om Shewale](https://github.com/omshewalegit)*

</div>
