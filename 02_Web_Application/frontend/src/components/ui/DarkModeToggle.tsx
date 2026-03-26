'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 group"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 ${
            darkMode ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
            darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
          }`}
        />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
        darkMode 
          ? 'bg-blue-500/20 shadow-lg shadow-blue-500/30' 
          : 'bg-yellow-500/20 shadow-lg shadow-yellow-500/30'
      }`} />
    </button>
  );
}
