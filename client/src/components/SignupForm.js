// Import necessary dependencies and utility functions
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { createUser } from '../utils/API';
import Auth from '../utils/auth';

// Define the SignupForm component
const SignupForm = () => {
  
  // Define state variables for user form data, validation and alert
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  
  const [validated] = useState(false);
  
  const [showAlert, setShowAlert] = useState(false);

  // Function to handle input change in form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

  // Check form validity before submitting
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
// Attempt to create a new user
    try {
      const response = await createUser(userFormData);

     // Check for successful server response 
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

       // Extract user data and token from server response, then log in
      const { token, user } = await response.json();
      console.log(user);
      Auth.login(token);
    } catch (err) {
      
      // Display an alert if an error occurs during user creation
      console.error(err);
      setShowAlert(true);
    }

    // Reset user form data state
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  // Render the SignupForm component
  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

{/* Form group for username input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

{/* Form group for email input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

{/* Form group for password input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
       
{/* Submit button with validation-based disabled state */}
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
