import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Modal } from './Modal';

const IconWrapper = styled.div`
  text-align: center;
`;

const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;

const SecondaryText = styled.p`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

export const ModalWithIcon = ({
  icon,
  primaryText = '',
  secondaryText = '',
  ...rest
}) => (
  <Modal size="sm" {...rest}>
    <IconWrapper>{icon}</IconWrapper>
    <PrimaryText>{primaryText}</PrimaryText>
    <SecondaryText>{secondaryText}</SecondaryText>
  </Modal>
);

ModalWithIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
};
