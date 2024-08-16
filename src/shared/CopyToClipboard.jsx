import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { CopyIcon } from '../assets';

export const StyledButton = styled.button`
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CopyToClipboard = ({ copyItem }) => {
  const handleCopyToClipboard = async value => {
    try {
      await navigator.clipboard.writeText(value);
      toast.info(`${value} is copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <StyledButton onClick={() => handleCopyToClipboard(copyItem)}>
      <CopyIcon />
    </StyledButton>
  );
};

CopyToClipboard.propTypes = {
  copyItem: PropTypes.string.isRequired,
};

export default CopyToClipboard;
