/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Section = styled.div`
  background: #fff;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  padding-left: 0;
  font-weight: 600;
  background: transparent;
  cursor: pointer;

  &:focus,
  &:active {
    outline: none;
  }

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 10px solid #000;
    border-bottom: 6px solid transparent;
    display: inline-block;
    vertical-align: middle;
    transition: transform 0.2s ease;
  }

  &[aria-expanded='true']::before {
    transform: rotate(90deg);
  }
`;

const Content = styled.div`
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '100%' : '0')};
  transition: max-height 0.3s ease;
`;

// Common Collapsible Section Component
const CollapsibleSection = ({
  title,
  children,
  isControlled = false,
  isOpen: externalIsOpen,
  onToggle = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (isControlled) {
      onToggle(externalIsOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const openState = isControlled ? externalIsOpen : isOpen;

  return (
    <Section>
      <ToggleButton
        onClick={handleToggle}
        aria-expanded={openState}
        aria-controls={`section-content-${title}`}
      >
        {title}
      </ToggleButton>
      <Content id={`section-content-${title}`} isOpen={openState}>
        {children}
      </Content>
    </Section>
  );
};

export default CollapsibleSection;
