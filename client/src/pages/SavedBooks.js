// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// Import utility functions and Auth
import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// Define the SavedBooks functional component
const SavedBooks = () => {
 
  // Set the initial state for userData
  const [userData, setUserData] = useState({});

  // Calculate the length of userData object
  const userDataLength = Object.keys(userData).length;

  // useEffect hook to fetch user data when the component mounts or userDataLength changes
  useEffect(() => {
    const getUserData = async () => {
      try {
       
        // Get the user token
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        // If the token is not available, return false
        if (!token) {
          return false;
        }

        // Fetch user data using the token
        const response = await getMe(token);

        // If the response is not ok, throw an error
        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        // Parse the response as JSON
        const user = await response.json();
       
         // Update the userData state with the fetched user data
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // Function to handle deleting a saved book
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      
      // Call the deleteBook function with the bookId and token
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // Parse the response as JSON
      const updatedUser = await response.json();
      setUserData(updatedUser);
     
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

 
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  // Render the saved books component
  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
