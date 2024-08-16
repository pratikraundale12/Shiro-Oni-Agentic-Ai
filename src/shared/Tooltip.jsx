import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

export const Tooltip = ({ id, children, styles, place = 'bottom' }) => {
  return (
    <ReactTooltip id={id} place={place} content={children} style={styles} />
  );
};

Tooltip.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  styles: PropTypes.object,
  place: PropTypes.string,
};
