import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Loader } from '../../../components/Loader';

const size = {
  sm: {
    height: '40px',
    padding: '0 10px',
    margin: '4px',
    fontSize: '12px',
  },
  md: {
    height: '48px',
    padding: '0 28px',
    margin: '10px',
    fontSize: '14px',
  },
  lg: {
    height: '56px',
    padding: '0 32px',
    margin: '10px',
    fontSize: '18px',
  },
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: prop => !['variant'].includes(prop),
})`
  height: ${props => size[props.size].height};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => size[props.size].padding};
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.darker};
  color: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.white
      : props.theme.colors.darker};
  background-color: ${props =>
    props.variant === 'primary'
      ? props.theme.colors.primary
      : props.theme.colors.white};
  transition:
    background 0.3s ease-in-out,
    color 0.3s ease-in-out;

  &:hover {
    color: ${props => props.theme.colors.white};
    background: ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primaryActive
        : props.theme.colors.darker};

    path {
      fill: ${props => props.theme.colors.white};
    }
  }

  &:disabled {
    cursor: not-allowed;
    background: ${props =>
      props.variant === 'primary'
        ? props.theme.colors.primaryDisabled
        : props.theme.colors.white};
    color: ${props =>
      props.variant === 'primary'
        ? props.theme.colors.white
        : props.theme.colors.lightGrey3};
    border-color: ${props =>
      props.variant === 'primary' ? 'none' : props.theme.colors.lightGrey3};
  }

  svg {
    margin-right: ${props =>
      props.iconPosition === 'left' ? size[props.size].margin : '0'};
    margin-left: ${props =>
      props.iconPosition === 'right' ? size[props.size].margin : '0'};
  }

  span {
    width: max-content;
    font-weight: 600;
    font-size: ${props => size[props.size].fontSize};
    font-family: ${props => props.theme.fontNato};
  }
`;

const LoadingText = styled.span`
  margin-right: 8px;
`;

const StyledLoader = styled(Loader)`
  width: auto !important;
`;

const Button = ({
  icon = null,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...buttonProps
}) => {
  if (loading) {
    return (
      <StyledButton
        size={size}
        variant={variant}
        icon={icon}
        disabled
        {...buttonProps}
      >
        <LoadingText>{loading === true ? 'Loading' : loading}</LoadingText>
        <StyledLoader size="sm" color="white" />
      </StyledButton>
    );
  }
  return (
    <StyledButton
      size={size}
      variant={variant}
      iconPosition={iconPosition}
      {...buttonProps}
    >
      {iconPosition === 'left' && icon}
      <span>{children}</span>
      {iconPosition === 'right' && icon}
    </StyledButton>
  );
};

Button.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf(['md', 'sm', 'lg']),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool, // Add PropTypes for the disabled prop
};

export default Button;
