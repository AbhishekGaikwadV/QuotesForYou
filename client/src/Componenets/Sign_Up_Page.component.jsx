// Register.js
import { Callout, Button, FormGroup, InputGroup } from "@blueprintjs/core";
import React, { useState, useContext } from "react";
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Register = () => {
  // State hooks for form inputs and submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);

  const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}signup`;
  const genericErrorMessage = 'Something went wrong! Please try again later.';

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Send registration request to the API
    axios.post(apiUrl, {
      firstName,
      lastName,
      username: email,
      password,
    }, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        setIsSubmitting(false);
        const data = response.data;
        setUserContext(oldValues => ({ ...oldValues, token: data.token }));

        // Save user data in context after successful registration
        setUserContext(oldValues => ({
          ...oldValues,
          user: {
            id: data.userId,
            email: data.email,
          }
        }));
      })
      .catch((error) => {
        setIsSubmitting(false);
        if (error.response) {
          if (error.response.status === 400) {
            setError('Please fill all the fields correctly!');
          } else if (error.response.status === 401) {
            setError('Invalid email and password combination.');
          } else if (error.response.status === 500) {
            const data = error.response.data;
            if (data.message) {
              setError(data.message || genericErrorMessage);
            }
          } else {
            setError(genericErrorMessage);
          }
        } else {
          setError(genericErrorMessage);
        }
      });
  };

  return (
    <>
      {error && <Callout intent="danger">{error}</Callout>}

      <form onSubmit={formSubmitHandler} className="auth-form">
        <FormGroup label="First Name" labelFor="firstName" className="form-group">
          <InputGroup
            id="firstName"
            placeholder="First Name"
            onChange={e => setFirstName(e.target.value)}
            value={firstName}
            className="auth-input bp5-large"
          />
        </FormGroup>
        <FormGroup label="Last Name" labelFor="lastName" className="form-group">
          <InputGroup
            id="lastName"
            placeholder="Last Name"
            onChange={e => setLastName(e.target.value)}
            value={lastName}
            className="auth-input bp5-large"
          />
        </FormGroup>
        <FormGroup label="Email" labelFor="email" className="form-group">
          <InputGroup
            id="email"
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            className="auth-input bp5-large"
          />
        </FormGroup>
        <FormGroup label="Password" labelFor="password" className="form-group">
          <InputGroup
            id="password"
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            className="auth-input bp5-large"
          />
        </FormGroup>
        <Button
          intent="primary"
          disabled={isSubmitting}
          text={`${isSubmitting ? "Registering" : "Register"}`}
          fill
          type="submit"
        />
      </form>
    </>
  );
};

export default Register;
