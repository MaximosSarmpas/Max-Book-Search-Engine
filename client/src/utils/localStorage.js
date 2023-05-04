// This function retrieves the saved book IDs from the local storage
export const getSavedBookIds = () => {
 
  // Get the saved book IDs from the local storage
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  // Return the saved book IDs
  return savedBookIds;
};

// This function saves the book IDs to the local storage
export const saveBookIds = (bookIdArr) => {
 
  // Check if the book ID array is not empty
  if (bookIdArr.length) {
   
    // Save the book IDs to the local storage
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
   
    // Remove the saved books from the local storage if the book ID array is empty
    localStorage.removeItem('saved_books');
  }
};
// This function removes a book ID from the saved book IDs in the local storage
export const removeBookId = (bookId) => {
 
  // Get the saved book IDs from the local storage
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;
// Check if there are saved book IDs in the local storage
  if (!savedBookIds) {
    return false;
  }
// Remove the book ID from the saved book IDs
  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  
  // Save the updated saved book IDs to the local storage
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  // Return true to indicate that the book ID has been removed from the saved book IDs
  return true;
};
