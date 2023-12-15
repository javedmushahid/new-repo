// auth.js
export const isAuthenticated = () => {
    // Assuming you store your auth token in localStorage
    const token = localStorage.getItem('token');
    return !!token; // !! converts a value to a boolean, false if null or undefined
  };
  