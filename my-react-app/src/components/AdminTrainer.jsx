import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authInstance } from './firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminTrainer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const MAX_LOGIN_ATTEMPTS = 10;
  const BLOCK_DURATION_MINUTES = 10;
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isBlocked) {
      setErrorMessage(`Account is blocked. Try again after ${BLOCK_DURATION_MINUTES} minutes.`);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
      const displayName = user.displayName;

      if (user) {

        setLoginAttempts(0);
        setErrorMessage('');

        // Save the token securely on the client side (using HTTP-only cookie)
        const idToken = await user.getIdToken();
        document.cookie = `idToken=${idToken};max-age=${60 * 60 * 24 * 180};path=/`; // 6 months
        document.cookie = `displayName=${displayName};max-age=${60 * 60 * 24 * 180};path=/`; // 6 months
        login(email , idToken , displayName);
        // Redirect programmatically after successful login
        const lowercasedis = displayName.toLowerCase();
        navigate(`/${lowercasedis}`);
      } else {
        console.error('Invalid password');
        handleInvalidLogin();
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      handleInvalidLogin();
    }
  };

  const handleInvalidLogin = () => {
    setLoginAttempts((prevAttempts) => prevAttempts + 1);
    setErrorMessage('Invalid email or password.');

    if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      console.warn(`Too many unsuccessful login attempts. Account blocked for ${BLOCK_DURATION_MINUTES} minutes.`);
      setIsBlocked(true);

      // Reset login attempts after the block duration
      setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
        setErrorMessage('');
      }, BLOCK_DURATION_MINUTES * 60 * 1000);
    }
  };

  return (
    <div style={{ marginTop: '25vh' }}>
      <h2>עמוד כניסה למאמן</h2>
      <form>
        <label>
          email:
          <input
            type="email" 
            placeholder="Email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {isBlocked && <p>Account blocked. Try again after {BLOCK_DURATION_MINUTES} minutes.</p>}
        {!isBlocked && loginAttempts > 0 && (
          <p>Attempts left: {MAX_LOGIN_ATTEMPTS - loginAttempts}</p>
        )}
      </form>
      <div style={{ marginTop: '20vh' , padding: '50px', color: 'white', opacity:  '0.16'}}>
        <h3>all rights reserved to @eliad shahar</h3>
      </div>
    </div>
  );
};

export default AdminTrainer;
