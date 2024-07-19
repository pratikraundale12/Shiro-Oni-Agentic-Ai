import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <GlobalContext.Provider value={{ state, setState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

GlobalProvider.propTypes = {
  children: PropTypes.node,
};
