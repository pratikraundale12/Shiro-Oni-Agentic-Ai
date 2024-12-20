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
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 2px;
  }
`;

export const ProcessorGroupIcon = () => (
  <InhancedSVG>
    <svg
      width="66"
      height="30"
      viewBox="0 0 66 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.25"
        y="0.25"
        width="65.5"
        height="29.5"
        rx="1.75"
        fill="white"
        stroke="#008080"
        strokeWidth="0.5"
      />
      <path
        d="M0 2C0 0.89543 0.895431 0 2 0H64C65.1046 0 66 0.895431 66 2V7H0V2Z"
        fill="#008080"
      />
    </svg>
    <div className="data-title">
      <svg
        width="5"
        height="5"
        viewBox="0 0 5 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="2.5" cy="2.5" r="2.5" fill="#008080" />
      </svg>
      &nbsp;
      <span>Process Group</span>
    </div>
  </InhancedSVG>
);
