import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectManager from './components/ProjectManager';
import DatabaseDesigner from './components/DatabaseDesigner';
import CodeEditor from './components/CodeEditor';
import Notes from './components/Notes';
import { View } from './types';
import { LayoutDashboard } from 'lucide-react';

const DashboardView = ({ onChangeView }: { onChangeView: (v: View) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full auto-rows-min">
    <div 
      onClick={() => onChangeView('editor')}
      className="bg-white p-6 rounded-xl shadow-sm border border-natural-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <LayoutDashboard className="text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold text-natural-800 mb-2">Code Editor</h3>
      <p className="text-natural-500 text-sm">Mirror-style editor with AI code explanation capabilities.</p>
    </div>

    <div 
      onClick={() => onChangeView('tasks')}
      className="bg-white p-6 rounded-xl shadow-sm border border-natural-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="h-12 w-12 bg-forest-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <LayoutDashboard className="text-forest-600" />
      </div>
      <h3 className="text-lg font-semibold text-natural-800 mb-2">Project Tasks</h3>
      <p className="text-natural-500 text-sm">Manage your sprint with a systematic Kanban board.</p>
    </div>

    <div 
      onClick={() => onChangeView('database')}
      className="bg-white p-6 rounded-xl shadow-sm border border-natural-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <LayoutDashboard className="text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-natural-800 mb-2">Database Architect</h3>
      <p className="text-natural-500 text-sm">Generate SQL schemas from natural language descriptions.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return (
    <div className="flex h-screen bg-natural-50 text-natural-800 font-sans selection:bg-forest-200 selection:text-forest-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <header className="h-16 border-b border-natural-200 bg-white/80 backdrop-blur-sm flex items-center px-8 justify-between flex-shrink-0 z-10">
          <h2 className="text-lg font-semibold text-natural-700 capitalize">
            {currentView === 'dashboard' ? 'Overview' : currentView.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-natural-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {currentView === 'dashboard' && <DashboardView onChangeView={setCurrentView} />}
          {currentView === 'editor' && <CodeEditor />}
          {currentView === 'database' && <DatabaseDesigner />}
          {currentView === 'tasks' && <ProjectManager />}
          {currentView === 'notes' && <Notes />}
        </div>
      </main>
    </div>
  );
};

export default App;