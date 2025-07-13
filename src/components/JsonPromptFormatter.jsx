import React, { useState } from 'react';
import { PromptTransformer } from '@/lib/prompt-transformer';

const JsonPromptFormatter = () => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('chatgpt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleTransform = () => {
    try {
      setError('');
      const result = PromptTransformer.transformToJSON(prompt, 'auto', platform, {});
      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 w-full">
      <div className="dashboard-card no-zoom w-full">
        {/* Only keep the main content, remove the text-center mb-6 header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4 flex flex-col h-full">
            <div>
              <label className="block text-sm font-medium mb-2 dashboard-label">Target Platform</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-2 bg-[#18181b] border border-[#23232a] rounded-md text-white"
              >
                <option value="chatgpt">ChatGPT</option>
                <option value="claude">Claude</option>
                <option value="gemini">Google Gemini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dashboard-label">Natural Language Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                rows={8}
                className="w-full p-3 bg-[#18181b] border border-[#23232a] rounded-md resize-none text-white"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                Error: {error}
              </div>
            )}
          </div>
          <div className="space-y-4 flex flex-col h-full">
            <div>
              <label className="block text-sm font-medium mb-2 dashboard-label">JSON Output</label>
              <pre className="w-full h-96 p-3 bg-[#18181b] border border-[#23232a] rounded-md overflow-auto text-sm font-mono text-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-[#23232a]"
                style={{ scrollbarColor: '#e5e7eb #23232a', scrollbarWidth: 'thin' }}>
                {output || 'Click "Transform to JSON" to generate formatted prompt'}
              </pre>
            </div>
          </div>
        </div>
        {/* Aligned Action Buttons */}
        <div className="flex flex-row gap-6 mt-6">
          <button
            onClick={handleTransform}
            disabled={!prompt.trim()}
            className="flex-1 bg-[#ffd600] text-[#18181b] py-2 px-4 rounded-md font-bold hover:bg-yellow-400 disabled:bg-gray-400"
          >
            Transform to JSON
          </button>
          {output && (
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="flex-1 bg-[#00e676] text-[#18181b] py-2 px-4 rounded-md font-bold hover:bg-green-400"
            >
              Copy to Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonPromptFormatter; 