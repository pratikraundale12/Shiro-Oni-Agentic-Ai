import React from 'react';
import PropTypes from 'prop-types';

export const WelcomeCenterLogo = ({
  width = 60,
  height = 60,
  color = '#313131',
  hasShadow = true,
}) => {
  const shadowStyle = hasShadow
    ? {
        filter: 'drop-shadow(0px 1px 2px #1E1F2126)',
      }
    : {};

  return (
    <svg
      width={width}
      height={height}
      viewBox="40 35 65 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...shadowStyle, overflow: 'visible' }}
    >
      <g>
        <path
          d="M42 57C42 45.9543 50.9543 37 62 37H82C93.0457 37 102 45.9543 102 57V77C102 88.0457 93.0457 97 82 97H62C50.9543 97 42 88.0457 42 77V57Z"
          fill="white"
        />
        <path
          d="M70.7703 55.5176C70.8239 55.2308 70.9761 54.9718 71.2005 54.7855C71.4249 54.5991 71.7074 54.4971 71.9991 54.4971C72.2908 54.4971 72.5733 54.5991 72.7977 54.7855C73.0221 54.9718 73.1743 55.2308 73.2278 55.5176L74.5416 62.4651C74.6349 62.959 74.8749 63.4133 75.2304 63.7688C75.5858 64.1242 76.0402 64.3643 76.5341 64.4576L83.4816 65.7713C83.7683 65.8249 84.0273 65.977 84.2137 66.2014C84.4001 66.4258 84.5021 66.7084 84.5021 67.0001C84.5021 67.2918 84.4001 67.5743 84.2137 67.7987C84.0273 68.0231 83.7683 68.1753 83.4816 68.2288L76.5341 69.5426C76.0402 69.6359 75.5858 69.8759 75.2304 70.2314C74.8749 70.5868 74.6349 71.0411 74.5416 71.5351L73.2278 78.4826C73.1743 78.7693 73.0221 79.0283 72.7977 79.2147C72.5733 79.401 72.2908 79.5031 71.9991 79.5031C71.7074 79.5031 71.4249 79.401 71.2005 79.2147C70.9761 79.0283 70.8239 78.7693 70.7703 78.4826L69.4566 71.5351C69.3633 71.0411 69.1232 70.5868 68.7678 70.2314C68.4124 69.8759 67.958 69.6359 67.4641 69.5426L60.5166 68.2288C60.2298 68.1753 59.9709 68.0231 59.7845 67.7987C59.5981 67.5743 59.4961 67.2918 59.4961 67.0001C59.4961 66.7084 59.5981 66.4258 59.7845 66.2014C59.9709 65.977 60.2298 65.8249 60.5166 65.7713L67.4641 64.4576C67.958 64.3643 68.4124 64.1242 68.7678 63.7688C69.1232 63.4133 69.3633 62.959 69.4566 62.4651L70.7703 55.5176Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M82 54.5V59.5"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M84.5 57H79.5"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M62 79.5C63.3807 79.5 64.5 78.3807 64.5 77C64.5 75.6193 63.3807 74.5 62 74.5C60.6193 74.5 59.5 75.6193 59.5 77C59.5 78.3807 60.6193 79.5 62 79.5Z"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

WelcomeCenterLogo.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  hasShadow: PropTypes.bool,
};
