import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  Cog6ToothIcon,
  SwatchIcon,
  BellIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: localStorage.getItem('connectedEmail') || 'john.doe@example.com',
  });

  const [aiConfig, setAiConfig] = useState({
    tone: 'Professional',
    autoDraft: true,
    signature: 'Best regards,\nJohn Doe',
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAiChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAiConfig({ ...aiConfig, [e.target.name]: value });
  };

  const saveSettings = () => {
    // Mock save
    alert('Settings saved successfully!');
    if (profile.email) localStorage.setItem('connectedEmail', profile.email);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Cog6ToothIcon className="w-8 h-8 text-primary-600" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account, AI preferences, and application settings
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
          <UserIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
          <SparklesIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Copilot Config</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Reply Tone</label>
            <div className="grid grid-cols-3 gap-4">
              {['Professional', 'Friendly', 'Concise'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setAiConfig({ ...aiConfig, tone })}
                  className={`px-4 py-3 rounded-xl border font-medium text-sm transition-all ${aiConfig.tone === tone
                      ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                    }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Signature</label>
            <textarea
              name="signature"
              value={aiConfig.signature}
              onChange={handleAiChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">Auto-Draft Replies</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Automatically generate drafts for new high-priority emails</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="autoDraft"
                checked={aiConfig.autoDraft}
                onChange={handleAiChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-3">
          <SwatchIcon className="w-6 h-6 text-pink-600" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Toggle application theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${darkMode ? 'bg-primary-600' : 'bg-gray-200'
                }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={saveSettings}
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
