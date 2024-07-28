import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ProfileIcon } from '../../../assets';

const ImageContainer = styled.div`
  border-radius: 100%;
  min-height: 50px;
  height: 50px;
  max-height: 50px;
  min-width: 50px;
  width: 50px;
  max-width: 50px;
  object-fit: contain;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  object-fit: contain;
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;

export const ProfileRender = ({ url }) => (
  <ImageContainer>
    {url ? (
      <ProfileImage src={url} alt="profile" width={40} height={40} />
    ) : (
      <ProfileIcon width={40} height={40} />
    )}
  </ImageContainer>
);

ProfileRender.propTypes = {
  url: PropTypes.string.isRequired,
};
