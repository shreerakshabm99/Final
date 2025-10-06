import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null); // logged-in recruiter profile
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    jobTitle: "",
    companyName: "",
    experienceRequired: "",
    skillsRequired: "",
    openings: "",
    jobDescription: "",
    jobImage: "",
  });
  const fileInputRef = useRef(null);

  // Fetch logged-in profile and posts
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`http://localhost:3001/profile?userId=${userId}`)
      .then((res) => {
        if (res.data.length > 0) setProfile(res.data[0]);
      })
      .catch((err) => console.error("Error fetching profile:", err));

    axios.get("http://localhost:3001/posts").then((res) => setPosts(res.data));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewPost({ ...newPost, jobImage: reader.result });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Create new post
  const handlePost = () => {
    if (!profile) return alert("Profile not loaded!");

    const postWithProfile = {
      ...newPost,
      recruiterName: profile.name,
      recruiterCompany: profile.company,
      recruiterDesignation: profile.designation,
      recruiterImage: profile.image,
      applicants: [],
    };

    axios.post("http://localhost:3001/posts", postWithProfile).then((res) => {
      setPosts([res.data, ...posts]);
      setNewPost({
        jobTitle: "",
        companyName: "",
        experienceRequired: "",
        skillsRequired: "",
        openings: "",
        jobDescription: "",
        jobImage: "",
      });
      setIsCreating(false);
    });
  };

  // Apply to a post
  const handleApply = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].applicants.push("Applicant");
    axios
      .put(`http://localhost:3001/posts/${updatedPosts[index].id}`, updatedPosts[index])
      .then(() => setPosts(updatedPosts));
  };

  // Delete a post
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
      setPosts(posts.filter((post) => post.id !== id));
    });
  };

  return (
    <div className="posts-container">
      {/* Start post card */}
      <div className="start-post-card" onClick={() => setIsCreating(true)}>
        <p>Start a Job Post...</p>
      </div>

      {/* Create post form */}
      {isCreating && (
        <div className="create-post-form">
          <input
            type="text"
            placeholder="Job Title"
            name="jobTitle"
            value={newPost.jobTitle}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Company Name"
            name="companyName"
            value={newPost.companyName}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Experience Required (years)"
            name="experienceRequired"
            value={newPost.experienceRequired}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Skills Required (comma-separated)"
            name="skillsRequired"
            value={newPost.skillsRequired}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Number of Openings"
            name="openings"
            value={newPost.openings}
            onChange={handleChange}
          />
          <textarea
            placeholder="Job Description (optional)"
            name="jobDescription"
            value={newPost.jobDescription}
            onChange={handleChange}
          />
          <button onClick={() => fileInputRef.current.click()}>Upload Image</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
          <button onClick={handlePost}>Post Job</button>
        </div>
      )}

      {/* Posts list */}
      <div className="posts-list">
        {posts.map((post, idx) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              {post.recruiterImage && (
                <img src={post.recruiterImage} className="profile-image" alt="profile" />
              )}
              <div className="recruiter-info">
                <p className="recruiter-name">{post.recruiterName}</p>
                <p>{post.recruiterCompany}</p>
                <p>{post.recruiterDesignation}</p>
              </div>
            </div>

            <p><strong>Job Title:</strong> {post.jobTitle}</p>
            <p><strong>Experience Required:</strong> {post.experienceRequired} yrs</p>
            <p><strong>Skills Required:</strong> {post.skillsRequired}</p>
            <p><strong>Openings:</strong> {post.openings}</p>
            {post.jobDescription && <p className="job-desc">{post.jobDescription}</p>}
            {post.jobImage && <img src={post.jobImage} alt="job" className="job-image" />}

            <div className="post-actions">
              <button className="apply-btn" onClick={() => handleApply(idx)}>Apply</button>
              <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>

            <p className="applicants-count">{post.applicants.length} applicant(s)</p>
          </div>
        ))}
      </div>
    </div>
  );
}
