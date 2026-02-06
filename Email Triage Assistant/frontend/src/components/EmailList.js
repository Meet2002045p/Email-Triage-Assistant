import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlusIcon,
  SparklesIcon,
  CalendarIcon,
  ArchiveBoxIcon,
  TrashIcon,
  EnvelopeOpenIcon,
  MinusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const EmailList = ({ isDrafts = false }) => {
  const navigate = useNavigate();
  const { emails, loading, fetchEmails, addManualEmail, bulkArchive, bulkMarkRead, bulkDelete } = useEmail();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('needs-reply');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [emailAddress, setEmailAddress] = useState('');

  useEffect(() => {
    fetchEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailClick = (emailId) => {
    navigate(`/dashboard/email/${emailId}`);
  };

  const handleAddEmail = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    await addManualEmail(emailAddress);
    setShowAddModal(false);
    // Force re-render to show connected state
    fetchEmails();
  };

  const toggleSelection = (e, emailId) => {
    e.stopPropagation();
    const newSelection = new Set(selectedEmails);
    if (newSelection.has(emailId)) {
      newSelection.delete(emailId);
    } else {
      newSelection.add(emailId);
    }
    setSelectedEmails(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedEmails.size === filteredEmails.length && filteredEmails.length > 0) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredEmails.map(e => e.id)));
    }
  };

  const handleBulkAction = async (action) => {
    const ids = Array.from(selectedEmails);
    if (action === 'archive') await bulkArchive(ids);
    if (action === 'read') await bulkMarkRead(ids);
    if (action === 'delete') await bulkDelete(ids);
    setSelectedEmails(new Set());
  };

  // Sort emails by priority for reply
  const sortedEmails = [...emails].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.replyPriority] || 99) - (priorityOrder[b.replyPriority] || 99);
  });

  const filteredEmails = sortedEmails.filter((email) => {
    const matchesSearch =
      email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from?.toLowerCase().includes(searchTerm.toLowerCase());

    // Date Filtering
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const emailDate = new Date(email.receivedAt);
      const now = new Date();
      const diffTime = Math.abs(now - emailDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === 'today') matchesDate = diffDays <= 1;
      if (dateFilter === 'week') matchesDate = diffDays <= 7;
      if (dateFilter === 'month') matchesDate = diffDays <= 30;
    }

    if (!matchesSearch || !matchesDate) return false;

    // Drafts filtering
    if (isDrafts) {
      return email.isDraft;
    }

    // Regular filtering - hide drafts
    if (email.isDraft) return false;

    if (filter === 'needs-reply') return email.needsReply;
    if (filter === 'urgent') return email.replyPriority === 'urgent';
    if (filter === 'high') return email.replyPriority === 'high';
    if (filter === 'medium') return email.replyPriority === 'medium';
    if (filter === 'low') return email.replyPriority === 'low';
    if (filter === 'all') return true;

    return true;
  });

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: ExclamationTriangleIcon,
        label: 'URGENT - Reply Now',
        textColor: 'text-red-700'
      },
      high: {
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: ClockIcon,
        label: 'High Priority',
        textColor: 'text-orange-700'
      },
      medium: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: ClockIcon,
        label: 'Medium Priority',
        textColor: 'text-yellow-700'
      },
      low: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircleIcon,
        label: 'Low Priority',
        textColor: 'text-green-700'
      },
    };
    return configs[priority] || { color: 'bg-gray-100 text-gray-700', icon: ClockIcon, label: 'Unknown', textColor: 'text-gray-600' };
  };

  const needsReplyCount = emails.filter(e => e.needsReply).length;
  const urgentCount = emails.filter(e => e.replyPriority === 'urgent').length;

  const formatDate = (date) => {
    const emailDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (emailDate.toDateString() === today.toDateString()) {
      return emailDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (emailDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return emailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-colors">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Email Triage
                </span>
                <SparklesIcon className="w-6 h-6 text-primary-600" />
              </h1>
              <p className="text-sm text-secondary mt-1">
                <span className="font-semibold text-indigo-600">{needsReplyCount}</span> emails need your response
                {urgentCount > 0 && <span className="text-red-600 font-semibold ml-2">• {urgentCount} URGENT</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-accent-700 shadow transition-all text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Connect Mailbox
              </button>
              <button
                onClick={fetchEmails}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all text-sm"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-primary-600' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 relative min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white font-medium text-sm transition-colors"
              >
                <option value="needs-reply">📬 Needs Reply</option>
                <option value="urgent">🚨 Urgent</option>
                <option value="high">⚠️ High Priority</option>
                <option value="medium">⏰ Medium Priority</option>
                <option value="low">✓ Low Priority</option>
                <option value="all">All Emails</option>
              </select>
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white font-medium text-sm transition-colors"
                aria-label="Filter by date"
              >
                <option value="all">📅 All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between transition-colors shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center justify-center w-5 h-5 rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 text-primary-600 bg-white dark:bg-gray-700"
          >
            {selectedEmails.size > 0 && selectedEmails.size < filteredEmails.length ? (
              <MinusIcon className="w-3 h-3 text-primary-600 dark:text-primary-400" />
            ) : selectedEmails.size === filteredEmails.length && filteredEmails.length > 0 ? (
              <CheckCircleIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            ) : null}
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedEmails.size > 0 ? `${selectedEmails.size} selected` : 'Select All'}
          </span>
        </div>

        {selectedEmails.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('read')}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Mark as Read"
            >
              <EnvelopeOpenIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Archive"
            >
              <ArchiveBoxIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto">
          {loading && emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Reading your mailbox with AI...</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Analyzing and categorizing all emails</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-6">
                <SparklesIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </div>
              {localStorage.getItem('connectedEmail') ? (
                <>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mailbox Connected!</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Email: {localStorage.getItem('connectedEmail')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Ready for real email integration</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No mailbox connected</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Connect your email to analyze your entire mailbox</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Connect Your Mailbox
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Thread-based Rendering */}
              {/* Actual Implementation below */}
              {Array.from(new Set(filteredEmails.map(e => e.threadId || e.id))).map(threadId => {
                // Get all emails for this thread that match the filter
                const threadEmails = filteredEmails.filter(e => (e.threadId === threadId) || (e.id === threadId));
                const latestEmail = threadEmails[0]; // Assuming sorted order

                if (!latestEmail) return null;

                // Get TOTAL count for this thread from the global list, not just filtered
                const totalThreadCount = emails.filter(e => e.threadId === latestEmail.threadId).length;

                const email = latestEmail;
                const priorityConfig = getPriorityConfig(email.replyPriority);
                const PriorityIcon = priorityConfig.icon;

                return (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email.id)}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-0.5 border-l-4 dark:border-opacity-80 ${email.replyPriority === 'urgent' ? 'border-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/10 dark:to-gray-800' :
                      email.replyPriority === 'high' ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800' :
                        email.replyPriority === 'medium' ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800' :
                          'border-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/10 dark:to-gray-800'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-3.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => toggleSelection(e, email.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedEmails.has(email.id)
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:border-primary-400'
                            }`}
                        >
                          {selectedEmails.has(email.id) && <CheckCircleIcon className="w-4 h-4 text-white" />}
                        </button>
                      </div>

                      <div className="flex-shrink-0 relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg shadow">
                          {email.from?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {totalThreadCount > 1 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                            {totalThreadCount}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-semibold text-primary dark:text-gray-200 truncate">
                            {email.from}
                            {totalThreadCount > 1 && <span className="text-xs font-normal text-gray-500 ml-2">({totalThreadCount} messages)</span>}
                          </h3>
                          <span className="text-sm text-secondary dark:text-gray-400 ml-3 flex-shrink-0 font-medium">
                            {formatDate(email.receivedAt)}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-primary dark:text-gray-300 mb-3 truncate">
                          {email.subject}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                          {email.snippet || email.body?.substring(0, 150)}
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                          {email.needsReply && (
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 shadow-sm ${priorityConfig.color}`}>
                              <PriorityIcon className="w-5 h-5" />
                              {priorityConfig.label}
                            </span>
                          )}
                          {email.aiAnalysis && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">
                              <SparklesIcon className="w-4 h-4" />
                              AI Analyzed
                            </span>
                          )}
                          {email.estimatedReplyTime && (
                            <span className="text-sm text-gray-500 font-medium">
                              ⏱️ ~{email.estimatedReplyTime} min reply
                            </span>
                          )}
                          {email.category && (
                            <span className="px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-xs font-semibold">
                              {email.category}
                            </span>
                          )}
                        </div>

                        {email.aiSummary && (
                          <div className="mt-3 p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 border-l-4 border-accent-400 dark:border-accent-500">
                            <strong className="text-accent-900 dark:text-accent-300">AI Summary:</strong> {email.aiSummary}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Email Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-xl transform scale-100 animate-in transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">📬 Connect Your Mailbox</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> Enter your email address and AI will analyze your entire mailbox, categorize all emails, determine priorities, and suggest replies.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">We'll simulate reading your mailbox and analyzing all emails</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmail}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-md hover:shadow transition-all flex items-center gap-2 text-sm"
              >
                <SparklesIcon className="w-4 h-4" />
                Read & Analyze Mailbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailList;
