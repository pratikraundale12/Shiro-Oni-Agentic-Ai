import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #b5b5bd;
  display: flex;
  align-items: center;
  div {
    align-items: center;
    height: 8px;
    width: 8px;
    background: #b5b5bd;
    margin-right: 5px;
    border-radius: 50%;
  }
`;
export const StatusText = ({ text = '' }) => {
  return (
    <StatusTexts>
      <div></div>
      {text}
    </StatusTexts>
  );
};

StatusText.propTypes = {
  text: PropTypes.string,
};
