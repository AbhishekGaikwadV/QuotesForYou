import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import Axios from 'axios';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setUserContext] = useContext(UserContext);
  const navigate = useNavigate(); // Get navigate function from react-router-dom

  // Create an Axios instance for API requests
  const apiClient = Axios.create({
    baseURL: 'https://quotes-for-you-a.vercel.app',
    withCredentials: true, // if you need to include cookies
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Send login request using apiClient
      const response = await apiClient.post("/login", {
        username: email,
        password
      });

      const data = response.data;
      setIsSubmitting(false);

      // Save token and user details in context
      localStorage.setItem('token', data.token);
      setUserContext(oldValues => ({
        ...oldValues,
        token: data.token,
        user: {
          id: data.userId,
          email: data.email,
        }
      }));

      // Redirect to another page after successful login
      navigate('/main'); // Example redirect to '/main'

    } catch (error) {
      setIsSubmitting(false);
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isSubmitting} className="login-button">
          Submit
        </button>
      </form>
      
      {/* Add Link to Forgot Password */}
      <span>
        <Link to="/forgot">Forgot Password?</Link>
      </span>
    </div>
  );
};

export default Login;
