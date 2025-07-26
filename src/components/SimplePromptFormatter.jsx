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
      {/* Top Overview Section */}
      {/* Card slider removed as requested */}
      {/* AI Prompt Generator Card removed as requested */}
    </div>
  );
};

export default SimplePromptFormatter;

