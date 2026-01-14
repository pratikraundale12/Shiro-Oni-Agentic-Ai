import React from 'react';
import PropTypes from 'prop-types';

export const WelcomeCenterLogo = ({
  width = 144,
  height = 144,
  color = '#313131',
  bgColor = '#ffffff',
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 144 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_d)">
        <path
          d="M42 57C42 45.9543 50.9543 37 62 37H82C93.0457 37 102 45.9543 102 57V77C102 88.0457 93.0457 97 82 97H62C50.9543 97 42 88.0457 42 77V57Z"
          fill={bgColor}
          shapeRendering="crispEdges"
        />

        <path
          d="M70.7703 55.5174C70.8239 55.2307 70.9761 54.9717 71.2005 54.7853C71.4249 54.599 71.7074 54.4969 71.9991 54.4969C72.2908 54.4969 72.5733 54.599 72.7977 54.7853C73.0221 54.9717 73.1743 55.2307 73.2278 55.5174L74.5416 62.4649C74.6349 62.9589 74.8749 63.4132 75.2304 63.7687C75.5858 64.1241 76.0402 64.3641 76.5341 64.4574L83.4816 65.7712C83.7683 65.8248 84.0273 65.9769 84.2137 66.2013C84.4001 66.4257 84.5021 66.7082 84.5021 66.9999C84.5021 67.2916 84.4001 67.5742 84.2137 67.7986C84.0273 68.023 83.7683 68.1751 83.4816 68.2287L76.5341 69.5424C76.0402 69.6357 75.5858 69.8758 75.2304 70.2312C74.8749 70.5867 74.6349 71.041 74.5416 71.5349L73.2278 78.4824C73.1743 78.7692 73.0221 79.0282 72.7977 79.2145C72.5733 79.4009 72.2908 79.5029 71.9991 79.5029C71.7074 79.5029 71.4249 79.4009 71.2005 79.2145C70.9761 79.0282 70.8239 78.7692 70.7703 78.4824L69.4566 71.5349C69.3633 71.041 69.1232 70.5867 68.7678 70.2312C68.4124 69.8758 67.958 69.6357 67.4641 69.5424L60.5166 68.2287C60.2298 68.1751 59.9709 68.023 59.7845 67.7986C59.5981 67.5742 59.4961 67.2916 59.4961 66.9999C59.4961 66.7082 59.5981 66.4257 59.7845 66.2013C59.9709 65.9769 60.2298 65.8248 60.5166 65.7712L67.4641 64.4574C67.958 64.3641 68.4124 64.1241 68.7678 63.7687C69.1232 63.4132 69.3633 62.9589 69.4566 62.4649L70.7703 55.5174Z"
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

      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="144"
          height="144"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="5" />
          <feGaussianBlur stdDeviation="21" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

WelcomeCenterLogo.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
};
