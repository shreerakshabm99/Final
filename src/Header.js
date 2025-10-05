import React from "react";
import { MdAccountCircle } from "react-icons/md";

export default function Header({ setProfileOpen }) {
  return (
    <div className="header">
      <div className="header-left">
        {/* Add your LinkedIn/Home icons here if needed */}
      </div>
      <div className="header-right">
        <MdAccountCircle
          size={40}
          style={{ cursor: "pointer" }}
          onClick={() => setProfileOpen(true)} // OPEN PROFILE MODAL
        />
      </div>
    </div>
  );
}
