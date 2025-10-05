import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import email from "./email.png";
import password from "./password.png";
import person from "./person.png";

export default function Login() {
  const [action, setAction] = useState("Login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!signupUsername || !signupEmail || !signupPassword || !role) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const { data } = await axios.get("http://localhost:3001/users");
      const existingUser = data.find((u) => u.email === signupEmail);
      if (existingUser) {
        alert("Email already exists!");
        return;
      }

      const newUser = {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        role: role
      };

      await axios.post("http://localhost:3001/users", newUser);
      alert("Sign Up successful! Please log in.");
      setAction("Login");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong during sign up!");
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password!");
      return;
    }

    try {
      const { data } = await axios.get("http://localhost:3001/users");
      const user = data.find(
        (u) => u.email === loginEmail && u.password === loginPassword
      );

      if (user) {
    
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("userId", user.id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("username", user.username);

        if (user.role === "Recruiter") {
          navigate("/recruiter");
        } else if (user.role === "Seeker") {
          navigate("/seeker");
        } else {
          alert("Invalid role!");
        }
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login!");
    }
  };

  return (
     <div className="login-page">
    <div className="container">
      <div className="header1">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign Up" && (
          <>
            <div className="input">
              <img src={person} alt="" />
              <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
              />
            </div>

            <div className="input">
              <img src={email} alt="" />
              <input
                type="email"
                placeholder="Email Id"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>

            <div className="input">
              <img src={password} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>

            <div className="input">
              <img src={person} alt="" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="">Select Role</option>
                <option value="Seeker">Seeker</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </div>
          </>
        )}

        {action === "Login" && (
          <>
            <div className="input">
              <img src={email} alt="" />
              <input
                type="email"
                placeholder="Email Id"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="input">
              <img src={password} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="submit-container">
        {action === "Sign Up" ? (
          <div className="submit" onClick={handleSignup}>
            Sign Up
          </div>
        ) : (
          <div className="submit" onClick={handleLogin}>
            Login
          </div>
        )}

        <div
          className={action === "Login" ? "submit-gray" : "submit-gray"}
          onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
        >
          {action === "Login" ? "Sign Up" : "Login"}
        </div>
      </div>
    </div>
    </div>
  );
}
