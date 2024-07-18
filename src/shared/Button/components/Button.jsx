import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button.withConfig({
  shouldForwardProp: prop => !['variant'].includes(prop),
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => (props.size === 'md' ? '16px' : '12px')};
  padding: ${props => (props.size === 'md' ? '16px 32px' : '6px 12px')};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-weight: 600;
  transition:
    background 0.3s ease-in-out,
    color 0.3s ease-in-out;
  text-transform: capitalize;
  background: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.white};
  color: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.white
      : props.theme.colors.primary};

  svg {
    fill: currentColor;
  }

  div {
    min-width: 100%;
  }

  &:hover:enabled {
    background: ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primaryActive
        : props.theme.colors.darker};
  }

  &:disabled {
    cursor: not-allowed;
    background: ${props => props.theme.colors.primaryDisabled};
    color: ${props => props.theme.colors.white};
    border: none;
  }
`;

const IconWrapper = styled.span.withConfig({
  shouldForwardProp: prop => !['position'].includes(prop),
})`
  display: inline-block;
  vertical-align: middle;
  ${props =>
    props.position === 'right'
      ? `margin-left: ${props.size === 'md' ? 10 : 6}px;`
      : `margin-right: ${props.size === 'md' ? 10 : 6}px;`}
`;

const Button = ({
  icon = null,
  iconPosition = 'left',
  variant = 'primary',
  type = 'button',
  size = 'md',
  children,
  ...buttonProps
}) => (
  <StyledButton size={size} type={type} variant={variant} {...buttonProps}>
    {icon && iconPosition === 'left' && (
      <IconWrapper position={iconPosition}>{icon}</IconWrapper>
    )}
    <div>{children}</div>
    {icon && iconPosition === 'right' && (
      <IconWrapper position={iconPosition}>{icon}</IconWrapper>
    )}
  </StyledButton>
);

Button.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf(['md', 'sm']),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

export default Button;
