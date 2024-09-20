import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../../styles';
import { KDFM } from '../../../constants';
import { DownArrowIcon } from '../../../assets';

const DoubleButton = ({ disable, item, handleLeftClick, handleRightClick }) => {
  return (
    <div className="btn-group" role="group" aria-label="Basic example">
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleLeftClick(item)}
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: '#fff',
        }}
        disabled={disable}
      >
        {KDFM.DEPLOY}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: '#fff',
        }}
        disabled={disable}
        onClick={() => handleRightClick(item)}
      >
        <DownArrowIcon color="#fff" />
      </button>
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
