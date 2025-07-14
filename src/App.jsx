import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import SimplePromptFormatter from './components/SimplePromptFormatter'
import ImagePromptPage from './components/ImagePromptPage'
import AgentStatusIndicator from './components/AgentStatusIndicator';
import Sidebar from './components/Sidebar';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import JsonPromptFormatter from './components/JsonPromptFormatter.jsx';
import SavedPromptsPage from './components/SavedPromptsPage.jsx';
import './App.css'
import { useIsMobile } from './hooks/use-mobile';
import { Menu, X } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // overlay closed by default
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // minimized by default
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Responsive Navbar containing branding and agent status */}
      <div className="navbar-fixed">
        {/* Branding (left) */}
        <div className="navbar-branding">Promptson</div>
        {/* Agent Status Indicator (right) */}
        <div className="navbar-agent-status">
          <AgentStatusIndicator />
        </div>
      </div>
      {/* Mobile Sidebar Open Button */}
      {isMobile && (
        <button
          className="mobile-sidebar-open-btn"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          style={{
            position: 'fixed',
            top: 25, // below the navbar, above segmented bar
            left: 8,
            zIndex: 4000,
            background: 'rgba(16,16,18,0.95)',
            border: 'none',
            borderRadius: '8px',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            color: '#fff',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={() => setSidebarOpen(open => !open)}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}
      <style>{`
        .navbar-fixed {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          z-index: 3000;
          pointer-events: none;
        }
        .navbar-branding {
          position: fixed;
          top: 12px;
          left: 90px;
          z-index: 2000;
          font-family: monospace;
          font-weight: 700;
          font-size: 18px;
          color: #fff;
          letter-spacing: 1px;
          opacity: 0.85;
          pointer-events: auto;
          transition: font-size 0.2s, left 0.2s, top 0.2s;
        }
        .navbar-agent-status {
          pointer-events: auto;
        }
        @media (max-width: 600px) {
          .navbar-branding {
            font-size: 14px;
            left: 16px;
            top: 8px;
          }
          .navbar-agent-status {
            position: fixed;
            top: 6px;
            right: 8px;
            z-index: 2000;
          }
        }
        @media (max-width: 400px) {
          .navbar-branding {
            font-size: 12px;
            left: 8px;
            top: 6px;
          }
        }
      `}</style>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        isLoggedIn={isLoggedIn}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />
      <div className="dashboard-bg min-h-screen w-full">
        <Routes>
          <Route path="/" element={<SimplePromptFormatter />} />
          <Route path="/image-prompts" element={<ImagePromptPage />} />
          <Route path="/json-formatter" element={<JsonPromptFormatter />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/saved-prompts" element={<SavedPromptsPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
