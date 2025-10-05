import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import HomeSeeker from "./HomeSeeker";
import PostsSeeker from "./PostsSeeker";
import NotificationsSeeker from "./NotificationsSeeker";
import Profile from "./SeekerProfile";


function Recruiter() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [profileOpen, setProfileOpen] = useState(false); // track profile modal

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <HomeSeeker />;
      case "posts":
        return <PostsSeeker />;
      case "notifications":
        return <NotificationsSeeker />;
      default:
        return <HomeSeeker />;
    }
  };

  return (
    <div className={`grid-container ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setActivePage={setActivePage}
      />
      {/* PASS setProfileOpen to Header */}
      <Header setProfileOpen={setProfileOpen} />
      
      <div className="main-container">{renderContent()}</div>

      {profileOpen && <Profile setProfileOpen={setProfileOpen} />}{}
    </div>
  );
}

export default Recruiter;
