import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile({ setProfileOpen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [companies, setCompanies] = useState(["Sony", "Google", "Microsoft"]);
  const [newCompany, setNewCompany] = useState("");
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    id: "",
    userId: "",
    name: "",
    company: "",
    companyId: "",
    years: "",
    designation: "",
    image: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Fetch profile
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3001/profile?userId=${userId}`)
      .then(async (res) => {
        if (res.data.length > 0) {
          setProfile(res.data[0]);
        } else {
          // Auto-create profile if missing
          const newProfile = {
            userId,
            name: "",
            company: "",
            companyId: "",
            years: "",
            designation: "",
            image: "",
          };
          const response = await axios.post("http://localhost:3001/profile", newProfile);
          setProfile(response.data);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!profile.id) {
      alert("Profile ID missing! Refresh page.");
      return;
    }
    try {
      await axios.put(`http://localhost:3001/profile/${profile.id}`, profile);
      alert("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Check your JSON server.");
    }
  };

  const handleAddCompany = () => {
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
      setProfile({ ...profile, company: newCompany });
      setNewCompany("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const updatedProfile = { ...profile, image: reader.result };
        setProfile(updatedProfile);

        if (updatedProfile.id) {
          await axios.put(`http://localhost:3001/profile/${updatedProfile.id}`, updatedProfile);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Sign Out function
  const handleSignOut = () => {
    localStorage.clear(); // remove all user data
    navigate("/"); // redirect to login page
  };

  return (
    <div className="profile-sidebar open">
      <div className="profile-header">
        <h3>Profile</h3>
        <span className="close-btn" onClick={() => setProfileOpen(false)}>
          ×
        </span>
      </div>

      {/* Sign Out Button */}
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        <button onClick={handleSignOut} style={{ padding: "5px 10px", cursor: "pointer" }}>
          Sign Out
        </button>
      </div>

      {/* Image Section */}
      <div className="profile-image-wrapper">
        <div className="profile-image" onClick={() => fileInputRef.current.click()}>
          {profile.image ? (
            <img src={profile.image} alt="profile" />
          ) : (
            <div className="placeholder">Add Image</div>
          )}
        </div>
        <button className="add-image-btn" onClick={() => fileInputRef.current.click()}>
          +
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {!isEditing ? (
        <div className="profile-view">
          <h2 className="profile-name">{profile.name || "Your Name"}</h2>
          <p className="profile-details">
            {profile.company || "Company"} • {profile.designation || "Designation"} •{" "}
            {profile.years ? `${profile.years} yrs` : ""}
          </p>
          <span className="edit-link" onClick={() => setIsEditing(true)}>
            Edit Profile...
          </span>
        </div>
      ) : (
        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          <label>Name</label>
          <input type="text" name="name" value={profile.name || ""} onChange={handleChange} />

          <label>Company</label>
          <select name="company" value={profile.company || ""} onChange={handleChange}>
            {companies.map((comp, i) => (
              <option key={i} value={comp}>
                {comp}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Add new company"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />
          <button type="button" onClick={handleAddCompany}>
            Add Company
          </button>

          <label>Company ID</label>
          <input type="text" name="companyId" value={profile.companyId || ""} onChange={handleChange} />

          <label>Years</label>
          <input type="number" name="years" value={profile.years || ""} onChange={handleChange} />

          <label>Designation</label>
          <input type="text" name="designation" value={profile.designation || ""} onChange={handleChange} />

          <button type="button" className="save-btn" onClick={handleSave}>
            Save
          </button>
        </form>
      )}
    </div>
  );
}
