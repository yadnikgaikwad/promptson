import React, { useRef, useState, useEffect } from 'react';
import { Send, ChevronDown, BookOpen, User, MessageSquare, Sparkles, Brain, Search, User as UserIcon, Video } from 'lucide-react';
import { generatePrompt } from '../lib/generatePrompt';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const PROMPT_BUTTONS = [
  'Organize prompts',
  'Search prompt library',
  'Share a prompt',
  'Import prompts',
  'Export prompts',
  'Tag prompts',
];

const TYPEWRITER_TEXTS = [
  "Ask me about prompt engineering...",
  "How can I improve my prompts?",
  "Show me some creative prompt examples...",
  "What makes a good prompt?",
  "Help me organize my prompts..."
];

const PROMPT_TYPES = [
  {
    id: 'standard',
    name: 'Standard Prompt',
    description: 'Recommended for most tasks',
    icon: Sparkles
  },
  {
    id: 'reasoning',
    name: 'Reasoning Prompt',
    description: 'For reasoning tasks (OpenAI o3 model)',
    icon: Brain
  },
  {
    id: 'research',
    name: 'Deep Research Prompt',
    description: 'For web-based research',
    icon: Search
  },
  {
    id: 'custom',
    name: 'Custom GPT/Agent Prompt',
    description: 'Design your own Custom GPTs or AI Agents',
    icon: UserIcon
  },
  {
    id: 'video',
    name: 'VEO-3 Video Prompt',
    description: 'Create prompts for VEO-3 video generation',
    icon: Video
  }
];

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typewriterText, setTypewriterText] = useState('I want prompt for a ...');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPromptType, setSelectedPromptType] = useState(PROMPT_TYPES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Remove typewriter effect and just use the static placeholder

  const isEmpty = messages.length === 0;

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Add user message
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', content: userMessage, time: new Date() }
    ]);

    try {
      // Generate AI response using the prompt generation logic
      const aiResponse = await generatePrompt(userMessage, selectedPromptType.name);
      
      setMessages((msgs) => [
        ...msgs,
        { role: 'ai', content: aiResponse, time: new Date() }
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((msgs) => [
        ...msgs,
        { role: 'ai', content: 'Sorry, I encountered an error while processing your request. Please try again.', time: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* Chat Section */}
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col px-4 pt-2 pb-32">
          {/* Placeholder or Messages */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-[70vh] w-full">
              <h2 className="text-3xl sm:text-7xl font-extrabold text-gray-900 mb-3 text-center title-font tracking-wide">All Your Prompts. One Place.</h2>
              <p className="text-xl text-gray-500 mb-8 text-center max-w-xl">Manage, organize, and share your AI prompts with ease. Choose a prompt below or start a new conversation.</p>
              <div className="w-full max-w-4xl mb-8">
                <div className="overflow-hidden">
                  <div className="flex animate-marquee whitespace-nowrap">
                    {PROMPT_BUTTONS.map((label, i) => (
                      <button key={i} className="mx-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-base transition-colors whitespace-nowrap flex-shrink-0">
                        {label}
                      </button>
                    ))}
                    {/* Duplicate buttons for seamless loop */}
                    {PROMPT_BUTTONS.map((label, i) => (
                      <button key={`duplicate-${i}`} className="mx-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-base transition-colors whitespace-nowrap flex-shrink-0">
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-500 hover:text-gray-700 rounded-lg font-medium text-base transition-colors whitespace-nowrap">
                <BookOpen size={18} />
                See prompt library
              </button>
            </div>
          ) : (
            <>
              {/* Date label */}
              <div className="flex justify-center my-6">
                <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
              </div>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col items-${msg.role === 'user' ? 'end' : 'start'} mb-8`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${msg.role === 'user' ? 'text-gray-700' : 'text-gray-500'}`}>{msg.role === 'user' ? 'Me' : 'Promptson'}</span>
                    <span className="text-xs text-gray-400">· {formatTime(msg.time)}</span>
                  </div>
                  <div className={`rounded-xl px-4 py-3 text-lg whitespace-pre-line shadow-sm ${msg.role === 'user' ? 'bg-white text-gray-900 border border-gray-200' : 'bg-[#f2f3f5] text-gray-800'}`}
                    style={{ maxWidth: '80%', minWidth: '180px' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex flex-col items-start mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">Promptson</span>
                    <span className="text-xs text-gray-400">· typing...</span>
                  </div>
                  <div className="rounded-xl px-4 py-3 text-lg bg-[#f2f3f5] text-gray-800 shadow-sm" style={{ maxWidth: '80%', minWidth: '180px' }}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      {/* Input Area - always at bottom */}
      <form onSubmit={handleSend} className="w-full flex justify-center bg-[#f7f8fa] sticky bottom-0 z-10 pt-2 pb-8">
        <div className="w-full max-w-3xl flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={typewriterText}
              className="flex-1 resize-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[48px] max-h-32"
              rows={1}
              maxLength={2000}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={`min-h-[48px] px-4 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center ${
                isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1" ref={dropdownRef}>
            {/* Prompt Type Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <selectedPromptType.icon size={16} className="text-gray-500" />
                <span className="font-medium">{selectedPromptType.name}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <selectedPromptType.icon size={16} className="text-gray-500" />
                    <span className="font-semibold text-gray-900">{selectedPromptType.name}</span>
                    <ChevronDown size={14} className="text-gray-400 ml-auto" />
                  </div>
                  
                  {/* Options */}
                  <div className="py-1">
                    {PROMPT_TYPES.map((promptType) => {
                      const IconComponent = promptType.icon;
                      const isSelected = selectedPromptType.id === promptType.id;
                      
                      return (
                        <button
                          key={promptType.id}
                          onClick={() => {
                            setSelectedPromptType(promptType);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            isSelected ? 'bg-gray-50' : ''
                          }`}
                        >
                          <IconComponent size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{promptType.name}</div>
                            <div className="text-sm text-gray-500 mt-0.5">{promptType.description}</div>
                          </div>
                          {isSelected && (
                            <div className="text-gray-900 flex-shrink-0">✓</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <button type="button" className="text-xs text-gray-400 hover:text-gray-600" disabled={isLoading}>Tone</button>
            <span className="ml-auto text-xs text-gray-400 sm:mr-0 mr-4" style={{ minWidth: 60, textAlign: 'right' }}>{input.length}/2000</span>
          </div>
        </div>
      </form>
    </div>
  );
} 