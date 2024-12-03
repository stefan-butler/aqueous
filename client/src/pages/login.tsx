import { useState } from "react";
import { useAppDispatch } from '../redux/hooks'
import { login } from "../redux/actions/authActions";
import { useNavigate } from "react-router";

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await dispatch(login(email, password));
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    }

  }

  return (
    <div className="bg-dark h-screen flex justify-center">
    <div className="flex flex-col bg-light h-[450px] w-[350px] p-6 rounded-lg shadow-lg mt-[100px]">
      <h1 className="text-center text-2xl font-bold text-dark mb-4">Log In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && <p className="text-red-500 text-center">{error}</p>}
        
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

        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Log In
        </button>
      </form>

      <p className="text-center mt-4 text-gray-700">Haven't got an account?</p>
      <button 
        onClick={() => navigate('/register')} 
        className="bg-gray-200 text-dark py-2 px-4 mt-2 rounded-lg hover:bg-gray-300 transition duration-200"
      >
        Register
      </button>
    </div>
  </div>
  )
}

export default Login;