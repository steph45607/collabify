import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import TodoList from "./TodoList";
import Notes from "./Notes";
import "./Collabify.css";
import axios from 'axios';

const Collabify = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState(true);

  const navigate = useNavigate();

  const cleanInputs = () => {
    setEmail("");
    setPassword("");
  };

  const cleanErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleLogin = async (email, password) => {
    cleanErrors();
    try {
      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        body: new URLSearchParams({ 
        username: email, 
        password: password,
        grant_type: "password",
        scope: "" 
        }), headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' } 
      });

      response.json().then(response => localStorage.setItem('token', response.access_token));
      
      const newUser = {
        email,
        password,
      };

      setUser(newUser);
      navigate('/collabify');
    } catch (error) {
      console.error(error.response.data);
    }

  };

  const handleSignUp = async (email, password) => {
    cleanErrors();
  
    try {
      const response = await axios.post(
        'http://localhost:8000/signup/',
        { email, password },
        { headers: { 'content-type': 'application/json' } }
      );
  
      const token = response.data.access_token;
      localStorage.setItem('token', token);
  
      // Create a user object with the necessary properties
      // const newUser = {
      //   email,
      //   password,
      //   team: null,
      // };
  
      // Update the user state with the new user object
      // setUser(newUser);
  
      // Store the user in localStorage
      // localStorage.setItem("user", JSON.stringify(newUser));
  
      navigate("/collabify"); // Navigate to the dashboard route after successful signup
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get('http://localhost:8000/logout', config)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    localStorage.removeItem("token");
    setUser(null);
    navigate("/collabify", { replace: true });
    console.log("clicked");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="Collabify">
      <Routes>
        {user ? (
          <>
            <Route
            path="/"
            element={<Dashboard handleLogout={handleLogout} />}
          >
          </Route>
          </>
        ) : (
          <Route
            path="/"   
            element={
              <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                handleSignUp={handleSignUp}
                hasAccount={hasAccount}
                setHasAccount={setHasAccount}
                emailError={emailError}
                passwordError={passwordError}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
};

export default Collabify;
