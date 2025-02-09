import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAuthPage.css';



const UserAuthPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      // Save user credentials to local storage (Mock database)
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      alert('Signup successful! Please log in.');
      setIsSignup(false);
    } else {
      // Check if email and password match stored credentials
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      if (email === storedEmail && password === storedPassword) {
        localStorage.setItem('isUserAuthenticated', 'true');
        onLogin(); // Ensure onLogin callback is called
        navigate('/report'); // Redirect to ReportPage after login
      } else {
        alert('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? 'User Sign Up' : 'User Login'}</h2>
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

export default UserAuthPage;
