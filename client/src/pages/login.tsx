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
    <div className="bg-dark h-screen">
      <div className="flex flex-col mx-auto bg-lighter h-[400px] w-[300px] rounded-lg">
        <h1>LOG IN</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" >
          {error && <p className="text-red-500">{error}</p>}
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required  />

             <button type="submit">LOG IN</button> 
        </form>

        <p>Haven't got an account?</p>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  )
}

export default Login;