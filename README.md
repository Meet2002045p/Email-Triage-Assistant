# Email Triage Assistant - Frontend

AI-powered email triage system that automatically analyzes your emails, determines which ones need replies, and prioritizes them based on urgency.

## 🎯 Core Concept

1. **Connect Email** - User authenticates with Gmail or Outlook
2. **AI Analysis** - System reads and analyzes ALL emails
3. **Priority Detection** - AI determines which emails need replies and their urgency level
4. **Smart Replies** - Generate context-aware responses based on priority

## ✨ Features

- **Automatic Email Analysis** - AI scans every email to detect if it needs a response
- **Priority Classification** - Emails are categorized as:
  - 🚨 **Urgent** - Reply immediately
  - ⚠️ **High Priority** - Reply within hours
  - ⏰ **Medium Priority** - Reply within a day
  - ✓ **Low Priority** - Reply when convenient
- **AI-Generated Replies** - Context-aware draft responses for each priority level
- **Quick Reply Options** - One-click replies for common scenarios (acknowledge, yes/no, questions)
- **Smart Summaries** - AI-powered email summaries for quick understanding
- **Response Time Estimates** - Estimated time needed to reply to each email
- **Analytics Dashboard** - Track reply patterns and response times

## 🚀 Tech Stack

- React 18 with Hooks
- Tailwind CSS for modern, responsive design
- React Router v6
- Context API for state management
- Heroicons for icons
- Recharts for analytics
- Axios for API calls

## 📦 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── EmailList.js        # Priority-sorted email inbox
│   ├── EmailDetail.js      # Email view with reply generation
│   ├── Analytics.js        # Response metrics dashboard
│   ├── Settings.js         # User preferences
│   └── Sidebar.js          # Navigation
├── context/
│   ├── AuthContext.js      # Authentication state
│   └── EmailContext.js     # Email analysis logic
├── pages/
│   ├── Login.js            # OAuth authentication
│   └── Dashboard.js        # Main app layout
├── App.js                  # Root component
└── index.js                # Entry point
```

## 🎨 UI Highlights

- **Priority-Based Color Coding** - Urgent (red), High (orange), Medium (yellow), Low (green)
- **Reply-Focused Interface** - Emphasis on emails that need responses
- **One-Click AI Replies** - Quick action buttons for common reply types
- **Estimated Reply Times** - Helps manage time and expectations
- **Clean, Modern Design** - Professional UI with smooth interactions

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000`:

### Key Endpoints:
- `GET /api/emails` - Fetch and analyze all emails
- `POST /api/emails/categorize` - AI categorization
- `POST /api/emails/draft` - Generate reply drafts
- `POST /api/emails/summarize` - Create email summaries

## 🎯 User Flow

1. Login with Gmail/Outlook
2. System automatically fetches and analyzes all emails
3. View emails sorted by reply priority
4. Click on any email to see details and AI analysis
5. Generate replies with one click or customize
6. Track response patterns in analytics

## 📊 Expected Email Data Structure

```javascript
{
  id: "email-id",
  from: "sender@example.com",
  subject: "Email subject",
  body: "Email content",
  receivedAt: "2024-02-06T10:00:00Z",
  needsReply: true,              // AI determined
  replyPriority: "urgent",       // urgent/high/medium/low
  aiSummary: "Brief summary",    // Auto-generated
  aiAnalysis: true,              // Processing complete
  estimatedReplyTime: 5          // Minutes to reply
}
```

## 🛠️ Customization

Update priority keywords and logic in [EmailContext.js](src/context/EmailContext.js):
- `determineReplyPriority()` - Modify urgency detection
- `estimateReplyTime()` - Adjust time calculations
- `generateQuickSummary()` - Customize summary generation
