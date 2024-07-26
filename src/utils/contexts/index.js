import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [modalState, setModalState] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        modalState,
        setModalState,
        editUserData,
        setEditUserData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGlobalContext = () => useContext(GlobalContext);

GlobalProvider.propTypes = {
  children: PropTypes.node,
};
