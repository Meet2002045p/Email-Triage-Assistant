import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import {
  ArrowLeftIcon,
  ArchiveBoxIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedEmail, getEmailById, categorizeEmail, generateDraft, saveDraft, summarizeThread, archiveEmail, markAsRead, getThreadMessages } = useEmail();
  const [loading, setLoading] = useState(false);
  const [draftContext, setDraftContext] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [summary, setSummary] = useState('');
  const [showDraftModal, setShowDraftModal] = useState(false);

  useEffect(() => {
    if (id) {
      getEmailById(id);
      markAsRead(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGenerateDraft = async (priority = 'normal') => {
    setLoading(true);
    try {
      const result = await generateDraft(id, draftContext || `Generate a ${priority} priority reply`);
      setGeneratedDraft(result.draft);
      setShowDraftModal(false);
    } catch (error) {
      alert('Failed to generate draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft(id, generatedDraft);
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Failed to save draft');
    }
  };

  const quickReply = async (type) => {
    setLoading(true);
    try {
      const contexts = {
        acknowledge: 'Generate a brief acknowledgment that I received this and will respond in detail soon',
        positive: 'Generate a positive, agreeable response',
        decline: 'Generate a polite decline or "no" response',
        question: 'Generate a response that asks for more information or clarification'
      };
      const result = await generateDraft(id, contexts[type]);
      setGeneratedDraft(result.draft);
    } catch (error) {
      alert('Failed to generate quick reply');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await summarizeThread(id);
      setSummary(result.summary);
    } catch (error) {
      alert('Failed to summarize thread');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveEmail(id);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to archive email');
    }
  };

  if (!selectedEmail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const priorityConfig = {
    urgent: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400', label: 'URGENT - Reply Immediately' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', label: 'High Priority Reply' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400', label: 'Medium Priority' },
    low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400', label: 'Low Priority' },
  };

  const priority = priorityConfig[selectedEmail?.replyPriority] || priorityConfig.medium;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-sm transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-primary dark:text-gray-200">
              {selectedEmail.subject}
            </h1>
            {selectedEmail.needsReply && (
              <div className={`inline-flex items-center gap-2 px-2 py-1 ${priority.bg} ${priority.text} rounded-full text-xs font-semibold mt-2 border-2 ${priority.border}`}>
                <SparklesIcon className="w-4 h-4" />
                {priority.label}
              </div>
            )}
          </div>
        </div>

        {/* Priority Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleGenerateDraft('detailed')}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Generate Reply
            </button>
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="btn-secondary flex items-center gap-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <DocumentTextIcon className="w-4 h-4" />
              Summarize
            </button>
            <button
              onClick={handleArchive}
              className="btn-secondary flex items-center gap-2 text-sm text-secondary dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ArchiveBoxIcon className="w-4 h-4" />
              Archive
            </button>
          </div>

          {/* Quick Reply Options */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-secondary flex items-center">Quick Replies:</span>
            <button
              onClick={() => quickReply('acknowledge')}
              disabled={loading}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
            >
              👍 Acknowledge
            </button>
            <button
              onClick={() => quickReply('positive')}
              disabled={loading}
              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
            >
              ✓ Yes/Agree
            </button>
            <button
              onClick={() => quickReply('decline')}
              disabled={loading}
              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
            >
              ✗ Decline
            </button>
            <button
              onClick={() => quickReply('question')}
              disabled={loading}
              className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
            >
              ❓ Ask Question
            </button>
          </div>
        </div>
      </div>

      {/* Email Thread Content */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Messages */}
          {getThreadMessages(selectedEmail.threadId || selectedEmail.id).map((message, index) => (
            <div key={message.id} className={`group ${index === getThreadMessages(selectedEmail.threadId).length - 1 ? 'mb-8' : ''}`}>
              {/* Thread Connector Line */}
              {index > 0 && <div className="ml-9 -mt-8 h-8 w-0.5 bg-gray-200 dark:bg-gray-700 mx-auto mb-2"></div>}

              <div className={`card transition-all ${message.id === id ? 'ring-2 ring-primary-500 shadow-lg' : 'opacity-90 hover:opacity-100'}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base shadow-sm ${message.from === 'Me'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                    {message.from?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-primary dark:text-gray-200">
                        {message.from}
                      </h2>
                      <span className="text-xs text-secondary dark:text-gray-400">
                        {new Date(message.receivedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary dark:text-gray-400">
                      <span>To: {message.to}</span>
                      {message.category && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {message.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none text-sm dark:prose-invert dark:text-gray-300 ml-14">
                  <div dangerouslySetInnerHTML={{ __html: message.body || message.textBody }} />
                </div>
              </div>
            </div>
          ))}

          {/* Summary Section (Latest Only) */}
          {summary && (
            <div className="card bg-accent-50 border-accent-200 dark:bg-accent-900/20 dark:border-accent-700">
              <h3 className="text-lg font-semibold text-primary dark:text-gray-200 mb-3 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                AI Summary
              </h3>
              <p className="text-secondary dark:text-gray-300 whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {/* Generated Draft Section */}
          {generatedDraft && (
            <div className="card bg-green-50 border-green-200 ring-1 ring-green-300 shadow-md">
              <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-5 h-5 text-green-600" />
                Draft Reply
              </h3>
              <div className="bg-white rounded-lg p-4 border border-green-300 shadow-inner">
                <p className="text-secondary whitespace-pre-wrap font-mono text-sm">{generatedDraft}</p>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button className="btn-secondary text-sm bg-white hover:bg-gray-50">Copy</button>
                <button onClick={handleSaveDraft} className="btn-secondary text-sm bg-white hover:bg-gray-50">Save Draft</button>
                <button className="btn-primary text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">Send Reply</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Generate Reply</h3>
            <textarea
              value={draftContext}
              onChange={(e) => setDraftContext(e.target.value)}
              placeholder="Add context for the reply (optional)..."
              className="input-field min-h-32 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDraftModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDraft}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetail;
