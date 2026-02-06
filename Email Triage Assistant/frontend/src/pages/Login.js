import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, SparklesIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleStartTriage = () => {
    // Set a demo user for manual email input
    const manualUser = { 
      email: 'manual@user.com', 
      provider: 'manual',
      name: 'Manual User'
    };
    localStorage.setItem('user', JSON.stringify(manualUser));
    // Trigger a page reload to let AuthContext pick up the user
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <EnvelopeIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-primary mb-4">
            Email Triage Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered personal email secretary that reads your entire mailbox, understands, prioritizes, and suggests replies
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">AI Analysis</h3>
            <p className="text-gray-600 text-sm">Automatically reads your entire mailbox, understands context, and categorizes every email</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Smart Priority</h3>
            <p className="text-gray-600 text-sm">Decides what needs reply NOW vs later, groups similar emails together</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <ChartBarIcon className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Reply Suggestions</h3>
            <p className="text-gray-600 text-sm">Generates context-aware reply drafts to save your time</p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              📬 Start Managing Your Emails Smarter
            </h2>
            <p className="text-gray-600 mb-8">
              Enter your email address and let AI read your entire mailbox, analyze priorities, and suggest responses!
            </p>
            
            <button
              onClick={handleStartTriage}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <SparklesIcon className="w-6 h-6" />
              Start Email Triage
            </button>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No sign-up required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                100% Private
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                AI-Powered
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            {showDemo ? '▼' : '▶'} How it works
          </button>
          
          {showDemo && (
            <div className="mt-6 bg-white/60 backdrop-blur rounded-2xl p-8 text-left max-w-3xl mx-auto">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong className="text-primary">Enter Your Email</strong>
                    <p className="text-gray-600 text-sm">Just provide your email address to connect</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong className="text-primary">AI Reads Entire Mailbox</strong>
                    <p className="text-gray-600 text-sm">Analyzes all emails, determines priority, and groups them</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong className="text-primary">Get Smart Replies</strong>
                    <p className="text-gray-600 text-sm">AI suggests appropriate responses you can use</p>
                  </div>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
