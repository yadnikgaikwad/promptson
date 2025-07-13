import React, { useState, useEffect } from "react";

const indicatorStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  position: "fixed",
  top: "20px",
  right: "30px",
  zIndex: 1000,
  fontFamily: "monospace",
  color: "#FFA500", // orange
  fontSize: "13px", // reduced from 16px
  letterSpacing: "2px",
  userSelect: "none"
};

const dotStyle = {
  display: "inline-block",
  width: "9px", // slightly smaller
  height: "9px",
  borderRadius: "50%",
  background: "#00FF00", // green
  marginRight: "8px",
};

const liveTextStyle = {
  color: "#00FF00",
  fontWeight: "bold",
  fontSize: "13px", // reduced from 16px
  marginLeft: "4px"
};

export default function AgentStatusIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={indicatorStyle}>
      <div>AGENT STATUS</div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        {visible && <span style={dotStyle}></span>}
        <span style={liveTextStyle}>LIVE</span>
      </div>
    </div>
  );
} 