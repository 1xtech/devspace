import React, { useState, useEffect, useCallback } from 'react';
import { Play, Sparkles, Copy, Check } from 'lucide-react';
import { explainCode } from '../services/geminiService';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>(`// Welcome to DevSpace Editor
function calculateEfficiency(tasks: number, time: number) {
  if (time <= 0) return 0;
  return tasks / time;
}

// Start typing your code here...`);
  
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExplain = async () => {
    setIsExplaining(true);
    const result = await explainCode(code);
    setExplanation(result);
    setIsExplaining(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple line number generation
  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-natural-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-natural-200 bg-natural-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 bg-natural-200 text-natural-700 rounded text-mono">TypeScript</span>
          <span className="text-xs text-natural-500">main.ts</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 text-natural-500 hover:text-natural-800 hover:bg-natural-200 rounded transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={16} className="text-forest-600" /> : <Copy size={16} />}
          </button>
          <button 
            onClick={handleExplain}
            disabled={isExplaining}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-natural-300 text-natural-700 text-xs font-medium rounded hover:bg-natural-100 hover:border-natural-400 transition-all shadow-sm"
          >
            <Sparkles size={14} className={isExplaining ? "animate-spin text-amber-500" : "text-amber-500"} />
            {isExplaining ? 'Analyzing...' : 'Explain with AI'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-600 text-white text-xs font-medium rounded hover:bg-forest-700 transition-all shadow-sm shadow-forest-900/10">
            <Play size={14} fill="currentColor" />
            Run
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex relative font-mono text-sm">
          {/* Line Numbers */}
          <div className="bg-natural-50 text-natural-400 py-4 px-2 text-right select-none border-r border-natural-100 w-12 flex-shrink-0">
            {lines.map(line => (
              <div key={line} className="h-6 leading-6 text-xs">{line}</div>
            ))}
          </div>
          
          {/* Text Area behaving like code editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-white text-natural-800 p-4 resize-none outline-none leading-6 whitespace-pre font-mono selection:bg-forest-100 selection:text-forest-900"
            spellCheck={false}
          />
        </div>

        {/* AI Panel (Right Side) - Shows up when explanation exists */}
        {explanation && (
          <div className="w-80 border-l border-natural-200 bg-natural-50 flex flex-col shadow-inner">
             <div className="p-4 border-b border-natural-200 flex justify-between items-center bg-white">
                <h3 className="font-semibold text-natural-800 text-sm flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  AI Analysis
                </h3>
                <button onClick={() => setExplanation(null)} className="text-natural-400 hover:text-natural-600">&times;</button>
             </div>
             <div className="p-4 overflow-y-auto flex-1 prose prose-sm prose-stone">
                <p className="whitespace-pre-wrap text-natural-700 text-sm leading-relaxed">{explanation}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;