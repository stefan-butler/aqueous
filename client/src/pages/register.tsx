import React, { useState } from 'react';
import { register } from '../redux/actions/authActions';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../redux/hooks';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResponder, setIsResponder] = useState(false); 
  const [responderType, setResponderType] = useState(''); 
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(register(firstName, lastName, email, password, isResponder)); 
      navigate('/'); // Redirect to home on success?
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Are you signing up as a responder?</label>
          <div>
            <label>
              <input
                type="radio"
                name="responder"
                value="yes"
                checked={isResponder === true}
                onChange={() => setIsResponder(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="responder"
                value="no"
                checked={isResponder === false}
                onChange={() => setIsResponder(false)}
              />
              No
            </label>
          </div>
        </div>
        {isResponder && (
          <div>
            <label htmlFor="responderType">Responder Type:</label>
            <select
              id="responderType"
              value={responderType}
              onChange={(e) => setResponderType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your type
              </option>
              <option value="Police">Police</option>
              <option value="Fire">Fire</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Search and Rescue">Search and Rescue</option>
            </select>
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;