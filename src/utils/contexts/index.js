import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const GlobalContext = createContext();

export const INITIAL_STATE = {
  currentUser: null,
  search: '',
  page: 1,
  gridData: {},
  loaders: {},
  errors: {},
  clusterList: [],
  selectedSourceClusterId: '',
  selectedNamespaceId: '',
  selectedDestinationClusterId: '',
};

export const GlobalProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
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
