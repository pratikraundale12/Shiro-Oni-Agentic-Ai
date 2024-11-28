/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
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

const CopyToClipboard = ({ copyItem, className, tooltipPlacement }) => {
  const fallbackCopyTextToClipboard = text => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom of page in some cases
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    // Hide the textarea out of view
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'Copied to Clipboard' : 'Failed to copy';
      toast.info(msg);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }

    document.body.removeChild(textArea);
  };

  const handleCopyToClipboard = async value => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(value);
        toast.info('Copied to Clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    } else {
      console.warn('Clipboard API not supported, using fallback.');
      fallbackCopyTextToClipboard(value);
    }
  };

  return (
    <>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      <StyledButton
        type="button"
        onClick={() => handleCopyToClipboard(copyItem)}
        className={className}
      >
        <CopyIcon />
      </StyledButton>
      <ReactTooltip
        id={tooltipPlacement}
        place="right"
        effect="solid"
        content={'Copy URL'}
        style={{
          width: '130px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      />
    </>
  );
};

CopyToClipboard.propTypes = {
  copyItem: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CopyToClipboard;
