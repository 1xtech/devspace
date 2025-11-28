import React, { useState } from 'react';
import { Database, ArrowRight, Download, RefreshCw, Layers } from 'lucide-react';
import { generateDatabaseSchema } from '../services/geminiService';
import { DbSchema } from '../types';

const DatabaseDesigner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState<DbSchema | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await generateDatabaseSchema(prompt);
    setSchema(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-natural-800 tracking-tight flex items-center gap-2">
          <Database className="text-forest-600" />
          Database Architect
        </h2>
        <p className="text-natural-500">Describe your project requirements, and let AI design a normalized SQL schema for you.</p>
      </div>

      <div className="bg-white p-1 rounded-xl shadow-sm border border-natural-200 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A library management system with books, authors, members, and loans..."
          className="flex-1 px-4 py-3 bg-transparent outline-none text-natural-800 placeholder:text-natural-400"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-natural-900 text-white font-medium rounded-lg hover:bg-natural-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
          Generate
        </button>
      </div>

      {schema && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex items-center justify-between">
               <h3 className="font-semibold text-natural-700 flex items-center gap-2">
                 <Layers size={18} className="text-forest-600"/>
                 Schema SQL
               </h3>
               <button 
                onClick={() => navigator.clipboard.writeText(schema.sql)}
                className="text-xs font-medium text-natural-500 hover:text-forest-600 flex items-center gap-1"
               >
                 <Download size={14} /> Copy SQL
               </button>
            </div>
            <div className="bg-natural-900 rounded-xl p-4 overflow-auto shadow-inner flex-1 border border-natural-800">
              <pre className="text-sm font-mono text-natural-100 whitespace-pre-wrap leading-relaxed">
                {schema.sql}
              </pre>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-0">
             <h3 className="font-semibold text-natural-700 flex items-center gap-2">
               <Database size={18} className="text-amber-500" />
               Structure Logic
             </h3>
             <div className="bg-white rounded-xl p-6 border border-natural-200 shadow-sm overflow-auto flex-1">
               <div className="prose prose-stone prose-sm">
                 <p className="text-natural-600 leading-7 whitespace-pre-line">
                   {schema.explanation}
                 </p>
               </div>
             </div>
          </div>
        </div>
      )}

      {!schema && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-natural-400 opacity-60">
          <Database size={64} className="mb-4 stroke-1" />
          <p className="text-lg font-light">Ready to design your data structure</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseDesigner;