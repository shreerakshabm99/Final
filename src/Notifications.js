// File: Notifications.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SeekerProfileView from "./SeekerProfileView";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedSeeker, setSelectedSeeker] = useState(null);

  useEffect(() => {
    // fetch posts where applicants applied
    axios.get("http://localhost:3001/posts").then(res => {
      const notif = [];
      res.data.forEach(post => {
        (post.applicants || []).forEach(seeker => {
          // seeker is object with id, name, bio, etc
          notif.push({
            id: `${post.id}_${seeker.id}`,
            postId: post.id,
            seeker,
            postTitle: post.jobDescription || "your job"
          });
        });
      });
      setNotifications(notif);
    });
  }, []);

  return (
    <div className="notifications-container" style={{ padding: "20px" }}>
      <h3>Notifications</h3>
      {notifications.length === 0 && <p>No notifications yet</p>}
      <div className="notification-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="notification-item"
            style={{ cursor: "pointer", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}
            onClick={() => setSelectedSeeker(notif.seeker)}
          >
            <strong>{notif.seeker.firstName} {notif.seeker.lastName}</strong> applied for <em>{notif.postTitle}</em>
          </div>
        ))}
      </div>

      {selectedSeeker && (
        <SeekerProfileView
          seeker={selectedSeeker}
          onClose={() => setSelectedSeeker(null)}
        />
      )}
    </div>
  );
}
