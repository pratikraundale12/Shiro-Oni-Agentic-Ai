/*eslint-disable*/
import PropTypes from 'prop-types';
import React from 'react';
import { KDFM } from '../../../constants';
import { theme } from '../../../styles';

const DoubleButton = ({
  disable,
  item,
  handleLeftClick,
  handleRightClick,
  handleControllerService,
}) => {
  return (
    <div className="btn-group" role="group" aria-label="Basic example">
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleLeftClick(item)}
          style={{
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
            borderRight: '1px solid #fff',
          }}
          disabled={disable}
        >
          {KDFM.DEPLOY}
        </button>
        <button
          type="button"
          className="btn btn-primary dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{
            backgroundColor: theme.colors.primary,
            borderColor: `${theme.colors.primary} ${theme.colors.primary} ${theme.colors.primary} #fff`,
          }}
          disabled={disable}
        ></button>
        <ul className="dropdown-menu">
          <li>
            <div
              className="p-1"
              style={{ cursor: 'pointer' }}
              onClick={() => handleRightClick(item)}
            >
              Schedule Deployment
            </div>
          </li>
          <li>
            <div
              className="p-1"
              style={{ cursor: 'pointer' }}
              onClick={() => handleControllerService(item)}
            >
              Controller Services
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
DoubleButton.propTypes = {
  disable: PropTypes.bool,
  item: PropTypes.object,
  handleLeftClick: PropTypes.func,
  handleRightClick: PropTypes.func,
};
export default DoubleButton;
