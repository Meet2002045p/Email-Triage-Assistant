# Email Triage Assistant

AI-powered email management assistant that automatically reads, categorizes, prioritizes, and drafts replies for your emails.

## Features

- ✨ **AI Email Analysis** - Automatically understands and summarizes email content
- 📊 **Smart Categorization** - Groups emails into Meeting, Financial, Report, Support, and General
- ⚡ **Priority Matrix** - Identifies Urgent, High, Medium, and Low priority items
- 💬 **Smart Replies** - Generates context-aware draft replies
- 📈 **Analytics Dashboard** - Visualizes productivity stats and response trends
- 📝 **Drafts Management** - Save, edit, and manage your email drafts
- 🌗 **Dark Mode** - Fully responsive light/dark theme

## Quick Start

### 1. Backend Setup (Node.js)

```bash
cd backend
npm install
npm start
```
*Runs on port 5000*

### 2. Frontend Setup (React)

Open a new terminal:
```bash
cd frontend
npm install
npm start
```
*Runs on port 3000 (or 3001 if 3000 is busy)*

## Tech Stack

**Frontend**:
- React 18, Tailwind CSS, Headless UI, Heroicons, Recharts, Axios

**Backend**:
- Node.js, Express, Body-Parser, CORS

## Project Structure

```
/
├── backend/            # Express API Server
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
│
└── frontend/           # React Application
    ├── public/
    └── src/
        ├── components/ # UI Components (EmailList, Analytics, Settings...)
        ├── pages/      # Route Pages (Dashboard)
        └── context/    # State Management (EmailContext, ThemeContext)
```

## Features Demo

- **Dashboard**: View prioritized emails with AI summaries.
- **Analytics**: Check your email response times and volume.
- **Settings**: Configure AI tone (Professional/Friendly) and profile.
- **Threading**: View full conversation threads.
