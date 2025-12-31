import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChatbotIcon } from '../assets';

export const AgenticAiButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: '#fff',
    borderRadius: '50%',
    width: '64px',
    height: '64px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: isHovered
      ? '0 1px 25px rgba(0, 0, 0, 0.4)'
      : '0 1px 20px rgba(0, 0, 0, 0.3)',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Open Chatbot"
    >
      <ChatbotIcon />
    </button>
  );
};

AgenticAiButton.propTypes = {
  onClick: PropTypes.func,
};
