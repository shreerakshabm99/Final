import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null); // profile of logged-in user
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ jobTitle: "", jobDescription: "", jobImage: "" });
  const fileInputRef = useRef(null);

  // Fetch logged-in profile and all posts
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Get logged-in user's profile
    axios
      .get(`http://localhost:3001/profile?userId=${userId}`)
      .then((res) => {
        if (res.data.length > 0) {
          setProfile(res.data[0]);
        } else {
          console.error("Profile not found for logged-in user!");
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // Get all posts
    axios.get("http://localhost:3001/posts").then((res) => setPosts(res.data));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle image upload for post
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPost((prev) => ({ ...prev, jobImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Create new post
  const handlePost = () => {
    if (!profile) {
      alert("Profile not loaded yet!");
      return;
    }

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
      setNewPost({ jobTitle: "", jobDescription: "", jobImage: "" });
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
        <p>Start a post...</p>
      </div>

      {/* Create post form */}
      {isCreating && (
        <div className="create-post-form">
          <textarea
            placeholder="Job Description"
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
          <button onClick={handlePost}>Post</button>
        </div>
      )}

      {/* Posts list */}
      <div className="posts-list">
        {posts.map((post, idx) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              {post.recruiterImage && <img src={post.recruiterImage} className="profile-image" alt="profile" />}
              <div className="recruiter-info">
                <p className="recruiter-name">{post.recruiterName}</p>
                
              </div>
            </div>

            {post.jobDescription && <p className="job-desc">{post.jobDescription}</p>}
            {post.jobImage && <img src={post.jobImage} alt="job" className="job-image" />}

            <div className="post-actions">
              <button className="apply-btn" onClick={() => handleApply(idx)}>
                Apply
              </button>
              <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>

            <p className="applicants-count">{post.applicants.length} applicant(s)</p>
          </div>
        ))}
      </div>
    </div>
  );
}
