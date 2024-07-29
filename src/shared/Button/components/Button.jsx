import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Loader } from '../../../components/Loader';

const StyledButton = styled.button.withConfig({
  shouldForwardProp: prop => !['variant'].includes(prop),
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => (props.size === 'md' ? '14px' : '12px')};
  padding: ${props =>
    props.size === 'md'
      ? '4px 12px'
      : props.size === 'lg'
        ? '20px 32px'
        : '6px 14px'};
  border: 1px solid
    ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.darker};
  border-radius: 8px;
  font-weight: 600;
  transition:
    background 0.3s ease-in-out,
    color 0.3s ease-in-out;
  cursor: pointer;
  background: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.white};
  color: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.white
      : props.theme.colors.darker};
  // ${props => props.icon && 'padding: 4px 10px;'}

  div {
    font-weight: bold;
    min-width: max-content;
    ${props =>
      props.size === 'lg' &&
      `
      font-family: ${props.theme.fontNato};
      font-size: 18px;
      line-height: 24px;
      margin-left: 16px;
      `}
  }

  &:hover:enabled {
    background: ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primaryActive
        : props.theme.colors.darker};
    color: ${props => props.theme.colors.white};
    border: 1px solid
      ${props =>
        props.variant === 'primary'
          ? props.theme.colors.primaryActive
          : props.theme.colors.white};
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
  margin-top: 6px;
  ${props =>
    props.position === 'right'
      ? `margin-left: ${props.size === 'md' ? 10 : 4}px;`
      : `margin-right: ${props.size === 'md' ? 10 : 4}px;`}
`;

const Button = ({
  icon = null,
  iconPosition = 'left',
  variant = 'primary',
  type = 'button',
  size = 'md',
  children,
  isLoading = false,
  disabled = false, // Add the disabled prop here
  ...buttonProps
}) => {
  if (isLoading) {
    return (
      <StyledButton
        size={size}
        type={type}
        variant={variant}
        icon={icon}
        disabled
        {...buttonProps}
      >
        <span>Loading...</span> <Loader size="sm" color="white" />
      </StyledButton>
    );
  }

  return (
    <StyledButton
      size={size}
      type={type}
      variant={variant}
      icon={icon}
      disabled={disabled} // Pass the disabled prop to StyledButton
      {...buttonProps}
    >
      {icon && iconPosition === 'left' && (
        <IconWrapper position={iconPosition}>{icon}</IconWrapper>
      )}
      <div>{children}</div>
      {icon && iconPosition === 'right' && (
        <IconWrapper position={iconPosition}>{icon}</IconWrapper>
      )}
    </StyledButton>
  );
};

Button.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf(['md', 'sm']),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool, // Add PropTypes for the disabled prop
};

export default Button;
