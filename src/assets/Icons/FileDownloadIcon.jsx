import React from 'react';
import PropTypes from 'prop-types';

export const FileDownloadIcon = ({
  width = 177,
  height = 177,
  color = '#444445',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 117 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_829_90886"
        // maskType="luminance"
        maskUnits="userSpaceOnUse"
        x="-1"
        y="-1"
        width="118"
        height="118"
      >
        <path
          d="M-0.00390625 -0.00389862H116.996V116.996H-0.00390625V-0.00389862Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_829_90886)">
        <path
          d="M2.58789 7.76239V109.236C2.58789 112.577 5.29649 115.285 8.63761 115.285H91.9315V28.3921L65.2523 1.7129H8.63761C5.29649 1.7129 2.58789 4.42126 2.58789 7.76239Z"
          fill="#EBEEF2"
        />
        <path
          d="M71.0625 7.4555V32.5538C71.0625 35.0803 73.1105 37.1283 75.6369 37.1283H79.8875V115.285H85.8769C89.2206 115.285 91.9312 112.575 91.9312 109.231V28.3242L71.0625 7.4555Z"
          fill="#D4D9E0"
        />
        <path
          d="M65.252 1.71143L91.9312 28.3906H69.8227C67.2983 28.3906 65.252 26.344 65.252 23.8199V1.71143Z"
          fill="#FF7A00"
        />
        <path
          d="M13.6719 17.1094H48.2068"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.6719 28.3906H48.2068"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.041 49.2188H79.4772"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.041 63.4102H73.98"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.041 77.6016H73.98"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.041 91.793H61.1744"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M101.735 91.0078V63.3659C101.735 61.3817 100.127 59.7729 98.1426 59.7729H85.7191C83.7349 59.7729 82.1264 61.3817 82.1264 63.3659V91.0078H71.2715C69.66 91.0078 68.8529 92.9562 69.9925 94.0958L90.6519 114.755C91.3582 115.462 92.5038 115.462 93.2099 114.755L113.87 94.0958C115.009 92.9562 114.202 91.0078 112.591 91.0078H101.735Z"
          fill="#E97509"
        />
        <path
          d="M92.8115 95.9038H92.463C90.8488 95.9038 89.5405 94.5953 89.5405 92.9813V59.7732H98.1437C100.128 59.7732 101.736 61.3817 101.736 63.3659V91.0078H112.592C114.203 91.0078 115.01 92.9564 113.871 94.0958L93.2109 114.755C92.5046 115.462 91.3593 115.462 90.6529 114.755L85.834 109.936L94.8779 100.893C96.7189 99.0516 95.415 95.9038 92.8115 95.9038Z"
          fill="#FF7A00"
        />
        <path
          d="M91.9312 28.3906H69.8227C67.2983 28.3906 65.252 26.344 65.252 23.8199V1.71143"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M101.735 91.0078V63.3659C101.735 61.3817 100.127 59.7729 98.1426 59.7729H85.7191C83.7349 59.7729 82.1264 61.3817 82.1264 63.3659V91.0078H71.2715C69.66 91.0078 68.8529 92.9562 69.9925 94.0958L90.6519 114.755C91.3582 115.462 92.5038 115.462 93.2099 114.755L113.87 94.0958C115.009 92.9562 114.202 91.0078 112.591 91.0078H101.735Z"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M91.9315 51.1865V28.3921L65.2524 1.7129H8.63761C5.29649 1.7129 2.58789 4.4215 2.58789 7.7624V109.236C2.58789 112.577 5.29649 115.285 8.63761 115.285H81.4971"
          stroke={color}
          strokeWidth="3.42773"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

FileDownloadIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default FileDownloadIcon;
