import React, { useState, useEffect, createContext, useCallback } from "react";
import axios from 'axios';

// Create a context with an empty object as the default value
const UserContext = createContext([{}, () => {}]);

// Define the initial state
const initialState = {
  token: localStorage.getItem('token') || null, // Retrieve token from localStorage if it exists
  user: null, // User data will be stored here after fetching
  loading: true, // Loading state to manage initial loading and verification process
};

const UserProvider = (props) => {
  const [state, setState] = useState(initialState);

  // Function to fetch user data from the server
  const fetchUserData = useCallback(async () => {
    if (!state.token) { // If no token is available, skip fetching user data
      setState(oldValues => ({ ...oldValues, loading: false }));
      return;
    }

    try {
      const response = await axios.get('https://quotes-for-you-client.vercel.app/me', {
        headers: {
          Authorization: `Bearer ${state.token}` // Attach token to request headers
        }
      });

      // Update state with fetched user data and set loading to false
      setState(oldValues => ({ ...oldValues, user: response.data, loading: false }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If fetching fails, clear token and user data, and set loading to false
      setState(oldValues => ({ ...oldValues, token: null, user: null, loading: false }));
    }
  }, [state.token]);

  // Function to verify user by checking if token is available and fetching user data
  const verifyUser = useCallback(() => {
    if (state.token) {
      fetchUserData(); // Fetch user data if token is present
    } else {
      setState(oldValues => ({ ...oldValues, loading: false })); // Set loading to false if no token
    }
  }, [state.token, fetchUserData]);

  // useEffect to handle initial verification and periodic re-verification
  useEffect(() => {
    verifyUser(); // Initial verification
    const intervalId = setInterval(() => {
      verifyUser(); // Periodic verification every 5 minutes
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [verifyUser]);

  // Provide the user context to children components
  return (
    <UserContext.Provider value={[state, setState]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
