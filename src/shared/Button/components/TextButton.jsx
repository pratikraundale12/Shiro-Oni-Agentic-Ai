import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  font-size: 12px;
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.info};
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
`;

const TextButton = ({ children, ...props }) => (
  <Button type="button" {...props}>
    {children}
  </Button>
);

TextButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TextButton;
