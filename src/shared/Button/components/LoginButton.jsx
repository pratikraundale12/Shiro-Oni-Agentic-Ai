import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconWrapper = styled.span`
  margin-left: 8px;
`;

const LoginButton = ({ className, text, Icon, iconProps, ...props }) => {
  return (
    <button className={className} {...props}>
      <span>{text}</span>
      {Icon && (
        <IconWrapper>
          <Icon {...iconProps} />
        </IconWrapper>
      )}
    </button>
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  Icon: PropTypes.elementType,
  iconProps: PropTypes.object,
};

export default LoginButton;
