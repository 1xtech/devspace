import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, MoreHorizontal, Wand2 } from 'lucide-react';
import { Task, Project } from '../types';
import { suggestTasks } from '../services/geminiService';

const initialTasks: Task[] = [
  { id: '1', title: 'Setup React Project', status: 'done', priority: 'high' },
  { id: '2', title: 'Design Database Schema', status: 'in-progress', priority: 'high' },
  { id: '3', title: 'Implement Auth', status: 'todo', priority: 'medium' },
];

const ProjectManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const addTask = (title: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: 'todo',
      priority: 'medium'
    };
    setTasks([...tasks, newTask]);
  };

  const handleAddTask = () => {
    addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    const suggestions = await suggestTasks("A modern web application for developers");
    const newTasks = suggestions.map((s, i) => ({
      id: Date.now().toString() + i,
      title: s,
      status: 'todo' as const,
      priority: 'medium' as const
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setAiLoading(false);
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-rose-100 text-rose-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-forest-100 text-forest-700';
    }
  };

  const Column = ({ title, status, icon: Icon }: { title: string, status: Task['status'], icon: any }) => (
    <div className="flex-1 bg-natural-100 rounded-xl p-4 flex flex-col gap-3 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-natural-700 flex items-center gap-2">
          <Icon size={18} />
          {title}
        </h3>
        <span className="text-xs font-medium bg-natural-200 text-natural-600 px-2 py-0.5 rounded-full">
          {tasks.filter(t => t.status === status).length}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {tasks.filter(t => t.status === status).map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-natural-200 hover:border-natural-300 transition-colors group cursor-grab active:cursor-grabbing">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <button className="text-natural-300 hover:text-natural-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className="text-sm text-natural-800 font-medium leading-tight">{task.title}</p>
            
            <div className="mt-3 flex gap-1 justify-end">
              {status !== 'todo' && (
                <button 
                  onClick={() => moveTask(task.id, 'todo')} 
                  className="p-1 hover:bg-natural-100 rounded text-natural-400 hover:text-natural-600" title="Move to Todo"
                >
                  <Circle size={14} />
                </button>
              )}
              {status !== 'in-progress' && (
                <button 
                  onClick={() => moveTask(task.id, 'in-progress')} 
                  className="p-1 hover:bg-natural-100 rounded text-natural-400 hover:text-amber-600" title="Move to In Progress"
                >
                  <Clock size={14} />
                </button>
              )}
              {status !== 'done' && (
                 <button 
                   onClick={() => moveTask(task.id, 'done')} 
                   className="p-1 hover:bg-natural-100 rounded text-natural-400 hover:text-forest-600" title="Move to Done"
                 >
                   <CheckCircle2 size={14} />
                 </button>
              )}
            </div>
          </div>
        ))}
        {tasks.filter(t => t.status === status).length === 0 && (
          <div className="h-24 border-2 border-dashed border-natural-200 rounded-lg flex items-center justify-center text-natural-400 text-sm">
            Empty
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-natural-800">Project Board</h2>
          <p className="text-natural-500 text-sm">Systematic task management for your sprint</p>
        </div>
        <button 
          onClick={handleAiSuggest}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-natural-800 to-natural-900 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
        >
          <Wand2 size={16} className={aiLoading ? "animate-spin" : ""} />
          {aiLoading ? 'Generating...' : 'AI Suggest Tasks'}
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 bg-white border border-natural-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button 
          onClick={handleAddTask}
          className="px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        <Column title="To Do" status="todo" icon={Circle} />
        <Column title="In Progress" status="in-progress" icon={Clock} />
        <Column title="Done" status="done" icon={CheckCircle2} />
      </div>
    </div>
  );
};

export default ProjectManager;