// Sidebar.js
import React from "react";
import { BsHouseDoor, BsFillChatDotsFill, BsFillBellFill } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";

export default function Sidebar({ collapsed, setCollapsed, setActivePage, notifications }) {
  return (
    <aside id="sidebar" className={collapsed ? "collapsed" : ""}>
      {/* Sidebar Header / Brand */}
      <div className="sidebar-title">
        {!collapsed && (
          <div className="sidebar-brand">
            <FaLinkedin size={28} color="#0A66C2" />
            <span>LinkedIn</span>
          </div>
        )}
        <span
          className="icon close_icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "▶" : "◀"}
        </span>
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-list">
        {/* Home */}
        <li
          className="sidebar-list-item"
          onClick={() => setActivePage("home")}
        >
          <BsHouseDoor className="icon" />
          {!collapsed && <span>Home</span>}
        </li>

        
      </ul>
    </aside>
  );
}
