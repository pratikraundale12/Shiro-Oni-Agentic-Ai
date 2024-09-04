import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
const statusColors = {
  PENDING: '#b5b5bd',
  SCHEDULED: '#0cbf59',
  'NOT APPROVED': 'red',
  'IN PROGRESS': '#444445',
  DEFAULT: '#F2891F',
  SUCCESS: '#0cbf59',
};

const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  display: flex;
  align-items: center;
  div {
    align-items: center;
    height: 8px;
    width: 8px;
    background: ${props => props.color || '#b5b5bd'};
    margin-right: 5px;
    border-radius: 50%;
  }
`;
export const StatusText = ({ text = '' }) => {
  const color = statusColors[text] || statusColors.DEFAULT;
  function capitalizeFirstLetter(text) {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <StatusTexts color={color}>
      <div></div>
      {capitalizeFirstLetter(text)}
    </StatusTexts>
  );
};

StatusText.propTypes = {
  text: PropTypes.string,
};
