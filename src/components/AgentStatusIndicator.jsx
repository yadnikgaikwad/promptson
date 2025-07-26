import React, { useState, useEffect } from "react";

const indicatorStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  position: "fixed",
  top: "6px",
  right: "10px",
  zIndex: 1000,
  fontFamily: "monospace",
  color: "#222", // darker text for contrast
  fontSize: "10px",
  letterSpacing: "2px",
  userSelect: "none",
  textShadow: "0 1px 4px rgba(0,0,0,0.12)", // subtle shadow for clarity
};

const dotStyle = {
  display: "inline-block",
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#16a34a", // more saturated green
  marginRight: "6px",
  boxShadow: "0 0 6px 2px #16a34a55", // glow effect for visibility
};

const liveTextStyle = {
  color: "#16a34a", // match dot color
  fontWeight: "bold",
  fontSize: "11px",
  marginLeft: "2px",
  textShadow: "0 1px 4px rgba(0,0,0,0.10)",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function AgentStatusIndicator() {
  const [visible, setVisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={indicatorStyle}>
      <div style={{ color: '#222', fontWeight: 'bold', fontSize: 11, letterSpacing: 2, marginBottom: 2 }}>AGENT STATUS</div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        {visible && <span style={dotStyle}></span>}
        <span style={liveTextStyle}>LIVE</span>
      </div>
    </div>
  );
} 