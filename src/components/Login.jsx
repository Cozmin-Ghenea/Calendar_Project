import { useState } from 'react';
import './Login.scss';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded accounts
    if (
      (username === 'andreiutzudragutzu' && password === 'andreiutzudragutzu123') ||
      (username === 'iulicasefulabani' && password === 'iulicasefulabani123')
    ) {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo">
            <span className="login-card__logo-icon">🐾</span>
            <span>PawsCalendar</span>
          </div>
          <p className="login-card__subtitle">Sign in to manage veterinary appointments</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-form__error">{error}</div>}

          <div className="login-form__group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="login-form__group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-form__button">
            Sign In
          </button>
        </form>
      </div>
      <div className="app__glow" />
    </div>
  );
}
