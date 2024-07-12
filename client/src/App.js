import './App.css';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { UserContext } from './context/UserContext.jsx';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Header from './Components/Header.component.jsx';
import Footer from './Components/Footer.component.jsx';
import Loader from './Components/Loader.component.jsx';s
import Login from './Components/Login_Page_component.jsx';
import Signup from './Components/Sign_Up_Page.component.jsx';
import ShowPage from './Components/ShowPage.component.jsx';
import MainPage from './Components/MainPage.components.jsx';
import Quote_FTM from './Components/Quote_FTM.component.jsx';
import Intuitive from './Components/Intuitive.component.jsx';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiClient = Axios.create({
  baseURL: 'https://your-api-endpoint.com/api/quotes', // Ensure this URL is correct
  withCredentials: true
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

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [{ user, token, loading }, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoadingQuotes(true);
      try {
        const response = await apiClient.get("/show");
        
        // Detailed logging of the response
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        console.log('Response Data:', response.data);
        console.log('Response Config:', response.config);
        
        if (response.headers['content-type'].includes('application/json')) {
          setQuotes(response.data.quotes);
        } else {
          throw new Error('Response is not in JSON format');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch quotes. Please try again later.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoadingQuotes(false);
      }
    };

    fetchQuotes();
  }, []); // Removed apiClient from dependency array

  const syncLogout = useCallback(event => {
    if (event.key === "logout") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  const handleLogout = () => {
    setUserContext({ user: null, token: null, loading: false });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.localStorage.setItem('logout', Date.now().toString());
    toast.success('You have been logged out', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate('/login');
  };

  if (loading) {
    return <Loader />;
  }

  console.log('Rendering App component');

  return (
    <div className="App">
      <Header currentUser={user} onLogout={handleLogout} />
      {token === null ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/moment" element={<Quote_FTM />} />
          <Route path="/show" element={<MainPage quote={quote} author={author} />} />
          <Route path="/allquotes" element={loadingQuotes ? <Loader /> : <ShowPage quotes={quotes} />} />
          <Route path="/intuitive" element={<Intuitive />} />
          <Route path="/logout" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/allquotes" />} />
        </Routes>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
