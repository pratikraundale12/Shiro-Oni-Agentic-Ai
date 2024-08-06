import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: inherit;
    height: inherit;
  }
`;

const SvgButton = ({ icon, onClick, ...rest }) => (
  <Button onClick={onClick} {...rest}>
    {icon}
  </Button>
);

SvgButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SvgButton;
