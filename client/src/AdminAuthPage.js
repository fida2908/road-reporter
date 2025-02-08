import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAuthPage.css';

const AdminAuthPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminPassword', password);
      alert('Signup successful! Please log in.');
      setIsSignup(false);
    } else {
      const storedEmail = localStorage.getItem('adminEmail');
      const storedPassword = localStorage.getItem('adminPassword');

      if (email === storedEmail && password === storedPassword) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        
        // Check if onLogin exists before calling
        if (onLogin) {
          onLogin();
        } else {
          console.error('onLogin function is not provided');
        }

        navigate('/admin-dashboard'); 
      } else {
        alert('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'Admin Sign Up' : 'Admin Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
      </p>
    </div>
  );
};

export default AdminAuthPage;
