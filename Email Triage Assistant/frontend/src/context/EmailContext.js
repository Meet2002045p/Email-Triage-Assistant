import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const EmailContext = createContext();

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load emails on mount
  React.useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      // Check if we're in manual mode (no token)
      // const token = localStorage.getItem('token'); 
      // For Phase 4, we default to backend connection


      // Regular mode - fetch from backend
      const response = await axios.get('http://localhost:5000/api/emails');
      // Process emails to add reply analysis metadata
      const processedEmails = (response.data.emails || []).map(email => ({
        ...email,
        needsReply: email.needsReply !== false, // Default to true if not specified
        replyPriority: email.replyPriority || determineReplyPriority(email),
        aiAnalysis: email.aiAnalysis || true,
        aiSummary: email.aiSummary || generateQuickSummary(email),
        estimatedReplyTime: email.estimatedReplyTime || estimateReplyTime(email),
        isDraft: email.isDraft || false,
      }));
      setEmails(processedEmails);
      return { ...response.data, emails: processedEmails };
    } catch (error) {
      console.error('Error fetching emails:', error);
      // Fallback to empty or toast
      return { emails: [] };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine reply priority based on email content
  const determineReplyPriority = (email) => {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency'];
    const highKeywords = ['important', 'deadline', 'action required', 'response needed'];

    const subject = (email.subject || '').toLowerCase();
    const body = (email.body || email.snippet || '').toLowerCase();
    const content = subject + ' ' + body;

    if (urgentKeywords.some(keyword => content.includes(keyword))) {
      return 'urgent';
    }
    if (highKeywords.some(keyword => content.includes(keyword))) {
      return 'high';
    }
    if (email.from?.includes('boss') || email.from?.includes('ceo') || email.from?.includes('manager')) {
      return 'high';
    }
    if (content.includes('?') || content.includes('question')) {
      return 'medium';
    }
    return 'low';
  };

  const generateQuickSummary = (email) => {
    const body = email.body || email.snippet || '';
    if (body.length > 100) {
      return body.substring(0, 100) + '...';
    }
    return body;
  };

  const addManualEmail = async (userEmailAddress) => {
    setLoading(true);
    try {
      // Store the email address
      localStorage.setItem('connectedEmail', userEmailAddress);

      // Generate sample emails with real-looking addresses and all categories
      const sampleEmails = [
        // Meeting Category (5 emails)
        {
          from: 'john.smith@techcorp.com',
          subject: 'Team meeting scheduled for Monday',
          body: 'Hi, I have scheduled our weekly team meeting for Monday at 10 AM. Please review the agenda beforehand and come prepared with your updates. The meeting link will be sent separately.',
        },
        {
          from: 'sarah.johnson@clientco.com',
          subject: 'Meeting request: Project kickoff discussion',
          body: 'Hello, I would like to schedule a meeting with you next week to discuss the project kickoff. Are you available on Tuesday or Wednesday afternoon? Please let me know your preferred time slot.',
        },
        {
          from: 'mike.wilson@partners.net',
          subject: 'Can we schedule a call this week?',
          body: 'Hi there, I wanted to touch base about the proposal we discussed. Could we schedule a quick 30-minute call this week to align on next steps? Let me know what works for you.',
        },
        {
          from: 'emily.brown@enterprise.com',
          subject: 'URGENT: Emergency meeting at 3 PM today',
          body: 'We need to have an emergency meeting today at 3 PM to discuss the production issue. This is critical and requires immediate attention from all team members. Please confirm your attendance ASAP.',
        },
        {
          from: 'david.lee@consulting.biz',
          subject: 'Rescheduling our Thursday meeting',
          body: 'I need to reschedule our meeting originally planned for Thursday. Would Friday morning work for you instead? Sorry for the inconvenience. Please let me know at your earliest convenience.',
        },

        // Financial Category (5 emails)
        {
          from: 'accounts@financecorp.com',
          subject: 'Invoice #A12345 - Payment due in 3 days',
          body: 'This is a reminder that invoice #A12345 for $5,000 is due within 3 days. Please process the payment at your earliest convenience to avoid late fees. Let me know if you need any additional documentation.',
        },
        {
          from: 'billing@softwareservice.com',
          subject: 'Your monthly subscription payment',
          body: 'Your monthly subscription payment of $299 is due on February 15th. Please ensure sufficient funds are available in your account. You can view your invoice in the billing portal.',
        },
        {
          from: 'robert.clark@accounting.net',
          subject: 'URGENT: Payment authorization required',
          body: 'We need your immediate authorization to process the vendor payment of $15,000. This is time-sensitive and affects our contract obligations. Please approve in the system ASAP.',
        },
        {
          from: 'finance.team@corporation.com',
          subject: 'Expense report approval needed',
          body: 'Your expense report for $1,250 from last month is pending approval. Please review and approve it in the expense management system so we can process reimbursement this cycle.',
        },
        {
          from: 'payroll@humanresources.com',
          subject: 'Tax documents for 2025 available',
          body: 'Your W-2 forms and tax documents for 2025 are now available in the payroll portal. Please download and review them. Contact us if you notice any discrepancies.',
        },

        // Report Category (5 emails)
        {
          from: 'analytics@datacompany.com',
          subject: 'Weekly project status report',
          body: 'Here is this week\'s project status update. We are on track with most deliverables, but need your input on the design mockups. Please review the attached files and share your feedback by end of day.',
        },
        {
          from: 'james.martinez@operations.com',
          subject: 'Q1 Performance Review Summary',
          body: 'Attached is the Q1 performance review summary for your team. Overall results are positive with 15% growth. Please review and prepare for our discussion meeting next week.',
        },
        {
          from: 'reports@analytics.io',
          subject: 'Monthly sales report - January 2026',
          body: 'The January sales report shows a 23% increase compared to last month. Key highlights include strong performance in the enterprise segment. Full detailed analysis is attached.',
        },
        {
          from: 'lisa.anderson@research.org',
          subject: 'Market research findings report',
          body: 'We have completed the market research study and compiled our findings. The report indicates significant opportunities in the APAC region. Please review and let\'s discuss implications for our strategy.',
        },
        {
          from: 'ops.team@logistics.com',
          subject: 'Annual review: Operations report 2025',
          body: 'This is the comprehensive operations review for 2025. We\'ve documented all processes, improvements made, and recommendations for 2026. Your input on section 3 would be valuable.',
        },

        // Support Category (5 emails)
        {
          from: 'support@techplatform.com',
          subject: 'Question about your recent order #9876',
          body: 'We noticed you recently placed order #9876 with us. Do you have any questions about shipping or delivery? Our team is here to help. Just reply to this email and we will assist you promptly.',
        },
        {
          from: 'help@customercare.com',
          subject: 'How can we help you today?',
          body: 'We saw that you visited our help center but didn\'t submit a ticket. Is there anything we can assist you with? Our support team is available 24/7 to answer your questions.',
        },
        {
          from: 'technical.support@software.net',
          subject: 'Re: Issue with login authentication',
          body: 'Thank you for reporting the login authentication issue. Our technical team has investigated and identified the root cause. We\'ve implemented a fix that should resolve your problem. Please try logging in again.',
        },
        {
          from: 'service@cloudprovider.com',
          subject: 'Need help with your account setup?',
          body: 'We noticed you started setting up your account but haven\'t completed the process. Would you like assistance? Our onboarding specialists can help you get started quickly. Reply with your questions.',
        },
        {
          from: 'customercare@retailstore.com',
          subject: 'Feedback request: Your recent purchase',
          body: 'How was your experience with your recent purchase? We value your feedback and would love to hear about your experience. It takes just 2 minutes to complete our survey.',
        },

        // General Category (5 emails)
        {
          from: 'newsletter@marketing.com',
          subject: 'Monthly Newsletter - Latest Updates',
          body: 'Check out our latest newsletter with tips, tricks, and updates from our team. Discover new features and how to make the most of our platform. Click here to read more.',
        },
        {
          from: 'notifications@socialnetwork.com',
          subject: 'You have 15 new notifications',
          body: 'You have 15 new notifications from your social network. Check out who viewed your profile, who sent you messages, and the latest updates from your connections.',
        },
        {
          from: 'info@industryevent.com',
          subject: 'Invitation: Tech Conference 2026',
          body: 'You\'re invited to attend Tech Conference 2026, the premier event for technology professionals. Join us March 15-17 for keynotes, workshops, and networking. Early bird registration ends soon.',
        },
        {
          from: 'updates@productlaunch.com',
          subject: 'Exciting new features just launched!',
          body: 'We\'re thrilled to announce the launch of our new features including dark mode, advanced analytics, and mobile app improvements. Check out what\'s new and start exploring today.',
        },
        {
          from: 'community@professional.org',
          subject: 'Weekly digest: Industry news and updates',
          body: 'Here\'s your weekly digest of the most important industry news and updates. This week\'s highlights include new regulations, market trends, and upcoming events in your area.',
        },
      ];

      // Generate emails with AI analysis
      // Create some threads by reusing subjects
      const generatedEmails = sampleEmails.map((emailData, index) => {
        // Create threads: adjacent emails share a thread if index % 3 !== 0
        // Simple logic: Group every 2-3 emails into a thread
        const threadIndex = Math.floor(index / 2);
        const isReply = index % 2 !== 0;
        const threadId = `thread-${threadIndex}`;

        return {
          id: `email-${Date.now()}-${index}`,
          threadId: threadId,
          from: isReply ? 'Me' : emailData.from, // Simulate conversation
          to: isReply ? emailData.from : 'Me',
          subject: index % 2 === 0 ? emailData.subject : `Re: ${sampleEmails[index - 1].subject}`,
          body: emailData.body,
          receivedAt: new Date(Date.now() - index * 1800000).toISOString(), // Stagger by 30 minutes
          isRead: false,
          needsReply: !isReply, // Only incoming needs reply
          replyPriority: determineReplyPriority(emailData),
          aiAnalysis: true,
          aiSummary: generateQuickSummary(emailData),
          estimatedReplyTime: estimateReplyTime(emailData),
          category: categorizeEmail(emailData),
          isDraft: false,
        };
      });

      setEmails(generatedEmails);
      return generatedEmails;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const estimateReplyTime = (email) => {
    const bodyLength = (email.body || '').length;

    if (bodyLength < 200) return '2-3';
    if (bodyLength < 500) return '5-7';
    if (bodyLength < 1000) return '10-15';
    return '15-20';
  };

  const categorizeEmail = (email) => {
    const content = (email.subject + ' ' + email.body).toLowerCase();

    if (content.includes('meeting') || content.includes('schedule')) return 'Meeting';
    if (content.includes('invoice') || content.includes('payment')) return 'Financial';
    if (content.includes('report') || content.includes('review')) return 'Report';
    if (content.includes('question') || content.includes('help')) return 'Support';
    return 'General';
  };

  const getEmailById = async (id) => {
    try {
      // Check if we're in manual mode
      const token = localStorage.getItem('token');

      if (!token) {
        // Manual mode - find from local state
        const email = emails.find(e => e.id === id);
        setSelectedEmail(email);
        return email;
      }

      // Regular mode - fetch from backend
      const response = await axios.get(`http://localhost:5000/api/emails/${id}`);
      setSelectedEmail(response.data);
      return response.data;
    } catch (error) {
      // Fallback to local state
      const email = emails.find(e => e.id === id);
      setSelectedEmail(email);
      return email;
    }
  };

  const generateDraft = async (emailId, context) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Manual mode - generate a simple draft locally
        const email = emails.find(e => e.id === emailId);
        if (!email) return { draft: 'Email not found' };

        // Simple AI-like draft generation based on email content
        const draft = `Dear ${email.from},\n\nThank you for your email regarding "${email.subject}".\n\n${context || 'I will review your message and get back to you shortly.'}\n\nBest regards`;
        return { draft };
      }

      // Regular mode - use backend AI
      const response = await axios.post('http://localhost:5000/api/emails/draft', {
        emailId,
        context,
      });
      return response.data;
    } catch (error) {
      // Fallback draft
      return { draft: 'Thank you for your email. I will review and respond shortly.' };
    }
  };

  const summarizeThread = async (emailId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Manual mode - generate simple summary
        const email = emails.find(e => e.id === emailId);
        if (!email) return { summary: 'Email not found' };

        return { summary: email.aiSummary || generateQuickSummary(email) };
      }

      // Regular mode - use backend AI
      const response = await axios.post('http://localhost:5000/api/emails/summarize', {
        emailId,
      });
      return response.data;
    } catch (error) {
      const email = emails.find(e => e.id === emailId);
      return { summary: email?.aiSummary || 'Summary not available' };
    }
  };

  const markAsRead = async (emailId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Manual mode - update local state
        setEmails(prevEmails =>
          prevEmails.map(email =>
            email.id === emailId ? { ...email, isRead: true } : email
          )
        );
        return { success: true };
      }

      // Regular mode - use backend
      const response = await axios.post('http://localhost:5000/api/emails/mark-read', {
        emailId,
      });
      return response.data;
    } catch (error) {
      // Fallback to local update
      setEmails(prevEmails =>
        prevEmails.map(email =>
          email.id === emailId ? { ...email, isRead: true } : email
        )
      );
      return { success: true };
    }
  };

  const archiveEmail = async (emailId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Manual mode - remove from local state
        setEmails(emails.filter(email => email.id !== emailId));
        return { success: true };
      }

      // Regular mode - use backend
      const response = await axios.post('http://localhost:5000/api/emails/archive', {
        emailId,
      });
      setEmails(emails.filter(email => email.id !== emailId));
      return response.data;
    } catch (error) {
      // Fallback to local removal
      setEmails(emails.filter(email => email.id !== emailId));
      return { success: true };
    }
  };

  const bulkArchive = async (emailIds) => {
    setEmails(prev => prev.filter(email => !emailIds.includes(email.id)));
    return { success: true };
  };

  const bulkMarkRead = async (emailIds) => {
    setEmails(prev => prev.map(email =>
      emailIds.includes(email.id) ? { ...email, isRead: true } : email
    ));
    return { success: true };
  };

  const saveDraft = async (emailId, content) => {
    // Check if it's a new draft or updating existing
    const existing = emails.find(e => e.id === emailId);

    if (existing && existing.isDraft) {
      // Update existing draft
      setEmails(prev => prev.map(e => e.id === emailId ? { ...e, body: content } : e));
    } else {
      // Create new draft linked to an email (or standalone if we want)
      // For now, let's treat it as marking the email as having a draft or creating a new item
      // Simplified: We'll create a new "Draft" item
      const newDraft = {
        id: `draft-${Date.now()}`,
        from: 'Me', // Drafts are from me
        to: existing ? existing.from : 'Recipient',
        subject: existing ? `Re: ${existing.subject}` : 'New Message',
        body: content,
        receivedAt: new Date().toISOString(),
        isRead: true,
        needsReply: false,
        replyPriority: 'low',
        isDraft: true,
        category: 'General',
      };
      setEmails(prev => [newDraft, ...prev]);
    }
    return { success: true };
  };

  const getThreadMessages = (threadId) => {
    // Return all emails in this thread, sorted by date asc
    return emails
      .filter(e => e.threadId === threadId)
      .sort((a, b) => new Date(a.receivedAt) - new Date(b.receivedAt));
  };

  const bulkDelete = async (emailIds) => {
    setEmails(prev => prev.filter(email => !emailIds.includes(email.id)));
    return { success: true };
  };

  const value = {
    emails,
    selectedEmail,
    loading,
    fetchEmails,
    getEmailById,
    categorizeEmail,
    generateDraft,
    summarizeThread,
    markAsRead,
    archiveEmail,
    setSelectedEmail,
    bulkArchive,
    bulkMarkRead,
    bulkDelete,
    saveDraft,
    addManualEmail,
    getThreadMessages,
  };

  return <EmailContext.Provider value={value} > {children}</EmailContext.Provider >;
};
