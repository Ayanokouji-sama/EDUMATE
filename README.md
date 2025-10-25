# 🎓 Edumate – AI Learning Companion

**Edumate** is a modern AI-powered learning web app built with **React** and **Vite**, leveraging **Chrome’s on-device Gemini Nano model** via the **Prompt API**.  
It offers tools like **summarization**, **Q&A generation**, **rewriting**, and **proofreading** — all **private**, **fast**, and **interactive**, right in your browser.

---

## 🚀 Live Demo
👉 [Try Edumate Here](https://edumate-my.web.app/)

---

## ✨ Features

- ⚡ **Instant Summarization** – Summarize text or documents in seconds  
- 🧠 **Q&A Generation** – Create questions and answers from your study content  
- ✍️ **Rewrite & Proofread** – Improve text with on-device Chrome AI  
- 📄 **Text & File Input** – Paste text or upload `.txt` / `.pdf` files  
- 💾 **Save, Copy & Download** – Export AI results easily  
- 🔒 **Privacy First** – Runs fully **offline** (PWA with supported browsers)  
- 🤖 **Chrome Built-in API** – Direct integration with Gemini Nano  

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Vite, Tailwind CSS |
| **AI** | Chrome Built-in API (on-device Gemini Nano) |
| **Backend** | None (pure frontend + browser APIs) |
| **Hosting** | Firebase Hosting |

---

## 📦 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/edumate.git
cd edumate/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
npm run dev
```
Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to Firebase
```bash
firebase deploy
```

---

## 🌐 Chrome AI Setup

1. Register your Firebase domain for the **Prompt API Origin Trial**.  
2. Add the issued token inside your `public/index.html`:

```html
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```

3. Use **Chrome Canary v143+** and enable required experimental flags for full AI support.

---

## 📁 Project Structure
```
frontend/
├── src/
├── public/
├── dist/
├── package.json
├── vite.config.js
├── firebase.json
├── .firebaserc
└── ...
```

---


## 🙏 Credits
Created by **Mohammad Bilal**
