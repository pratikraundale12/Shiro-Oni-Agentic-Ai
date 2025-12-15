import React from 'react';
import PropTypes from 'prop-types';
import { ChatbotIcon } from '../assets';

export const AgenticAiButton = ({ onClick }) => {
  const buttonStyle = {
    backgroundColor: '#fff',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
  };

  return (
    <button style={buttonStyle} onClick={onClick} aria-label="Open Chatbot">
      <ChatbotIcon />
    </button>
  );
};

AgenticAiButton.propTypes = {
  onClick: PropTypes.func,
};
