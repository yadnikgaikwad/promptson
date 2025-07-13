import React, { useEffect, useState } from 'react';
import { Home, Puzzle, Wrench, Star, Folder, User, LogIn, Menu, X, ChevronRight, Braces, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Prompt Categories', icon: Puzzle },
  { label: 'Tools', icon: Wrench },
  { label: 'Saved Prompts', icon: Bookmark },
];

export default function Sidebar({ open, onClose, expanded, setExpanded, isLoggedIn, user, setIsLoggedIn, setUser }) {
  // Close on Esc key
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Keyboard navigation: focus first nav item on open
  const navRef = React.useRef();
  useEffect(() => {
    if (open && navRef.current) {
      navRef.current.focus();
    }
  }, [open]);

  // Sidebar width classes
  const sidebarWidth = expanded ? 'w-4/5 max-w-xs md:w-64' : 'w-16';

  // On mobile: overlay, slide in/out. On desktop: always visible, animate width.
  const navigate = useNavigate();
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  return (
    <>
      {/* Backdrop Overlay (mobile only, when open) */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`}
        aria-hidden={!open}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-[#101012] text-white shadow-lg transition-all duration-300 ease-in-out
          flex flex-col
          ${sidebarWidth}
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          md:border-r md:border-white
        `}
        role="navigation"
        aria-label="Sidebar"
        aria-expanded={expanded}
        tabIndex={-1}
      >
        {/* Expand/Collapse Toggle */}
        <button
          className="flex items-center justify-center mt-4 mb-2 ml-2 w-10 h-10 rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => setExpanded && setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className="relative block w-6 h-6">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${expanded ? 'opacity-0' : 'opacity-100'}`}
            >
              <Menu size={24} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}
            >
              <X size={24} />
            </span>
          </span>
        </button>
        {/* Nav Items */}
        <nav className="flex-1 mt-4" aria-label="Main navigation">
          <ul className="flex flex-col gap-1" ref={navRef} tabIndex={0}>
            {navItems.map(({ label, icon: Icon }) => (
              <React.Fragment key={label}>
                <li className="relative">
                  <button
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out
                      hover:bg-gray-800 focus:bg-gray-700 focus:outline-none
                      ${expanded ? 'justify-start' : 'justify-center'}
                      ${label === 'Tools' && toolsDropdownOpen ? 'bg-gray-800' : ''}
                      ${label === 'Saved Prompts' ? 'bg-black border border-white/20 font-mono text-white shadow-sm hover:bg-white hover:text-black' : ''}
                    `}
                    tabIndex={0}
                    aria-label={label}
                    onClick={() => {
                      if (label === 'Home') navigate('/');
                      if (label === 'Tools') setToolsDropdownOpen((open) => !open);
                      if (label === 'Saved Prompts') navigate('/saved-prompts');
                    }}
                  >
                    <Icon size={22} className="shrink-0" />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${expanded ? 'ml-2 opacity-100' : 'ml-0 opacity-0'} text-sm`}
                      style={{ width: expanded ? 'auto' : 0 }}
                    >
                      {label}
                    </span>
                    {label === 'Tools' && expanded && (
                      <ChevronRight size={18} className={`ml-auto transition-transform ${toolsDropdownOpen ? 'rotate-90' : ''}`} />
                    )}
                  </button>
                </li>
                {/* Tools Dropdown (expands inside sidebar) */}
                {label === 'Tools' && (
                  <li
                    className={`overflow-hidden transition-all duration-300 ${toolsDropdownOpen && expanded ? 'max-h-40 py-1' : 'max-h-0 py-0'} bg-[#18181b] rounded-md`}
                    style={{
                      marginLeft: expanded ? (expanded ? '2.5rem' : '0') : '0',
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <button className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                        onClick={() => {
                          navigate('/json-formatter');
                          setToolsDropdownOpen(false);
                        }}
                      >
                        <Braces size={18} className="shrink-0" />
                        <span>JSON Prompt Formatter</span>
                      </button>
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
        {/* Fixed Bottom User/Login Section */}
        <div className="absolute bottom-0 left-0 w-full px-3 py-4 border-t border-gray-800 bg-[#101012]">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 w-full">
              <User size={22} className="shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${expanded ? 'ml-2 opacity-100' : 'ml-0 opacity-0'} text-sm`} style={{ width: expanded ? 'auto' : 0 }}>
                {user?.user_metadata?.username || user?.email || 'John Doe'}
              </span>
              {expanded && (
                <button
                  className="ml-auto px-3 py-2 rounded-lg bg-[#23232a] text-white text-sm transition-colors hover:bg-white hover:text-black"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsLoggedIn(false);
                    setUser(null);
                  }}
                >
                  Log out
                </button>
              )}
            </div>
          ) : (
            <button
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              tabIndex={0}
              aria-label={'Login'}
              onClick={() => navigate('/login')}
            >
              <LogIn size={22} className="shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${expanded ? 'ml-2 opacity-100' : 'ml-0 opacity-0'} text-sm`} style={{ width: expanded ? 'auto' : 0 }}>
                Login
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
} 