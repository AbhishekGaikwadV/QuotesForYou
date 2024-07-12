import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();

  // Create an Axios instance for API requests
  const apiClient = Axios.create({
    baseURL: 'https://quotes-for-you-a.vercel.app',
    withCredentials: true, // if you need to include cookies
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' // Ensure server returns JSON
    }
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
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

      // Detailed logging of the response
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      console.log('Response Data:', response.data);
      console.log('Response Config:', response.config);

      if (response.headers['content-type'].includes('application/json')) {
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
        navigate('/allquotes'); // Example redirect to '/allquotes'
      } else {
        throw new Error('Response is not in JSON format');
      }
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
