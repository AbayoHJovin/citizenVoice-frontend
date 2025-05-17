
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { checkAuthStatus } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { apiUrl } from './lib/apiUrl.ts';

// Configure default axios settings
axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true; // Enable cookies with requests

// No need to add Authorization header manually, cookies will be sent automatically

// Add response interceptor for handling auth errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Only clear user data, cookies are handled by the server
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// We'll check auth status only in protected routes
// No global auth check here to avoid unnecessary API calls

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    <ToastContainer position="top-right" autoClose={5000} />
  </Provider>
);
