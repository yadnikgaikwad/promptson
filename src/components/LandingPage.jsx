import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  // Split text into individual words for hover effects
  const renderWordsWithHover = (text) => {
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className="inline-block transition-all duration-300 ease-in-out opacity-60 blur-sm hover:opacity-90 hover:blur-none cursor-pointer mx-1 group-hover:opacity-90 group-hover:blur-none"
      >
        {word}
      </span>
    ));
  };

  // Create marquee content by repeating the text
  const createMarqueeContent = () => {
    const lines = [
      "No vendor lock-in. No subscriptions.",
      "No clutter. No confusion. No limits.",
      "No more lost prompts. No more chaos.",
      "No paywalls. No hidden fees.",
      "No learning curve. No wasted time.",
      "No bloat. No distractions. No noise.",
      "No more spreadsheets. No more copy-paste.",
      "No closed doors. No secrets. Open source.",
      "No friction. No barriers. Just creation.",
      "No complexity. Just clarity."
    ];
    
    // Repeat the content multiple times for seamless scrolling
    const repeatedLines = [...lines, ...lines, ...lines];
    
    return repeatedLines.map((line, index) => (
      <div key={index} className="whitespace-nowrap">
        {renderWordsWithHover(line)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Desktop Header */}
      <header className="hidden sm:flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-3">
          <div className="text-xl md:text-2xl font-bold text-black">promptson</div>
          <div className="bg-gray-200 text-gray-600 px-3 py-1 text-sm rounded">
            OPENSOURCE
          </div>
        </div>
      </header>

             {/* Mobile Header */}
       <header className="sm:hidden flex items-center justify-start p-4 bg-white">
         <div className="text-lg font-medium text-gray-800">promptson</div>
       </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center relative">
        {/* Desktop Blurred background text with marquee animation */}
        <div className="absolute inset-0 hidden sm:flex items-start pointer-events-auto pt-12 overflow-hidden">
          <div className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-relaxed w-full">
            <div className="w-full group">
              <div className="flex animate-marquee whitespace-nowrap w-full">
                {createMarqueeContent()}
              </div>
            </div>
          </div>
        </div>

                 {/* Mobile Content */}
         <div className="sm:hidden flex-1 flex flex-col px-4 py-4">
                       {/* Mobile Main Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Create & Organize</h1>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  Build, save, and organize your AI prompts in one centralized location. No more scattered files or forgotten conversations.
                </p>
                <p>
                  Share prompts with your team, discover new techniques, and master the art of prompt engineering with our open-source platform.
                </p>
              </div>
            </div>

            {/* Mobile Video Placeholder */}
            <div className="my-4">
              <div className="w-full aspect-square rounded-lg overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src="/placeholder.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Mobile Visit Site Button */}
            <div className="mt-2 mb-4 flex gap-3">
              <button 
                onClick={handleGetStarted}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-white hover:text-black hover:border-2 hover:border-black transition-colors cursor-pointer"
              >
                Visit Site
              </button>
              <button 
                onClick={() => window.open('https://github.com/maybe-finance/promptson', '_blank')}
                className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-gray-700 transition-colors cursor-pointer"
              >
                GitHub Repo
              </button>
            </div>

            {/* Mobile Navigation Button */}
            <div className="mt-4 mb-2 flex justify-end">
              <button 
                onClick={handleGetStarted}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-3">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
        </div>

        {/* Desktop Main headline */}
        <div className="relative z-10 hidden sm:block text-center px-6 md:px-8 max-w-4xl mx-auto mt-auto -mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-8">
            <div>All Your Prompts.</div>
            <div>One Place.</div>
            <div>Total Control.</div>
          </h1>
          
          <Button 
            onClick={handleGetStarted}
            className="bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black px-8 py-4 text-lg rounded-none border-2 border-black hover:border-black transition-colors cursor-pointer"
          >
            Get Started
          </Button>
        </div>
      </main>

      {/* Desktop Footer */}
      <footer className="hidden sm:block text-gray-500 text-sm p-6 md:p-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center space-x-4 mt-6">
              <a 
                href="https://github.com/yadnikgaikwad" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/yadnik" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://x.com/yadnikgaikwad" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
            <div>of Maybe? Find the repository <a href="https://github.com/yadnikgaikwad/promptson" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">here</a>.</div>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      
    </div>
  );
};

export default LandingPage; 