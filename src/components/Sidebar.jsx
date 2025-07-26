import React, { useEffect, useState } from 'react';
import { Home, Puzzle, Wrench, Star, Folder, User, LogIn, Menu, X, ChevronRight, Braces, Bookmark, Settings, HelpCircle, Github, Palette, Sun, Moon, Monitor, LogOut, ChevronUp, Image, Palette as DesignIcon, Code, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useIsMobile } from '../hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Prompt Categories', icon: Puzzle },
  { label: 'Tools', icon: Wrench },
  { label: 'Saved Prompts', icon: Bookmark },
];

const promptCategories = [
  { label: 'Image Prompt', icon: Image, path: '/app/image-prompts' },
  { label: 'Design Prompt', icon: DesignIcon, path: '/app/design-prompts' },
  { label: 'Coding Prompt', icon: Code, path: '/app/coding-prompts' },
  { label: 'Copywriting Prompt', icon: Type, path: '/app/copywriting-prompts' },
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

  const isMobile = useIsMobile();
  // Sidebar width classes
  const sidebarWidth = (isMobile && open) ? 'w-4/5 max-w-xs' : (expanded ? 'w-4/5 max-w-xs md:w-64' : 'w-16');

  // On mobile: overlay, slide in/out. On desktop: always visible, animate width.
  const navigate = useNavigate();
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  // Force expanded sidebar in mobile view when open
  const isExpanded = isMobile && open ? true : expanded;
  return (
    <>
      {/* Backdrop Overlay (mobile only, when open) */}
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-60 h-full bg-[#101012] text-white shadow-lg transition-all duration-300 ease-in-out
          flex flex-col
          ${sidebarWidth}
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          md:border-r md:border-white
        `}
        role="navigation"
        aria-label="Sidebar"
        aria-expanded={isExpanded}
        tabIndex={-1}
        style={{ zIndex: 60 }}
        onMouseEnter={() => { if (!isMobile && setExpanded && !accountDropdownOpen) setExpanded(true); }}
        onMouseLeave={() => { if (!isMobile && setExpanded && !accountDropdownOpen) setExpanded(false); }}
      >
        {/* Sidebar Brand (desktop only) */}
        {!isMobile && (
          <div className="flex items-center pl-4 pt-6 pb-2">
            {/* Logo Image with rotation animation */}
            <img src="/logoo.jpeg" alt="Promptson Logo" className="w-8 h-8 object-contain animate-spin-slow" />
            {isExpanded && (
              <span className="ml-3 text-xl font-bold tracking-wide" style={{ fontFamily: 'Inter, sans-serif', color: '#fff', letterSpacing: '2px' }}>
                Promptson
              </span>
            )}
          </div>
        )}
        {/* Mobile: Top right logo with slow rotation */}
        {isMobile && (
          <img
            src="/logoo.jpeg"
            alt="Promptson Logo"
            className="absolute top-4 right-4 w-8 h-8 object-contain animate-spin-slow"
            style={{ zIndex: 100 }}
          />
        )}
        {/* Expand/Collapse Toggle */}
        {isMobile && (
        <button
          className="flex items-center justify-center mt-4 mb-2 ml-2 w-10 h-10 rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => {
            if (isMobile && open) {
              onClose();
            } else if (setExpanded) {
              setExpanded((prev) => !prev);
            }
          }}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className="relative block w-6 h-6">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
            >
              <Menu size={24} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
            >
              <X size={24} />
            </span>
          </span>
        </button>
        )}
        {/* Nav Items */}
        <nav className={`flex-1 ${!isMobile ? 'mt-8' : 'mt-4'}`} aria-label="Main navigation">
          <ul className="flex flex-col gap-1" ref={navRef} tabIndex={0}>
            {navItems.map(({ label, icon: Icon }) => (
              <React.Fragment key={label}>
                <li className="relative">
                  <button
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out
                      hover:bg-gray-800 focus:bg-gray-700 focus:outline-none
                      ${isExpanded ? 'justify-start' : 'justify-center'}
                      ${label === 'Tools' && toolsDropdownOpen ? 'bg-gray-800' : ''}
                      ${label === 'Prompt Categories' && categoriesDropdownOpen ? 'bg-gray-800' : ''}
                      ${label === 'Saved Prompts' ? 'bg-black border border-white/20 font-mono text-white shadow-sm hover:bg-white hover:text-black' : ''}
                    `}
                    tabIndex={0}
                    aria-label={label}
                    onClick={() => {
                      if (label === 'Home') navigate('/app/');
                      if (label === 'Tools') setToolsDropdownOpen((open) => !open);
                      if (label === 'Prompt Categories') setCategoriesDropdownOpen((open) => !open);
                      if (label === 'Saved Prompts') navigate('/app/saved-prompts');
                    }}
                  >
                    <Icon size={22} className="shrink-0" />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? 'ml-2 opacity-100' : 'ml-0 opacity-0'} text-sm`}
                      style={{ width: isExpanded ? 'auto' : 0 }}
                    >
                      {label}
                    </span>
                    {(label === 'Tools' || label === 'Prompt Categories') && isExpanded && (
                      <ChevronRight size={18} className={`ml-auto transition-transform ${(label === 'Tools' && toolsDropdownOpen) || (label === 'Prompt Categories' && categoriesDropdownOpen) ? 'rotate-90' : ''}`} />
                    )}
                  </button>
                </li>
                {/* Tools Dropdown (expands inside sidebar) */}
                {label === 'Tools' && (
                  <li
                    className={`overflow-hidden transition-all duration-300 ${toolsDropdownOpen && isExpanded ? 'max-h-40 py-1' : 'max-h-0 py-0'} bg-[#18181b] rounded-md`}
                    style={{
                      marginLeft: isExpanded ? (isExpanded ? '2.5rem' : '0') : '0',
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <button className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                        onClick={() => {
                          navigate('/app/json-formatter');
                          setToolsDropdownOpen(false);
                        }}
                      >
                        <Braces size={18} className="shrink-0" />
                        <span>JSON Prompt Formatter</span>
                      </button>
                    </div>
                  </li>
                )}
                {/* Prompt Categories Dropdown (expands inside sidebar) */}
                {label === 'Prompt Categories' && (
                  <li
                    className={`overflow-hidden transition-all duration-300 ${categoriesDropdownOpen && isExpanded ? 'max-h-60 py-1' : 'max-h-0 py-0'} bg-[#18181b] rounded-md`}
                    style={{
                      marginLeft: isExpanded ? (isExpanded ? '2.5rem' : '0') : '0',
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      {promptCategories.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                          <button 
                            key={category.label}
                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                            onClick={() => {
                              navigate(category.path);
                              setCategoriesDropdownOpen(false);
                            }}
                          >
                            <CategoryIcon size={18} className="shrink-0" />
                            <span>{category.label}</span>
                          </button>
                        );
                      })}
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
            <DropdownMenu open={accountDropdownOpen} onOpenChange={setAccountDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full focus:outline-none">
                  {/* Profile Image with Green Border */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border-2 border-green-500">
                      <User size={16} className="text-yellow-400" />
                    </div>
                  </div>
                  <div className={`flex flex-col items-start transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`} style={{ width: isExpanded ? 'auto' : 0 }}>
                    <span className="text-sm font-semibold text-white">
                      {user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User Name'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user?.email || 'user@email.address'}
                    </span>
                  </div>
                  <ChevronUp size={16} className={`ml-auto text-gray-400 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuPrimitive.Content
                side="top"
                align="start"
                sideOffset={8}
                className={cn(
                  "bg-gray-900 text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[280px] overflow-hidden rounded-lg border border-gray-700 p-4 shadow-xl"
                )}
              >
                {/* User Account Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User Name'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {user?.email || 'user@email.address'}
                  </p>
                </div>

                {/* Menu Items Section */}
                <div className="space-y-1 mb-4">
                  <DropdownMenuPrimitive.Item
                    className="relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-800 focus:bg-gray-800"
                    onClick={() => window.open('https://github.com/maybe-finance/promptson', '_blank')}
                  >
                    <Github size={16} className="mr-3 text-gray-400" />
                    Github
                  </DropdownMenuPrimitive.Item>
                </div>

                {/* Logout Button */}
                <DropdownMenuPrimitive.Item
                  className="relative flex cursor-default select-none items-center rounded-md px-3 py-3 text-sm outline-none transition-colors hover:bg-red-600 focus:bg-red-600 bg-red-500 text-white font-medium"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsLoggedIn(false);
                    setUser(null);
                  }}
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </DropdownMenuPrimitive.Item>
              </DropdownMenuPrimitive.Content>
            </DropdownMenu>
          ) : (
            <button
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              tabIndex={0}
              aria-label={'Login'}
              onClick={() => navigate('/app/login')}
            >
              <LogIn size={22} className="shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? 'ml-2 opacity-100' : 'ml-0 opacity-0'} text-sm`} style={{ width: isExpanded ? 'auto' : 0 }}>
                Login
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
} 