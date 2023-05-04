// Importing the necessary dependencies from React and React-Bootstrap libraries
import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';
// Importing custom utility functions from our API and Local Storage
import Auth from '../utils/auth';
import { saveBook, searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

// Creating a functional component called "SearchBooks"
const SearchBooks = () => {
  
  // Setting initial states for searchedBooks and searchInput using the useState hook from React
  const [searchedBooks, setSearchedBooks] = useState([]);
  
  const [searchInput, setSearchInput] = useState('');

 // Setting initial state for savedBookIds by calling getSavedBookIds() from our Local Storage utility function
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Using the useEffect hook from React to automatically save the book ids to localStorage whenever savedBookIds state is updated
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Creating a function to handle form submission upon user clicking "Submit Search" button
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
// Creating a function to handle saving a book by bookId when the user clicks "Save this Book!" button
  const handleSaveBook = async (bookId) => {
   
    // Find the book object in searchedBooks state that matches the bookId passed in as parameter and set it to bookToSave
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // Check if the user is authenticated by checking for a token in local storage using Auth.loggedIn()
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      
      // Call saveBook function from our API utility function with bookToSave and token as parameters
      const response = await saveBook(bookToSave, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

       // Update savedBookIds state with the new bookId added to it
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // Return the following JSX elements as the UI for the SearchBooks component
  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
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

export default SearchBooks;
