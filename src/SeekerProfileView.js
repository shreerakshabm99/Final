// File: SeekerProfileView.js
import React from "react";

export default function SeekerProfileView({ seeker, onClose }) {
  return (
    <div className="profile-sidebar open">
      <div className="profile-header">
        <h3>Seeker Profile</h3>
        <span className="close-btn" onClick={onClose}>×</span>
      </div>

      <div className="profile-image-wrapper">
        <img src={seeker.image || "https://via.placeholder.com/100"} alt="profile" />
      </div>

      <div className="profile-view">
        <p><strong>First Name:</strong> {seeker.firstName}</p>
        <p><strong>Last Name:</strong> {seeker.lastName}</p>
        <p><strong>Experience:</strong> {seeker.experience || "0"} yrs</p>
        <p><strong>Skills:</strong> {seeker.skills || "No skills added"}</p>
      </div>
    </div>
  );
}
