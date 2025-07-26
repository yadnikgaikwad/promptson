import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import SimplePromptFormatter from './SimplePromptFormatter'
import ImagePromptPage from './ImagePromptPage'
import AgentStatusIndicator from './AgentStatusIndicator';
import Sidebar from './Sidebar';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import JsonPromptFormatter from './JsonPromptFormatter.jsx';
import SavedPromptsPage from './SavedPromptsPage.jsx';
import DemoPage from './DemoPage';
import HomePage from './HomePage';
import { useIsMobile } from '../hooks/use-mobile';
import { Menu, X } from 'lucide-react';

function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // overlay closed by default
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // minimized by default
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Responsive Navbar containing branding and agent status */}
      <div className="navbar-fixed">
        {/* Branding (centered on mobile, hidden on desktop) */}
        <div className="navbar-branding">
          {isMobile && <span className="navbar-mobile-title">Promptson</span>}
        </div>
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
            top: 8, // aligned with navbar elements
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
          pointer-events: none;
          transition: font-size 0.2s, left 0.2s, top 0.2s;
        }
        .navbar-mobile-title {
          color: #000;
          font-size: 16px;
          font-weight: 700;
          font-family: monospace;
        }
        .navbar-agent-status {
          pointer-events: auto;
        }
        @media (max-width: 600px) {
          .navbar-branding {
            font-size: 14px;
            left: 50%;
            top: 8px;
            transform: translateX(-50%);
            text-align: center;
            width: max-content;
          }
          .navbar-mobile-title {
            color: #000;
            font-size: 16px;
            font-weight: 700;
            font-family: monospace;
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
            left: 50%;
            top: 6px;
            transform: translateX(-50%);
            text-align: center;
            width: max-content;
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
          <Route path="/" element={<HomePage />} />
          <Route path="/image-prompts" element={<ImagePromptPage />} />
          <Route path="/json-formatter" element={<JsonPromptFormatter />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/saved-prompts" element={<SavedPromptsPage />} />
          <Route path="demo" element={<DemoPage />} />
        </Routes>
      </div>
    </>
  )
}

export default MainApp 