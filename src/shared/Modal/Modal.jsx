import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { theme } from '../../styles';
import { Button, SvgButton } from '../Button';
import { CrossIcons } from '../../assets';

const Title = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 14px;
  font-weight: 600;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 16px;
  background-color: ${theme.colors.lightGrey};
`;

const Body = styled.div`
  padding: 16px;
  // flex: 1;
`;

const Footer = styled.div`
  padding: 16px;
  display: flex;
  gap: 1rem;
  height: 80px;
  width: ${props => (props.size === 'sm' ? '50%' : '25%')};
  ${props => props.size === 'sm' && 'align-self: center;'}
`;

const CloseIcon = styled(CrossIcons)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.white};
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
      zIndex: 9,
      backgroundColor: theme.colors.shadow,
    },
    content: {
      padding: 0,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      overflow: 'hidden',
      borderRadius: 16,
      minWidth: sizes[size].width,
      minHeight: sizes[size].height,
      maxWidth: sizes[size].width,
      maxHeight: sizes[size].height,
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
      ariaHideApp={false}
    >
      <Header>
        <Title>{title}</Title>
        <SvgButton icon={<CloseIcon />} onClick={onRequestClose} />
      </Header>
      <Body style={title === 'Cluster Summary' ? { flex: 1 } : {}}>
        {children}
      </Body>{' '}
      <Footer size={size}>
        {secondaryButtonText && (
          <Button variant="secondary" onClick={onRequestClose}>
            {secondaryButtonText}
          </Button>
        )}
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
