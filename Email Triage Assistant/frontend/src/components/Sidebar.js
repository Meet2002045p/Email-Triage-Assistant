import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  InboxIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { darkMode, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Needs Reply', href: '/dashboard', icon: InboxIcon, exact: true },
    { name: 'Drafts', href: '/dashboard/drafts', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isOpen ? 'w-56' : 'w-14'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
            {isOpen ? (
              <>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="font-semibold text-primary dark:text-gray-100 text-sm">Email Triage</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.name}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Footer / Theme Toggle */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}
              title={isOpen ? "Toggle Theme" : ""}
            >
              {darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              {isOpen && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
