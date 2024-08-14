import React, { useState } from 'react';
import { Routes as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import { history } from '../helpers/history';

export const HistoryRouter = ({ children }) => {
  const [state, setState] = useState(history);

  history.listen(setState);
  return <Router location={state.location}>{children}</Router>;
};

HistoryRouter.propTypes = {
  children: PropTypes.node.isRequired,
};
