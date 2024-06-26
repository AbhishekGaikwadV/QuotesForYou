// Welcome_Page.js
import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Card } from "@blueprintjs/core";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import axios from "axios";

const Welcome_Page = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch user details from the server
  const fetchUserDetails = useCallback(() => {
    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}me`;
    axios.get(apiUrl, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(response => {
      if (response.status === 200) {
        setUserContext((oldValues) => ({
          ...oldValues, details: response.data 
        }));
      } else {
        if (response.status === 401) {
          window.location.reload();
        } else {
          setUserContext((oldValues) => ({
            ...oldValues, details: null 
          }));
        }
      }
    }).catch(error => {
      if (error.response && error.response.status === 401) {
        window.location.reload();
      } else {
        setUserContext((oldValues) => ({
          ...oldValues, details: null 
        }));
      }
    });
  }, [setUserContext, userContext.token]);

  // Fetch user details when component mounts or token changes
  useEffect(() => {
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  // Handle user logout
  const logoutHandler = () => {
    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}logout`;
    axios.post(apiUrl, {}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(response => {
      setUserContext((oldValues) => ({
        ...oldValues, details: undefined, token: null 
      }));
      window.localStorage.setItem("logout", Date.now());
    }).catch(error => {
      console.error('Logout failed', error);
    });
  };

  // Refetch user details
  const refetchHandler = () => {
    setUserContext((oldValues) => ({
      ...oldValues, details: undefined 
    }));
  };

  // Redirect to show page
  const handleRedirect = () => {
    navigate('/show');
  };

  // Render loading, error, or user details
  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <Card elevation="1">
      <div className="user-details">
        <div>
          <p>
            Welcome&nbsp;
            <strong>
              {userContext.details.firstName}
              {userContext.details.lastName && " " + userContext.details.lastName}
            </strong>!
          </p>
          <p>
            Your reward points: <strong>{userContext.details.points}</strong>
          </p>
        </div>
        <div className="user-actions">
          <Button
            text="Logout"
            onClick={logoutHandler}
            minimal
            intent="primary"
          />
          <Button text="Refetch" intent="primary" onClick={refetchHandler} />
          <Button 
            text="Go to Show Page" 
            onClick={handleRedirect} 
            intent="primary" 
            large
          />
        </div>
      </div>
    </Card>
  );
};

export default Welcome_Page;
