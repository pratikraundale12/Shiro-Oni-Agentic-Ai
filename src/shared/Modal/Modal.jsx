import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { theme } from '../../styles';
import { Button, SvgButton } from '../Button';
import { CrossWithCircleIcon } from '../../assets';

const HeaderText = styled.h5`
  font-family: 'Noto Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 54px;
  padding: 16px;
  background-color: ${theme.colors.lightGrey};
`;

const Body = styled.div`
  padding: 16px;
`;

const Footer = styled.div`
  display: flex;
  gap: 1rem;
  height: 80px;
  width: ${props => (props.size === 'sm' ? '50%' : '30%')};
  padding: 16px;
  ${props => props.size === 'sm' && 'align-self: center;'}
`;

export const Modal = ({
  title,
  size = 'md',
  children,
  isOpen,
  onRequestClose,
  isLoading = false,
  secondaryButtonText = '',
  primaryButtonText = '',
  onSubmit = () => null,
}) => {
  const sizes = {
    lg: {
      width: '70%',
      height: '80%',
    },
    md: {
      width: '45%',
      height: '45%',
    },
    sm: {
      width: '30%',
      height: '45%',
    },
  };

  const styleObject = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: theme.colors.shadow,
      zIndex: 9,
    },
    content: {
      padding: 0,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      overflow: 'hidden',
      borderRadius: '0.5rem',
      minWidth: sizes[size].width,
      minHeight: sizes[size].height,
      transform: 'translate(-50%, -50%)',
      backgroundColor: theme.colors.white,
      boxShadow: `0px 4px 18px 0px ${theme.colors.shadow}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={styleObject}
    >
      <Header>
        <HeaderText>{title}</HeaderText>
        <SvgButton icon={<CrossWithCircleIcon />} onClick={onRequestClose} />
      </Header>
      <Body>{children}</Body>
      <Footer size={size}>
        <Button variant="secondary" onClick={onRequestClose}>
          {secondaryButtonText}
        </Button>
        <Button isLoading={isLoading} onClick={onSubmit}>
          {primaryButtonText}
        </Button>
      </Footer>
    </ReactModal>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  onSubmit: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  primaryButtonText: PropTypes.string,
  isLoading: PropTypes.bool,
};
