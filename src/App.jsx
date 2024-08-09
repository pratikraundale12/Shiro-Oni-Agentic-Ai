import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles';
import { GlobalProvider } from './utils';
import Routes from './routes';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GlobalProvider>
        <Routes />
      </GlobalProvider>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </ThemeProvider>
  );
}

export default App;
