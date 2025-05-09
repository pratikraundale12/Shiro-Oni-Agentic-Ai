import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../styles';
const AnimatedProgressBar = ({
  width = '100%',
  color = theme.colors.primary,
}) => {
  return (
    <>
      <div className="progress" style={{ height: '13px' }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: width, backgroundColor: color }}
        />
      </div>
    </>
  );
};
AnimatedProgressBar.propTypes = {
  width: PropTypes.string,
  color: PropTypes.string,
};
export default AnimatedProgressBar;
