import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Posts from "./Posts";
import Notifications from "./Notifications";
import Profile from "./Profile";

function Recruiter() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("posts");
  const [profileOpen, setProfileOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]); // all notifications (history)
    const [unreadCount, setUnreadCount] = useState(0); // only for red badge

    const handleApply = (postId, seeker) => {
      // Update backend for application...

      // Add to notifications array
      const newNotification = { seekerId: seeker.id, seekerName: seeker.firstName };
      setNotifications(prev => [...prev, newNotification]);

      // Increment unread count by 1
      setUnreadCount(prev => prev + 1);
    };

    const renderContent = () => {
      switch (activePage) {
        case "posts":
          return <Posts />;
        case "notifications":
          // Reset unread count when recruiter opens Notifications
          if (unreadCount > 0) setUnreadCount(0);
          return <Notifications notifications={notifications} />;
        default:
          return <Posts/>;
      }
    };

  // Fetch posts and notifications
  useEffect(() => {
    axios.get("http://localhost:3001/posts").then((res) => {
      setPosts(res.data);

      // Flatten all applicants to notifications
      const allApplicants = [];
      res.data.forEach((post) => {
        if (post.applicants && post.applicants.length > 0) {
          post.applicants.forEach((applicant) => {
            allApplicants.push({
              ...applicant,
              postId: post.id,
              jobTitle: post.jobTitle,
            });
          });
        }
      });
      setNotifications(allApplicants);
    });
  }, []);

  return (
    <div className={`grid-container ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
  collapsed={collapsed}
  setCollapsed={setCollapsed}
  setActivePage={setActivePage}
  unreadCount={unreadCount}   // pass unreadCount
/>

      <Header setProfileOpen={setProfileOpen} />
      <div className="main-container">{renderContent()}</div>
      {profileOpen && <Profile setProfileOpen={setProfileOpen} />}
    </div>
  );
}

export default Recruiter;
