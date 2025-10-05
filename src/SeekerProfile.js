import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function SeekerProfile({ setProfileOpen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    experience: "",
    skills: "",
    image: ""
  });

  const fileInputRef = useRef(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:3001/seekerProfile?userId=${userId}`)
      .then(res => {
        if (res.data.length > 0) setProfile(res.data[0]);
        else {
          const newProfile = { userId, firstName: "", lastName: "", experience: "", skills: "", image: "" };
          axios.post("http://localhost:3001/seekerProfile", newProfile).then(response => setProfile(response.data));
        }
      })
      .catch(err => console.error(err));
  }, [userId]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfile(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleSave = () => {
    if (!profile.id) return;
    axios.put(`http://localhost:3001/seekerProfile/${profile.id}`, profile)
      .then(() => { alert("Profile saved!"); setIsEditing(false); })
      .catch(err => console.error(err));
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="profile-sidebar open">
      <div className="profile-header">
        <h3>Profile</h3>
        <span className="close-btn" onClick={() => setProfileOpen(false)}>×</span>
      </div>

      <div className="profile-image-wrapper">
        <div className="profile-image" onClick={() => fileInputRef.current.click()}>
          {profile.image ? <img src={profile.image} alt="Profile" /> : <span>{(profile.firstName[0] || "U")}</span>}
        </div>
        <button className="add-image-btn" onClick={() => fileInputRef.current.click()}>+</button>
        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
      </div>

      {!isEditing ? (
        <div className="profile-view">
          <p className="profile-name">{profile.firstName} {profile.lastName}</p>
          <div className="profile-details">
            <span>Experience: {profile.experience ? `${profile.experience} yrs` : "0 yrs"}</span>
            <span> | Skills: {profile.skills || "Not added"}</span>
          </div>
          <span className="edit-link" onClick={() => setIsEditing(true)}>Edit Profile...</span>
          <button style={{ marginTop: "15px" }} onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={e => e.preventDefault()}>
          <label>First Name</label>
          <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} />

          <label>Last Name</label>
          <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} />

          <label>Experience (years)</label>
          <input type="number" name="experience" value={profile.experience} onChange={handleChange} />

          <label>Skills (comma-separated)</label>
          <input type="text" name="skills" value={profile.skills} onChange={handleChange} />

          <button type="button" className="save-btn" onClick={handleSave}>Save</button>
        </form>
      )}
    </div>
  );
}
