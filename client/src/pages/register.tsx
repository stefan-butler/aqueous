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
      await dispatch(register(firstName, lastName, email, password, isResponder, responderType)); 
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
    <div className="bg-dark h-screen flex justify-center items-center">
      <div className="flex flex-col bg-light h-auto w-[400px] p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold text-dark mb-4">Register</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
  
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="firstname" className="text-dark mb-1">First Name:</label>
            <input
              type="text"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="lastname" className="text-dark mb-1">Last Name:</label>
            <input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="email" className="text-dark mb-1">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="password" className="text-dark mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-dark mb-1">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="text-dark mb-1">Are you signing up as a responder?</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responder"
                  value="yes"
                  checked={isResponder === true}
                  onChange={() => setIsResponder(true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="responder"
                  value="no"
                  checked={isResponder === false}
                  onChange={() => setIsResponder(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
  
          {isResponder && (
            <div className="flex flex-col">
              <label htmlFor="responderType" className="text-dark mb-1">Responder Type:</label>
              <select
                id="responderType"
                value={responderType}
                onChange={(e) => setResponderType(e.target.value)}
                required
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select your type</option>
                <option value="Police">Police</option>
                <option value="Fire">Fire</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Search and Rescue">Search and Rescue</option>
              </select>
            </div>
          )}
  
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;