import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RangeContainer = styled.div`
  display: flex;
  background: #edeeee;
  padding: 4px;
  border-radius: 8px;
  width: fit-content;
  gap: 2px;
`;

const Pill = styled.button`
  border: none;
  background: ${props => (props.active ? '#ffffff' : 'transparent')};
  color: ${props => (props.active ? '#363637' : '#575758')};
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => (props.active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
  transition: all 0.2s ease;
  font: Red Hat Display;

  &:hover {
    color: #111827;
    background: #ffffff;
  }
`;

// const CustomButton = styled(Pill)`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   background: #f3f4f6;
//   margin-left: 12px;
//   opacity: 0.6;
//   cursor: not-allowed;
// `;

const TIME_OPTIONS = [
  { label: '5M', value: 5 },
  { label: '10M', value: 10 },
  { label: '30M', value: 30 },
  { label: '1H', value: 60 },
  { label: '2H', value: 120 },
];

export const TimeRangeSelector = ({ selectedRange, onRangeSelect }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <RangeContainer>
        {TIME_OPTIONS.map(option => (
          <Pill
            key={option.label}
            active={selectedRange === option.label}
            onClick={() => onRangeSelect(option)}
          >
            {option.label}
          </Pill>
        ))}
      </RangeContainer>
      {/* <CustomButton disabled>Custom</CustomButton> */}
    </div>
  );
};

TimeRangeSelector.propTypes = {
  selectedRange: PropTypes.string,
  onRangeSelect: PropTypes.func.isRequired,
};
