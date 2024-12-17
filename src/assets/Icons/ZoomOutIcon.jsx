import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const InhancedSVG = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
  justify-content: center;
  .data-title {
    font-size: 12px;
    text-align: center;
    color: #444445;
    font-weight: 500;
  }
  svg {
    rect {
      fill: #f5f7fa;
      stroke: #e9e0e0;
    }
    &:hover {
      fill: #edf1f7;
      stroke: #e9f0e0;
    }
    &:active {
      fill: #edf1f7;
      stroke: #b8bcc1;
    }
  }
`;

export const ZoomOutIcon = ({
  width = 50,
  height = 50,
  color = '#444445',
  dataTitle,
  onClick,
}) => (
  <InhancedSVG>
    <svg
      width={width}
      height={height}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      viewBox="0 0 50 50"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="49"
        height="49"
        rx="24.5"
        fill="#F5F7FA"
        stroke="#E9E0E0"
      />

      <g transform="translate(13, 13)">
        <path
          d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748ZM7 10H15V12H7V10Z"
          fill="#444445"
        />
      </g>
    </svg>
    <span className="data-title">{dataTitle}</span>
  </InhancedSVG>
);

ZoomOutIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  dataTitle: PropTypes.string,
  onClick: PropTypes.func,
};
