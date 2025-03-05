import PropTypes from 'prop-types';
import React from 'react';

export const KeycloakIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="#008AAA" />
    <g clipPath="url(#clip0_12180_38187)">
      <path
        d="M15.371 6.59106L9.1245 6.59206C8.0775 8.39206 7.0395 10.1966 6 12.0011C7.0355 13.8071 8.081 15.6081 9.126 17.4091L15.371 17.4071L16.9155 14.7051H17.9945V14.7041H18L17.998 9.29506H16.914L15.371 6.59106ZM10.1635 8.39606H11.204L11.724 9.29606L10.164 12.0026L11.7225 14.7041L11.205 15.6091H10.1635C9.47127 14.407 8.77661 13.2063 8.0795 12.0071L10.1635 8.39606ZM13.284 8.39606L14.327 8.39756C15.023 9.60023 15.7173 10.8039 16.41 12.0086L14.3265 15.6086H13.2865C13.0955 15.3276 12.7675 14.7046 12.7675 14.7046L14.329 12.0021L12.767 9.29556L13.284 8.39606Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_12180_38187">
        <rect width="12" height="12" fill="white" transform="translate(6 6)" />
      </clipPath>
    </defs>
  </svg>
);

KeycloakIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
