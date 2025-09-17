import React from 'react';
import PropTypes from 'prop-types';

export const ControllerServicesIcon = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.3333 6.89175V3.52508C18.3333 2.20008 17.8 1.66675 16.475 1.66675H13.1083C11.7833 1.66675 11.25 2.20008 11.25 3.52508V6.89175C11.25 8.21675 11.7833 8.75008 13.1083 8.75008H16.475C17.8 8.75008 18.3333 8.21675 18.3333 6.89175Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.74935 7.10008V3.31675C8.74935 2.14175 8.21602 1.66675 6.89102 1.66675H3.52435C2.19935 1.66675 1.66602 2.14175 1.66602 3.31675V7.09175C1.66602 8.27508 2.19935 8.74175 3.52435 8.74175H6.89102C8.21602 8.75008 8.74935 8.27508 8.74935 7.10008Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.74935 16.475V13.1083C8.74935 11.7833 8.21602 11.25 6.89102 11.25H3.52435C2.19935 11.25 1.66602 11.7833 1.66602 13.1083V16.475C1.66602 17.8 2.19935 18.3333 3.52435 18.3333H6.89102C8.21602 18.3333 8.74935 17.8 8.74935 16.475Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.084 14.5833H17.084"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M14.584 17.0833V12.0833"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

ControllerServicesIcon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
