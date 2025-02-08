import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './AdminAuthPage.css';

const AdminAuthPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        // Sign up admin using Firebase
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Signup successful! Please log in.');
        setIsSignup(false);
      } else {
        // Log in admin using Firebase
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('isAdminAuthenticated', 'true');

        if (onLogin) {
          onLogin();
        }

        navigate('/admin-dashboard'); // Redirect to dashboard after login
      }
    } catch (error) {
      alert(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Admin Sign Up' : 'Admin Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
      </p>
    </div>
  );
};

export default AdminAuthPage;
