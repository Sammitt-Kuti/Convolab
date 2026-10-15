# ConvoLab — Personalised AI Communication Practice Platform

> An empirical, AI-powered simulator designed to help college students and interview participants master nuanced interpersonal interactions in a safe, judgment-free environment.

---

## 🎯 What ConvoLab Is (and Is Not)

- **What it is:** A structured simulator for high-friction social and workplace scenarios: deciphering ambiguous Slack messages from leads, setting firm boundaries without guilt, communicating concisely without rambling, and intervening in fast-moving group discussions.
- **What it is NOT:** 
  - ❌ Not an English grammar or spell checker.
  - ❌ Not a generic chatbot.
  - ❌ Not a rigid personality test (no Myers-Briggs or clinical labeling).
  - ❌ Not a punitive grading system.

---

## 🧭 The 5-Step Learning Journey

```
Welcome & Consent
       │
       ▼
1. Onboarding Questionnaire (Goals, Difficulties, Frequencies)
       │
       ▼
2. Behavioral Baseline Assessment (3 Realistic Interactive Scenarios)
       │
       ▼
3. Working Communication Profile (Observed Strengths, Growth Areas, Textual Evidence)
       │
       ▼
4. Targeted Practice Drills (Scenario + Context Calibration + Interactive Writing)
       │
       ▼
5. Nuanced Feedback & Retry Loop (Multi-dimension Scoring, Single Key Adjustment, Model Alternative)
```

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- Node.js LTS (v20+ or v24+) installed (already configured on your system).
- VS Code or Google Antigravity IDE.

### 2. Setup & Installation
Open PowerShell in the project directory (`s:\Convolab`) and run:

```powershell
# Install dependencies
npm install
```

### 3. Configure Environment (Optional for Live AI)
Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local`:
- **For Demo Mode (Offline):** Leave `GEMINI_API_KEY=` blank. The app will use ConvoLab's local heuristic engine.
- **For Live Gemini AI:** Paste your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey):
  ```ini
  GEMINI_API_KEY=AIzaSy...your_actual_key_here
  GEMINI_MODEL=gemini-2.0-flash
  RESEARCH_PASSCODE=convolab2025
  ```

### 4. Start the Application
Run the local development server:

```powershell
npm run dev
```

Open your browser to: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Research & Participant Ethics Dashboard

ConvoLab is built for research studies and academic trials:

- **Anonymous Participant IDs:** Each user is assigned an anonymous ID (e.g., `cvl_9k2f1a`). No real names, emails, or phone numbers are ever required.
- **Explicit Consent:** A clear informed consent modal is required before any telemetry is recorded.
- **Right to Deletion:** Participants can delete all their data at any time via the **"Privacy & Rights"** button in the header.
- **Admin Dashboard:** Access the password-protected analytics dashboard by clicking **"Research Admin"** in the top navigation bar or visiting `/admin`.
  - **Default Passcode:** `convolab2025` (configurable via `RESEARCH_PASSCODE`).
  - **Features:** Live participant counts, completion rates, retry rates, average confidence scores, and **one-click CSV / JSON export** for data analysis.

---

## 🌐 How to Deploy Publicly (Step-by-Step for Beginners)

To share ConvoLab with college students and participants on their phones and laptops, deploy it for **free** on **Vercel** with a public HTTPS URL.

### Option A: 1-Click Deployment via GitHub & Vercel (Recommended)

1. **Commit your code to Git:**
   ```powershell
   git add .
   git commit -m "Initial commit of ConvoLab"
   ```
2. **Push to a GitHub repository:**
   - Go to [github.com/new](https://github.com/new) and create a repository called `convolab` (choose **Private** if you want your research code private, or **Public**).
   - Follow the instructions shown on GitHub to push your local repository:
     ```powershell
     git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/convolab.git
     git branch -M main
     git push -u origin main
     ```
3. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up for a free Hobby account using your GitHub account.
   - Click **"Add New..."** > **"Project"**.
   - Select your `convolab` repository and click **"Import"**.
4. **Set Environment Variables in Vercel:**
   - Under the **"Environment Variables"** section, add:
     - `GEMINI_API_KEY` = *(your Google AI Studio key, or leave empty for Demo Mode)*
     - `GEMINI_MODEL` = `gemini-2.0-flash`
     - `RESEARCH_PASSCODE` = `your_secret_admin_passcode`
5. **Click Deploy:**
   - Vercel will automatically build the Next.js app in ~60 seconds.
   - You will receive a live public HTTPS URL (e.g., `https://convolab-theta.vercel.app`) that you can immediately send to students and participants!

---

## 📋 Participant Testing Checklist

Before sharing your public URL with interviewees or students:

- [ ] **Mobile Responsiveness:** Open the public URL on your smartphone (iOS Safari / Android Chrome) to verify cards and textareas fit smoothly.
- [ ] **Consent Flow:** Verify that participants must check the consent box before starting.
- [ ] **AI vs Demo Mode Banner:** Check the top navigation badge. If `GEMINI_API_KEY` is configured, it will show a green dot with `gemini-2.0-flash`. If not, it will show an amber dot with `Demo Mode`.
- [ ] **Assessment to Profile:** Complete the 3 baseline scenarios and check that the generated profile extracts real textual evidence from your responses.
- [ ] **Practice & Feedback:** Submit a practice answer, inspect the 4-dimension scoring, actionable tip, and alternative phrasing, then test the **"Retry with Feedback"** button.
- [ ] **Admin Metrics:** Open the **Research Admin** dashboard using your passcode and verify that the session and retry counts update.
- [ ] **Data Deletion:** Open **"Privacy & Rights"**, click **"Delete My Data"**, and confirm the session is purged.

---

## 💰 Costs & Limitations

- **Hosting Cost:** **$0.00** (Free on Vercel Hobby tier).
- **Gemini API Cost:** **$0.00** (Google Gemini 2.0 Flash has a generous free tier of up to 15 requests per minute and 1,500 requests per day on Google AI Studio).
- **Demo Mode:** Unlimited free offline rule-based evaluations even without internet or API keys.
