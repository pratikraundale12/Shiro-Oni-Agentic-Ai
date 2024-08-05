import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../styles';
export const FileIcon = ({
  width = 65,
  height = 82,
  color = theme.colors.darker,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 62 83"
  >
    <path
      stroke={color}
      strokeWidth={2}
      d="M37.318 1h-18.54C10.398 1 6.207 1 3.604 3.603 1 6.207 1 10.397 1 18.779v44.444c0 8.38 0 12.571 2.603 15.175C6.207 81 10.397 81 18.779 81h26.666c8.381 0 12.571 0 15.175-2.603 2.603-2.604 2.603-6.794 2.603-15.175V26.904c0-1.817 0-2.725-.338-3.542-.338-.816-.98-1.459-2.265-2.743L43.603 3.604c-1.284-1.285-1.926-1.927-2.743-2.266C40.043 1 39.135 1 37.318 1Z"
    />
    <path
      stroke={color}
      strokeWidth={2}
      d="M36.55 1v17.778c0 4.19 0 6.285 1.302 7.587 1.301 1.302 3.396 1.302 7.587 1.302h17.778"
    />
  </svg>
);

FileIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
