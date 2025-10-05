// File: SeekerHome.js
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SeekerHome() {
  const [posts, setPosts] = useState([]);
  const [appliedPosts, setAppliedPosts] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("http://localhost:3001/posts").then(res => setPosts(res.data));

    // keep track of posts this seeker already applied to
    axios.get(`http://localhost:3001/seekerProfile?userId=${userId}`)
      .then(res => {
        const seeker = res.data[0];
        setAppliedPosts(seeker.appliedPosts || []);
      });
  }, [userId]);

  const handleApply = async (post) => {
    const seekerRes = await axios.get(`http://localhost:3001/seekerProfile?userId=${userId}`);
    const seeker = seekerRes.data[0];

    // Update post applicants
    const updatedPost = { ...post };
    updatedPost.applicants = updatedPost.applicants || [];
    updatedPost.applicants.push({ id: seeker.id, firstName: seeker.firstName, lastName: seeker.lastName });

    await axios.put(`http://localhost:3001/posts/${post.id}`, updatedPost);

    // Update seeker appliedPosts
    const updatedSeeker = { ...seeker };
    updatedSeeker.appliedPosts = updatedSeeker.appliedPosts || [];
    updatedSeeker.appliedPosts.push(post.id);
    await axios.put(`http://localhost:3001/seekerProfile/${seeker.id}`, updatedSeeker);

    setAppliedPosts(updatedSeeker.appliedPosts);
    setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
  };

  return (
    <div className="posts-container">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            {post.recruiterImage ? (
              <img src={post.recruiterImage} alt="profile" className="profile-image" />
            ) : <div className="profile-image-placeholder">{post.recruiterName[0]}</div>}
            <div className="recruiter-info">
              <p className="recruiter-name">{post.recruiterName}</p>
              <p className="details">{post.recruiterCompany} - {post.recruiterDesignation}</p>
            </div>
          </div>

          {post.jobDescription && <p className="job-desc">{post.jobDescription}</p>}
          {post.jobImage && <img src={post.jobImage} alt="job" className="job-image" />}

          <div className="post-actions">
            <button
              className="apply-btn"
              disabled={appliedPosts.includes(post.id)}
              onClick={() => handleApply(post)}
            >
              {appliedPosts.includes(post.id) ? "Applied" : "Apply"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
