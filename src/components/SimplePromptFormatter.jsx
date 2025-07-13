import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePrompt } from '../lib/generatePrompt';
import FollowingPointerSegmentedControl from './FollowingPointerSegmentedControl';

const promptTypes = ['Image Prompt', 'Design Prompt', 'Coding Prompt', 'Copywriting Prompt'];

const categories = [
  'Image Prompt',
  'Design Prompt',
  'Coding Prompt',
  'Copywriting Prompt',
];

const SimplePromptFormatter = () => {
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modalPrompt, setModalPrompt] = useState(null); // NEW
  const [modalCopied, setModalCopied] = useState(false); // NEW
  const scrollRef = useRef(null); // NEW
  const [isDragging, setIsDragging] = useState(false); // NEW
  const dragged = useRef(false); // NEW
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    setCopied(false);
    setSaved(false);
    try {
      const aiPrompt = await generatePrompt(goal, category);
      setResult(aiPrompt);
    } catch (error) {
      setResult('Something went wrong.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleSave = () => {
    if (result) {
      localStorage.setItem('aiPromptGeneratorLast', result);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }
  };

  // Modal handlers
  const closeModal = () => setModalPrompt(null);
  const handleModalCopy = () => {
    if (modalPrompt) {
      navigator.clipboard.writeText(modalPrompt.value);
      setModalCopied(true);
      setTimeout(() => setModalCopied(false), 1200);
    }
  };

  // Drag-to-scroll handlers
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 5) dragged.current = true;
    scrollRef.current.scrollLeft = scrollStart - dx;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // Attach/remove mousemove/up listeners globally when dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseLeave);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDragging]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-2 sm:px-4">
      {/* Prompt Type Segmented Control - Standalone */}
      <div className="flex flex-col items-center w-full mb-8">
        <FollowingPointerSegmentedControl
          options={promptTypes}
          activeIndex={promptTypes.indexOf(category)}
          onChange={idx => {
            setCategory(promptTypes[idx]);
            if (promptTypes[idx] === 'Image Prompt') navigate('/image-prompts');
          }}
          className="mb-2"
          disabledIndices={[1, 2, 3]}
        />
      </div>
      {/* Top Overview Section */}
      {/* Card slider removed as requested */}
      {/* AI Prompt Generator Card */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#18181b] border border-[#23232a] rounded-2xl shadow-lg p-8 flex flex-col gap-8 w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">AI Prompt Generator</h1>
            <p className="text-gray-400">Describe your goal and generate a tailored AI prompt instantly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
            {/* Left: Input Fields */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Describe your goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="e.g. Generate a logo for a tech startup"
                  className="w-full px-4 py-3 rounded-md bg-[#23232a] text-white border border-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#ffd600] placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Prompt Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-[#23232a] text-white border border-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#ffd600]"
                >
                  <option value="Image Prompt">Image Prompt</option>
                  <option value="Design Prompt" disabled>Design Prompt</option>
                  <option value="Coding Prompt" disabled>Coding Prompt</option>
                  <option value="Copywriting Prompt" disabled>Copywriting Prompt</option>
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!goal.trim() || loading}
                className="w-full py-3 rounded-md bg-black text-white font-semibold text-lg hover:bg-white hover:text-black border border-white transition-colors disabled:opacity-60"
              >
                {loading ? 'Generating...' : 'Generate Prompt'}
              </button>
            </div>
            {/* Right: Output Box */}
            <div className="flex flex-col gap-4 h-full">
              <div className="bg-[#101012] border border-white/20 rounded-lg p-6 flex flex-col gap-4 h-full min-h-[220px]">
                <div className="text-base whitespace-pre-line flex-1" style={{ color: result ? '#fff' : undefined }}>
                  {result ? result : <span className="text-gray-400">Your generated prompt will appear here.</span>}
                </div>
                {result && (
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 rounded-md font-medium text-sm border border-white transition-colors ${copied ? 'bg-white text-black' : 'bg-black text-white hover:bg-white hover:text-black'}`}
                    >
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button
                      onClick={handleSave}
                      className={`px-4 py-2 rounded-md font-medium text-sm border border-white transition-colors ${saved ? 'bg-white text-black' : 'bg-black text-white hover:bg-white hover:text-black'}`}
                    >
                      {saved ? 'Saved!' : 'Save to LocalStorage'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Popup */}
      {modalPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={closeModal}
        >
          <div
            className="bg-[#18181b] border border-white rounded-xl p-8 max-w-md w-full relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-white hover:text-yellow-300 font-bold focus:outline-none"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-xl font-bold dashboard-accent-yellow mb-2">{modalPrompt.label}</div>
            <div className="dashboard-label text-base text-white whitespace-pre-line mb-10">{modalPrompt.value}</div>
            {modalCopied && (
              <div className="absolute bottom-16 right-4 bg-white text-black px-3 py-1 rounded shadow text-sm font-semibold animate-fade-in">
                Copied to clipboard
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                className="bg-black border border-white font-bold px-4 py-2 rounded-md shadow-md transition-colors flex items-center justify-center h-10 min-h-[40px] text-white hover:bg-white hover:text-black"
                onClick={handleModalCopy}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePromptFormatter;

