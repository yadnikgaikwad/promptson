import React, { useState, useEffect } from 'react';
import FollowingPointerSegmentedControl from './FollowingPointerSegmentedControl';

const getSavedPrompts = () => {
  const saved = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && value.prompt) {
        saved.push({ id: key, ...value });
      }
    } catch (_) {
      // skip non-JSON or unrelated keys
    }
  }
  return saved;
};

const SavedPromptsPage = () => {
  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    setSavedPrompts(getSavedPrompts());
  }, []);

  const handleUnsave = (id) => {
    localStorage.removeItem(id);
    setSavedPrompts(getSavedPrompts());
  };

  const promptTypes = ['Image Prompt', 'Design Prompt', 'Coding Prompt', 'Copywriting Prompt'];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Segmented Control Bar */}
      <div className="flex flex-col items-center w-full mb-8">
        <FollowingPointerSegmentedControl
          options={promptTypes}
          activeIndex={0}
          onChange={() => {}}
          className="mb-2"
          disabledIndices={[1, 2, 3]}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {savedPrompts.length === 0 ? (
          <div className="col-span-3 text-center text-white opacity-60">No saved prompts yet.</div>
        ) : (
          savedPrompts.map((item, _idx) => {
            const promptId = item.promptId || `I${_idx + 1}`;
            return (
              <div
                className="bg-black text-white rounded-2xl p-6 flex flex-col gap-4 font-mono shadow-lg border border-white/10 transition-shadow duration-150 h-80"
                key={item.id}
                style={{ letterSpacing: '0.01em' }}
              >
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs opacity-80">Prompt ID: {promptId}</span>
                    <span className="text-xs opacity-80">★ Saved</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold tracking-tight">{item.title || 'Untitled'}</span>
                    <span className="text-xs opacity-80">Class | Image</span>
                  </div>
                  <div className="mb-2 flex-1 flex flex-col">
                    <span className="font-semibold text-sm">Prompt</span>
                    <div className="mt-1 text-xs whitespace-pre-line break-words opacity-90 overflow-auto flex-1 h-20">{item.prompt}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs opacity-70 border-t border-white/10 pt-2">
                  <span>Created On | {item.createdOn || '--/--/--'}</span>
                  <button
                    type="button"
                    className="px-3 py-1 border border-white/30 rounded-md text-xs font-mono transition-colors bg-black/80 text-white hover:bg-white hover:text-black"
                    onClick={() => handleUnsave(item.id)}
                  >
                    Unsave
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedPromptsPage; 