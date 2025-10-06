// File: SeekerHome.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SeekerProfile from "./SeekerProfile"; // your profile component

export default function SeekerHome() {
  const [posts, setPosts] = useState([]);
  const [appliedPosts, setAppliedPosts] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // fetch all posts
    axios.get("http://localhost:3001/posts").then(res => setPosts(res.data));

    // fetch seeker profile to track applied posts
    axios.get(`http://localhost:3001/seekerProfile?userId=${userId}`).then(res => {
      const seeker = res.data[0];
      setAppliedPosts(seeker.appliedPosts || []);
    });
  }, [userId]);

  const handleApply = async (post) => {
    const seekerRes = await axios.get(`http://localhost:3001/seekerProfile?userId=${userId}`);
    const seeker = seekerRes.data[0];

    // update post applicants
    const updatedPost = { ...post };
    updatedPost.applicants = updatedPost.applicants || [];
    updatedPost.applicants.push({ id: seeker.id, firstName: seeker.firstName, lastName: seeker.lastName });

    await axios.put(`http://localhost:3001/posts/${post.id}`, updatedPost);

    // update seeker appliedPosts
    const updatedSeeker = { ...seeker };
    updatedSeeker.appliedPosts = updatedSeeker.appliedPosts || [];
    updatedSeeker.appliedPosts.push(post.id);
    await axios.put(`http://localhost:3001/seekerProfile/${seeker.id}`, updatedSeeker);

    setAppliedPosts(updatedSeeker.appliedPosts);
    setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: "url('https://tse1.mm.bing.net/th/id/OIP.E-pR5ONrla1f_OkGWFqTLQHaEK?pid=Api&P=0&h=180')", // replace with your background
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "50px",
        position: "relative",
      }}
    >
      {/* Profile in top-right corner */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        {profileOpen ? (
          <SeekerProfile setProfileOpen={setProfileOpen} />
        ) : (
          <button
            onClick={() => setProfileOpen(true)}
            style={{
              background: "#11161bff",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Profile
          </button>
        )}
      </div>

      {/* Posts container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "800px",
          width: "90%",
        }}
      >
        {posts.map(post => (
          <div
            key={post.id}
            style={{
              background: "rgba(255,255,255,0.2)", // transparent
              padding: "20px",
              borderRadius: "12px",
              backdropFilter: "blur(5px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {post.recruiterImage ? (
                <img
                  src={post.recruiterImage}
                  alt="profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              ) : (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {post.recruiterName[0]}
                </div>
              )}
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{post.recruiterName}</p>
                <p style={{ margin: 0, fontSize: "14px" }}>
                  {post.recruiterCompany} - {post.recruiterDesignation}
                </p>
              </div>
            </div>

            <h3 style={{ marginTop: "10px" }}>{post.jobTitle}</h3>
            <p>Skills Needed: {post.skills}</p>
            <p>Experience Required: {post.experience} yrs</p>
            <p>Openings: {post.openings}</p>
            {post.jobDescription && <p>{post.jobDescription}</p>}

            <button
              disabled={appliedPosts.includes(post.id)}
              onClick={() => handleApply(post)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                borderRadius: "5px",
                border: "none",
                cursor: appliedPosts.includes(post.id) ? "not-allowed" : "pointer",
                background: appliedPosts.includes(post.id) ? "#ccc" : "#11161bff",
                color: "#fff",
              }}
            >
              {appliedPosts.includes(post.id) ? "Applied" : "Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
