import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  EnvelopeOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [statsData, setStatsData] = useState({
    processed: '...',
    savedTime: '...',
    responseRate: '...',
    avgReplyTime: '...'
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics');
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  // Mock Data for Analytics
  const stats = [
    { label: 'Emails Processed', value: statsData.processed || '1,284', change: '+12%', icon: EnvelopeOpenIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Time Saved', value: statsData.savedTime || '18.5 hrs', change: '+5%', icon: ClockIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Response Rate', value: statsData.responseRate || '94%', change: '+2%', icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Avg. Reply Time', value: statsData.avgReplyTime || '12 min', change: '-15%', icon: ChartBarIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const categoryData = [
    { name: 'General', value: 35, color: 'bg-gray-400' },
    { name: 'Support', value: 25, color: 'bg-blue-500' },
    { name: 'Meetings', value: 20, color: 'bg-purple-500' },
    { name: 'Financial', value: 15, color: 'bg-green-500' },
    { name: 'Urgent', value: 5, color: 'bg-red-500' },
  ];

  const activityData = [40, 65, 45, 80, 55, 90, 70]; // Mock daily activity

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ChartBarIcon className="w-8 h-8 text-primary-600" />
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of your email productivity and AI performance
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-primary-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Email Categories</h2>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <span className="text-gray-500">{cat.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart (Simple CSS Bar Chart) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Activity</h2>
            <select className="text-sm border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 h-48">
            {activityData.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full bg-primary-100 dark:bg-primary-900/30 rounded-t-lg relative group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors"
                  style={{ height: `${value}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {value} emails
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <SparklesIcon className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">AI Insights</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              You receive 40% of your emails between 9 AM and 11 AM. Consider blocking this time for focused work and letting the AI draft auto-replies for non-urgent matters.
            </p>
            <button className="px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors">
              Configure Auto-Replies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Start Icon for the banner
function SparklesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

export default Analytics;
