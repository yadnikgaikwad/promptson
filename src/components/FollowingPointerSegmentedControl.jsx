import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from '../hooks/use-mobile';

/**
 * FollowingPointerSegmentedControl
 * @param {string[]} options - Array of button labels
 * @param {number} activeIndex - Index of the currently active button
 * @param {function} onChange - Callback when a button is clicked (index)
 * @param {string} className - Optional extra className for the wrapper
 * @param {number[]} disabledIndices - Array of indices to disable
 */
export default function FollowingPointerSegmentedControl({
  options = [],
  activeIndex = 0, // not used for highlight anymore
  onChange = () => {},
  className = "",
  disabledIndices = [],
}) {
  const containerRef = useRef(null);
  const [soonLabel, setSoonLabel] = useState({ show: false, left: 0, width: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  // Update soon label position
  const updateSoonLabel = (index, show) => {
    if (!containerRef.current) return;
    const btn = containerRef.current.querySelectorAll("button")[index];
    if (btn) {
      const { left, width } = btn.getBoundingClientRect();
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      setSoonLabel({ show, left: left - containerLeft + width / 2, width });
    }
  };

  // Only show collapsible UI on mobile
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className={`relative flex bg-zinc-800 rounded-xl p-1 gap-1 ${className} flex-col sm:flex-row sm:gap-1 w-full sm:w-fit overflow-visible z-50 mt-6 sm:mt-0`}
        style={{ minWidth: 220 }}
      >
        <div className="flex w-full items-center">
          <button
            className={`relative z-10 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 min-w-[100px] text-center bg-white text-black w-full mb-2 sm:mb-0`}
            onClick={() => {
              if (!disabledIndices.includes(0)) onChange(0);
            }}
            aria-disabled={disabledIndices.includes(0)}
            tabIndex={disabledIndices.includes(0) ? -1 : 0}
          >
            {options[0]}
          </button>
          <button
            className="ml-2 flex items-center justify-center rounded-lg bg-zinc-700 text-white px-2 h-10 w-10"
            style={{ alignSelf: 'center', marginBottom: '5px', marginTop: '0' }}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            onClick={() => setExpanded(e => !e)}
            tabIndex={0}
            type="button"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {expanded && (
          <div className="flex flex-col w-full mt-2">
            {options.slice(1).map((label, idx) => {
              const realIdx = idx + 1;
              const isDisabled = disabledIndices.includes(realIdx);
              return (
                <button
                  key={label}
                  className={`relative z-10 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 min-w-[100px] text-center w-full mb-2 bg-transparent text-white hover:bg-white/20 hover:text-white ${isDisabled ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-60' : ''}`}
                  onClick={e => {
                    if (isDisabled) {
                      e.preventDefault();
                      return;
                    }
                    onChange(realIdx);
                  }}
                  aria-disabled={isDisabled}
                  tabIndex={isDisabled ? -1 : 0}
                  disabled={isDisabled}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex bg-zinc-800 rounded-xl p-1 gap-1 ${className} flex-col sm:flex-row sm:gap-1 w-full sm:w-fit overflow-visible z-50 mt-6 sm:mt-0`}
      style={{ minWidth: 220 }}
    >
      {/* Floating 'Soon' label above disabled button on hover */}
      <AnimatePresence>
        {soonLabel.show && (
          <motion.div
            key="soon-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 pointer-events-none"
            style={{ left: soonLabel.left }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full min-w-[60px] rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white shadow-lg border border-white/10 select-none">
              Soon
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {options.map((label, idx) => {
        const isDisabled = disabledIndices.includes(idx);
        const isHovered = hoveredIndex === idx;
        return (
          <button
            key={label}
            className={`relative z-10 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150 min-w-[100px] text-center
              ${isDisabled
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-60"
                : isHovered
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-white/20 hover:text-white"}
              w-full sm:w-auto mb-2 sm:mb-0
            `}
            onClick={() => {
              if (!isDisabled) onChange(idx);
            }}
            onMouseEnter={() => {
              setHoveredIndex(idx);
              if (isDisabled) {
                updateSoonLabel(idx, true);
              }
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              if (isDisabled) {
                updateSoonLabel(idx, false);
              }
            }}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
} 