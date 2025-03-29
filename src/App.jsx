import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import { ThemeProvider } from 'styled-components';
import { ExclamationFailedTestingIcon } from './assets';
import { ENABLE_CONSOLE_LOGS } from './constants';
import { disableConsole } from './helpers/DisableConsole';
import Routes from './routes';
import { ModalWithIcon } from './shared';
import store from './store/configureStore';
import { GlobalStyles, theme } from './styles';
import { GlobalProvider } from './utils';

function App() {
  const [isModal, setIsModal] = useState(false);
  const updateNetworkStatus = () => {
    if (!navigator.onLine) {
      setIsModal(true);
    } else {
      setIsModal(false);
    }
  };
  if (ENABLE_CONSOLE_LOGS) {
    disableConsole();
  }
  const handleContinue = () => {
    setIsModal(false);
    setTimeout(() => {
      if (!navigator.onLine) {
        setIsModal(true);
      }
    }, 100);
  };

  useEffect(() => {
    window.addEventListener('load', updateNetworkStatus);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('load', updateNetworkStatus);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [navigator.onLine]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Provider store={store}>
        <GlobalProvider>
          <Routes />
          <ModalWithIcon
            title={'Lost Internet Connection'}
            primaryButtonText={'Continue'}
            icon={<ExclamationFailedTestingIcon color="#FF7A00" />}
            isOpen={isModal}
            onRequestClose={() => handleContinue()}
            primaryText={`It looks like you've lost internet access.`}
            onSubmit={() => handleContinue()}
          />
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
