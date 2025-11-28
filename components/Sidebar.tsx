import React from 'react';
import { LayoutDashboard, Database, CheckSquare, FileText, Code2, Settings } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'editor', label: 'Code Editor', icon: <Code2 size={20} /> },
    { id: 'database', label: 'DB Architect', icon: <Database size={20} /> },
    { id: 'tasks', label: 'Project Tasks', icon: <CheckSquare size={20} /> },
    { id: 'notes', label: 'Engineering Notes', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-natural-900 text-natural-100 flex flex-col h-full border-r border-natural-800 flex-shrink-0 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center shadow-lg shadow-forest-900/50">
          <Code2 className="text-white" size={18} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-natural-50">DevSpace</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-natural-800 text-white shadow-sm ring-1 ring-natural-700' 
                : 'text-natural-400 hover:bg-natural-800/50 hover:text-natural-200'
              }`}
          >
            <span className={`${currentView === item.id ? 'text-forest-500' : 'text-natural-500 group-hover:text-natural-400'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-natural-800">
        <div className="flex items-center gap-3 px-3 py-2 text-natural-500 text-xs">
          <Settings size={14} />
          <span>v1.0.0 • React 18</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;