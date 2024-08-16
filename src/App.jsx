import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import { ThemeProvider } from 'styled-components';
import Routes from './routes';
import { GlobalStyles, theme } from './styles';
import { GlobalProvider } from './utils';

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
