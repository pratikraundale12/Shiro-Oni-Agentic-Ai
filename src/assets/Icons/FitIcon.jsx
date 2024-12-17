import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const InhanceSVG = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
  justify-content: center;
  .data-title {
    font-size: 12px;
    text-align: center;
    color: #425466;
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

export const FitIcon = ({
  width = 50,
  height = 50,
  color = '#444445',
  dataTitle,
  onClick,
}) => (
  <InhanceSVG>
    <svg
      width={width}
      height={height}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      viewBox="0 0 50 50"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="49" height="49" rx="24.5" />

      <g transform="translate(13, 13)">
        <path
          d="M17.5858 5H14V3H21V10H19V6.41421L14.7071 10.7071L13.2929 9.29289L17.5858 5ZM3 14H5V17.5858L9.29289 13.2929L10.7071 14.7071L6.41421 19H10V21H3V14Z"
          fill="#444445"
        />
      </g>
    </svg>
    <span className="data-title">{dataTitle}</span>
  </InhanceSVG>
);

FitIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  dataTitle: PropTypes.string,
  onClick: PropTypes.func,
};
