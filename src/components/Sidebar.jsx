import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ darkMode, toggleDarkMode, isMobile }) {
  const [collapsed, setCollapsed] = useState(true);

  const links = [
    { to: "/", label: "Home", icon: "⌂" },
    { to: "/write", label: "Write", icon: "✎" },
    { to: "/entries", label: "Entries", icon: "≡" },
    { to: "/stats", label: "Stats", icon: "◎" },
  ];

  if (isMobile) {
    return (
      <nav style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        height: "64px",
        background: "rgba(10, 8, 20, 0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(61, 42, 122, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 200,
        padding: "0 8px",
      }}>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              background: isActive ? "rgba(42, 26, 94, 0.7)" : "transparent",
              color: isActive ? "var(--purple)" : "var(--text3)",
              transition: "all 0.2s",
              minWidth: "56px",
            })}
          >
            <span style={{ fontSize: "18px" }}>{icon}</span>
            <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {label}
            </span>
          </NavLink>
        ))}
        <button
          onClick={toggleDarkMode}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "3px",
            background: "transparent", border: "none",
            color: "var(--text3)", padding: "8px 12px",
            borderRadius: "10px", cursor: "pointer",
            minWidth: "48px",
          }}
        >
          <span style={{ fontSize: "16px" }}>{darkMode ? "☀" : "🌙"}</span>
          <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {darkMode ? "Light" : "Dark"}
          </span>
        </button>
      </nav>
    );
  }

  return (
    <aside style={{
      position: "fixed",
      top: 0, left: 0,
      width: collapsed ? "58px" : "180px",
      minHeight: "100vh",
      background: "rgba(10, 8, 20, 0.85)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(61, 42, 122, 0.4)",
      display: "flex",
      flexDirection: "column",
      alignItems: collapsed ? "center" : "flex-start",
      padding: "16px 0",
      gap: "4px",
      zIndex: 200,
      transition: "width 0.25s ease",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        width: "100%",
        padding: collapsed ? "0" : "0 16px",
        marginBottom: "28px",
      }}>
        <div style={{
          width: "34px", height: "34px",
          background: "linear-gradient(135deg, #7c4fe0, #9b6dff)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff",
          fontFamily: "var(--font-serif)",
          fontSize: "16px", fontWeight: 700,
          flexShrink: 0,
          boxShadow: "0 4px 16px rgba(155,109,255,0.35)",
        }}>J</div>

        {!collapsed && (
          <span style={{
            fontFamily: "var(--font-serif)",
            fontSize: "15px", fontWeight: 600,
            color: "var(--text)", marginLeft: "10px", flex: 1,
          }}>Journal</span>
        )}

        <button
          onClick={() => setCollapsed(p => !p)}
          style={{
            background: "transparent", border: "none",
            color: "var(--text3)", cursor: "pointer",
            fontSize: "12px", padding: "4px",
            marginLeft: collapsed ? "0" : "auto",
            marginTop: collapsed ? "0" : "0",
          }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          title={collapsed ? label : ""}
          style={({ isActive }) => ({
            width: collapsed ? "38px" : "calc(100% - 16px)",
            height: "38px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "10px",
            border: isActive ? "1px solid rgba(155,109,255,0.4)" : "1px solid transparent",
            background: isActive ? "rgba(42, 26, 94, 0.8)" : "transparent",
            color: isActive ? "var(--purple)" : "var(--text3)",
            transition: "all 0.2s",
            textDecoration: "none",
            fontSize: "16px",
            padding: collapsed ? "0" : "0 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            marginLeft: collapsed ? "0" : "8px",
            boxShadow: isActive ? "0 0 16px rgba(155,109,255,0.15)" : "none",
          })}
        >
          <span>{icon}</span>
          {!collapsed && (
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{label}</span>
          )}
        </NavLink>
      ))}

      <div style={{ flex: 1 }} />

      <button
        onClick={toggleDarkMode}
        title={darkMode ? "Light mode" : "Dark mode"}
        style={{
          width: collapsed ? "38px" : "calc(100% - 24px)",
          height: "38px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderRadius: "10px",
          border: "1px solid var(--border2)",
          background: "transparent",
          color: "var(--text3)",
          padding: collapsed ? "0" : "0 12px",
          justifyContent: collapsed ? "center" : "flex-start",
          cursor: "pointer",
          fontSize: "15px",
          marginLeft: collapsed ? "0" : "8px",
          transition: "all 0.25s",
        }}
      >
        <span>{darkMode ? "☀" : "🌙"}</span>
        {!collapsed && (
          <span style={{ fontSize: "13px", fontWeight: 500 }}>
            {darkMode ? "Light mode" : "Dark mode"}
          </span>
        )}
      </button>
    </aside>
  );
}

export default Sidebar;