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

export const SelectedProcessGrpIcon = () => (
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
        stroke="#FF7A00"
        strokeWidth="0.5"
      />
      <path
        d="M0.25 2C0.25 1.0335 1.0335 0.25 2 0.25H64C64.9665 0.25 65.75 1.0335 65.75 2V6.75H0.25V2Z"
        fill="#FF7A00"
        stroke="#FF7A00"
        strokeWidth="0.5"
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
        <circle cx="2.5" cy="2.5" r="2.5" fill="#FF7A00" />
      </svg>
      &nbsp;
      <span>Selected Process Group</span>
    </div>
  </InhancedSVG>
);
