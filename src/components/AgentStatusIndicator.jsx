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
  color: "#FFA500", // orange
  fontSize: "10px",
  letterSpacing: "2px",
  userSelect: "none"
};

const dotStyle = {
  display: "inline-block",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#00FF00", // green
  marginRight: "4px",
};

const liveTextStyle = {
  color: "#00FF00",
  fontWeight: "bold",
  fontSize: "10px",
  marginLeft: "2px"
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