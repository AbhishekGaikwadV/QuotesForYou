import './App.css';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { UserContext } from './context/UserContext.jsx';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Header from './Componenets/Header.component.jsx';
import Footer from './Componenets/Footer.component.jsx';
import Loader from './Componenets/Loader.jsx';
import Login from './Componenets/Login_Page_component.jsx';
import SignUp from './Componenets/Sign_Up_Page.component.jsx';
import ShowPage from './Componenets/ShowPage.component.jsx';
import MainPage from './Componenets/MainPage.component.jsx';
import Quote_FTM from './Componenets/Quote_FTM.component.jsx';
import Intuitive from './Componenets/Intuitive.component.jsx';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [{ user, token, loading }, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();

  const apiClient = Axios.create({
    baseURL: 'https://quotes-for-you-a.vercel.app',
    withCredentials: true // if you need to include cookies
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoadingQuotes(true);
      try {
        const response1 = await apiClient.get("/");
        if (response1.headers['content-type'].includes('application/json')) {
          setQuote(response1.data.quote);
          setAuthor(response1.data.author);
        } else {
          throw new Error('Response is not in JSON format');
        }

        const response2 = await apiClient.get("/show");
        if (response2.headers['content-type'].includes('application/json')) {
          setQuotes(response2.data.quotes);
        } else {
          throw new Error('Response is not in JSON format');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingQuotes(false);
      }
    };

    fetchQuotes();
  }, [apiClient]);

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
    localStorage.removeItem('someOtherItem');
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
          {/* <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/moment" element={<Quote_FTM />} />
          <Route path="/main" element={<MainPage quote={quote} author={author} />} />
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
