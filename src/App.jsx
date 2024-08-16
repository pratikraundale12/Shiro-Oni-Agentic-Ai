import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

import { GlobalStyles, theme } from './styles';
import { GlobalProvider } from './utils';
import Routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

import store from './store/configureStore';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Provider store={store}>
        <GlobalProvider>
          <Routes />
        </GlobalProvider>
      </Provider>
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
