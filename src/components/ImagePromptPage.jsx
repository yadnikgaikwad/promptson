import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy as CopyIcon } from 'lucide-react';

const todayStr = new Date().toISOString().slice(0, 10);
const imagePrompts = [
  {
    title: 'Fantasy Landscape',
    prompt: 'A breathtaking fantasy landscape with floating islands and waterfalls, in the style of Studio Ghibli.',
    image: 'https://picsum.photos/400/200',
  },
  {
    title: 'Cyberpunk City',
    prompt: 'A neon-lit cyberpunk city at night, bustling with futuristic vehicles and people.',
    image: 'https://picsum.photos/400/200',
  },
  {
    title: 'Surreal Portrait',
    prompt: 'A surreal portrait of a woman with flowers growing from her hair, photorealistic.',
    image: 'https://picsum.photos/400/200',
  },
  {
    title: 'Space Explorer',
    prompt: 'An astronaut exploring an alien planet with strange rock formations and purple skies.',
    image: 'https://picsum.photos/400/200',
  },
  {
    title: 'Minimalist Animal',
    prompt: 'A minimalist illustration of a fox, using geometric shapes and a limited color palette.',
    image: 'https://picsum.photos/400/200',
  },
  {
    title: 'Ancient Ruins',
    prompt: 'Ancient ruins overgrown with jungle, misty atmosphere, cinematic lighting.',
    image: 'https://picsum.photos/400/200',
  },
].map(p => ({ ...p, createdOn: p.createdOn || todayStr }));

// Add getSavedPrompts function
const getSavedPrompts = () => {
  const saved = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && value.prompt) {
        saved.push({ id: key, ...value });
      }
    } catch (e) {
      // skip non-JSON or unrelated keys
    }
  }
  return saved;
};

const ImagePromptPage = () => {
  const navigate = useNavigate();
  const [modalPrompt, setModalPrompt] = useState(null);
  const [activeTab, setActiveTab] = useState('Image Prompts');

  // Load saved prompts on mount
  useEffect(() => {
    const saved = getSavedPrompts();
    // setSavedPromptIds(ids); // This line was removed as per the edit hint
    // Also update savedPrompts state for modal button
    // setSavedPrompts(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {})); // This line was removed as per the edit hint
  }, []);

  const savePrompt = (promptId, promptData) => {
    const isSaved = !!localStorage.getItem(promptId);
    if (isSaved) {
      localStorage.removeItem(promptId);
    } else {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const dataToSave = { ...promptData };
      if (!dataToSave.createdOn) dataToSave.createdOn = dateStr;
      localStorage.setItem(promptId, JSON.stringify(dataToSave));
    }
    // Always reload saved prompts state after any change
    const saved = getSavedPrompts();
    // setSavedPromptIds(ids); // This line was removed as per the edit hint
    // setSavedPrompts(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {})); // This line was removed as per the edit hint
    return !isSaved;
  };

  const openModal = (item) => {
    setModalPrompt(item);
    // setCopied(false); // This line was removed as per the edit hint
  };
  const closeModal = () => setModalPrompt(null);
  // const handleCopy = () => { // This function was removed as per the edit hint
  //   if (modalPrompt) {
  //     navigator.clipboard.writeText(modalPrompt.prompt);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 1500);
  //   }
  // };
  // const handleToggleSave = () => { // This function was removed as per the edit hint
  //   if (modalPrompt) {
  //     savePrompt(modalPrompt.title, modalPrompt);
  //   }
  // };

  // Handler for unsaving from Saved Prompts view
  const handleUnsave = (promptId) => {
    localStorage.removeItem(promptId);
    // setSavedPromptIds((prev) => prev.filter(id => id !== promptId)); // This line was removed as per the edit hint
    // setSavedPrompts((prev) => ({ ...prev, [promptId]: false })); // This line was removed as per the edit hint
  };

  // Get saved prompts for Saved Prompts tab
  const savedPromptCards = getSavedPrompts();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Segmented Control Bar */}
      <div className="flex flex-row items-center gap-4 w-full mb-8">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm border border-white text-white bg-black hover:bg-white hover:text-black transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="dashboard-segmented mx-auto" style={{ width: 'fit-content', minWidth: '220px', display: 'flex', justifyContent: 'center' }}>
          <button
            className={`px-4 py-2 rounded-md font-medium text-sm border border-white transition-colors ${activeTab === 'Image Prompts' ? 'bg-white text-black' : 'bg-black text-white hover:bg-white hover:text-black'}`}
            onClick={() => setActiveTab('Image Prompts')}
          >
            Image Prompts
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium text-sm border border-white transition-colors ${activeTab === 'Saved Prompts' ? 'bg-white text-black' : 'bg-black text-white hover:bg-white hover:text-black'}`}
            onClick={() => setActiveTab('Saved Prompts')}
          >
            Saved Prompts
          </button>
        </div>
      </div>
      {/* Divider */}
      <div className="w-full flex justify-center mb-10">
        <div style={{ height: '1px', width: '100%', maxWidth: '700px', background: 'rgba(255,255,255,0.12)', borderRadius: '1px' }} />
      </div>
      {/* Image Prompt Cards or Saved Prompt Cards */}
      {activeTab === 'Image Prompts' ? (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {imagePrompts.map((item, idx) => {
            const promptId = `I${idx + 1}`;
            const isSaved = !!localStorage.getItem(promptId);
            // Generate a fake ownership seed (first 8 words of prompt)
            // const ownershipSeed = item.prompt.split(' ').slice(0, 8).join(' '); // This line was removed as per the edit hint
            // Generate a fake ownership address (hash of title)
            // const hash = Array.from(item.title).reduce((acc, c) => acc + c.charCodeAt(0), 0).toString(16).padEnd(32, '0'); // This line was removed as per the edit hint
            return (
              <div
                className="bg-black text-white rounded-2xl p-6 flex flex-col gap-4 font-mono shadow-lg border border-white/10 min-h-[260px] cursor-pointer hover:shadow-2xl transition-shadow duration-150"
                key={idx}
                style={{ letterSpacing: '0.01em' }}
                onClick={() => openModal({ ...item, promptId, isSaved })}
                tabIndex={0}
                role="button"
                aria-label={`Open details for ${item.title}`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openModal({ ...item, promptId, isSaved }); }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs opacity-80">Prompt ID: {promptId}</span>
                  <span className="text-xs opacity-80">{isSaved ? '★ Saved' : '☆ Not Saved'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold tracking-tight">{item.title}</span>
                  <span className="text-xs opacity-80">Class | Image</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-sm">Prompt</span>
                  <div className="mt-1 text-xs whitespace-pre-line break-words opacity-90">{item.prompt}</div>
                </div>
                {/* Ownership Seed */}
                {/* Ownership Address */}
                <div className="flex justify-between items-center mt-4 text-xs opacity-70 border-t border-white/10 pt-2">
                  <span>Created On | {item.createdOn || '--/--/--'}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 border border-white/30 rounded-md text-xs font-mono transition-colors bg-black/80 text-white hover:bg-white hover:text-black"
                      onClick={e => {
                        e.stopPropagation();
                        savePrompt(promptId, { ...item, promptId, isSaved });
                        if (modalPrompt) setModalPrompt(null);
                      }}
                    >
                      {isSaved ? 'Unsave' : 'Save'}
                    </button>
                    <button
                      type="button"
                      aria-label="Copy Prompt"
                      className="px-3 py-1 border border-white/30 rounded-md text-xs font-mono transition-colors bg-black/80 text-white hover:bg-white hover:text-black flex items-center justify-center"
                      onClick={e => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(item.prompt);
                      }}
                    >
                      <CopyIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Modal Popup */}
        {modalPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeModal} tabIndex={-1}>
            <div
              className="relative"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
              role="dialog"
              aria-modal="true"
            >
              <button
                className="absolute top-4 right-4 text-white text-xl bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-zinc-700 focus:outline-none z-10"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
              <div
                className="bg-black text-white rounded-2xl p-6 font-mono shadow-2xl border border-white/10 h-80 min-w-[0] max-w-full sm:max-w-[400px] w-full flex flex-col gap-0"
                style={{ letterSpacing: '0.01em' }}
              >
                <div className="flex-1 flex flex-col gap-4">
                  {/* Top Row: Logo + Prompt ID */}
                  <div className="flex items-center justify-between mb-2">
                    {/* Logo removed */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="text-xs opacity-80 tracking-widest">Prompt ID: {modalPrompt.promptId}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/20 my-2" />
                  {/* Master Ticket */}
                  <div className="mb-2 flex-1 flex flex-col">
                    <span className="font-semibold text-sm">{modalPrompt.title}</span>
                    <div className="mt-1 text-xs whitespace-pre-line break-words opacity-90 overflow-auto flex-1 h-20">{modalPrompt.prompt}</div>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 text-xs opacity-70 border-t border-white/10 pt-2">
                  <button
                    type="button"
                    className="px-3 py-1 border border-white/30 rounded-md text-xs font-mono transition-colors bg-black/80 text-white hover:bg-white hover:text-black"
                    onClick={e => {
                      e.stopPropagation();
                      savePrompt(modalPrompt.promptId, modalPrompt);
                      setModalPrompt(null);
                    }}
                  >
                    {modalPrompt?.isSaved ? 'Unsave' : 'Save'}
                  </button>
                  <button
                    type="button"
                    aria-label="Copy Prompt"
                    className="px-3 py-1 border border-white/30 rounded-md text-xs font-mono transition-colors bg-black/80 text-white hover:bg-white hover:text-black flex items-center justify-center"
                    onClick={e => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(modalPrompt.prompt);
                    }}
                  >
                    <CopyIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedPromptCards.length === 0 ? (
            <div className="col-span-3 text-center text-white opacity-60">No saved prompts yet.</div>
          ) : (
            savedPromptCards.map((item, idx) => {
              // Generate a fake ownership address (hash of title)
              // const hash = Array.from(item.title).reduce((acc, c) => acc + c.charCodeAt(0), 0).toString(16).padEnd(32, '0'); // This line was removed as per the edit hint
              return (
                <div
                  className="bg-black text-white rounded-2xl p-6 flex flex-col gap-4 font-mono shadow-lg border border-white/10 transition-shadow duration-150 h-80"
                  key={item.id}
                  style={{ letterSpacing: '0.01em' }}
                >
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs opacity-80">Prompt ID: {item.promptId || `I${idx + 1}`}</span>
                      <span className="text-xs opacity-80">★ Saved</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold tracking-tight">{item.title}</span>
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
                      onClick={e => {
                        e.stopPropagation();
                        handleUnsave(item.id);
                      }}
                    >
                      Unsave
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePromptPage; 