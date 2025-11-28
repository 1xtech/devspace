import React, { useState } from 'react';
import { Plus, Search, Tag, Trash2, Calendar } from 'lucide-react';
import { Note } from '../types';

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Deployment Strategy',
    content: 'Use Docker for containerization.\nDeploy to AWS ECS using Fargate for serverless management.\n\nSteps:\n1. Build image\n2. Push to ECR\n3. Update service',
    updatedAt: new Date(),
    tags: ['devops', 'aws']
  },
  {
    id: '2',
    title: 'API Response Format',
    content: 'All API responses should follow the standard envelope pattern:\n\n{\n  "data": { ... },\n  "meta": { ... },\n  "error": null\n}',
    updatedAt: new Date(Date.now() - 86400000),
    tags: ['api', 'standards']
  }
];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initialNotes[0].id);
  const [search, setSearch] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateNote = (field: keyof Note, value: string) => {
    if (!selectedNoteId) return;
    setNotes(notes.map(n => n.id === selectedNoteId ? { ...n, [field]: value, updatedAt: new Date() } : n));
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date(),
      tags: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (selectedNoteId === id) {
      setSelectedNoteId(newNotes[0]?.id || null);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex bg-white rounded-xl shadow-sm border border-natural-200 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-72 bg-natural-50 border-r border-natural-200 flex flex-col">
        <div className="p-4 border-b border-natural-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-natural-400" size={16} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-natural-200 rounded-lg text-sm focus:outline-none focus:border-forest-500 transition-colors"
            />
          </div>
          <button 
            onClick={createNote}
            className="w-full py-2 bg-natural-900 text-white rounded-lg text-sm font-medium hover:bg-natural-800 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> New Note
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-4 border-b border-natural-100 cursor-pointer transition-colors group relative
                ${selectedNoteId === note.id ? 'bg-white border-l-4 border-l-forest-500' : 'hover:bg-natural-100 border-l-4 border-l-transparent'}`}
            >
              <h4 className={`text-sm font-semibold mb-1 ${selectedNoteId === note.id ? 'text-natural-900' : 'text-natural-700'}`}>
                {note.title}
              </h4>
              <p className="text-xs text-natural-500 line-clamp-2 mb-2">{note.content || "No additional text"}</p>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] text-natural-400 flex items-center gap-1">
                   {note.updatedAt.toLocaleDateString()}
                 </span>
                 <button 
                  onClick={(e) => deleteNote(e, note.id)}
                  className="opacity-0 group-hover:opacity-100 text-natural-400 hover:text-red-500 transition-opacity p-1"
                 >
                   <Trash2 size={12} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      {selectedNote ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-6 border-b border-natural-100">
            <input 
              type="text" 
              value={selectedNote.title}
              onChange={(e) => handleUpdateNote('title', e.target.value)}
              className="text-3xl font-bold text-natural-800 bg-transparent outline-none w-full placeholder:text-natural-300"
              placeholder="Note Title"
            />
            <div className="flex items-center gap-4 mt-3 text-natural-400 text-sm">
              <span className="flex items-center gap-1.5 bg-natural-50 px-2 py-1 rounded-md border border-natural-100">
                <Calendar size={14} />
                {selectedNote.updatedAt.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 bg-natural-50 px-2 py-1 rounded-md border border-natural-100">
                <Tag size={14} />
                {selectedNote.tags.length > 0 ? selectedNote.tags.join(', ') : 'No tags'}
              </span>
            </div>
          </div>
          <textarea 
            value={selectedNote.content}
            onChange={(e) => handleUpdateNote('content', e.target.value)}
            className="flex-1 p-6 resize-none outline-none text-natural-700 leading-relaxed text-base bg-transparent"
            placeholder="Start writing..."
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-natural-300">
          <p>Select a note to view</p>
        </div>
      )}
    </div>
  );
};

export default Notes;