import React from 'react';
import './index.css';
import PropTypes from 'prop-types';

export const InsightContainer = ({
  backgroundCss,
  icon: Icon,
  count = '',
  text = '',
}) => (
  <div className="col-lg-3 col-4 mb-4">
    <div className={`main-box  w-100 h-100 position-relative ${backgroundCss}`}>
      <div className="bg-white icon-box d-flex align-items-center justify-content-center">
        <Icon />
      </div>
      <div className="d-flex align-items-center justify-content-start">
        <h5 className="my-0">{count}</h5>
      </div>
      <p className="mb-0">{text}</p>
    </div>
  </div>
);
InsightContainer.propTypes = {
  backgroundCss: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  text: PropTypes.string,
};

InsightContainer.defaultProps = {
  count: '',
  text: '',
};
