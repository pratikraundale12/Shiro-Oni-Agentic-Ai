import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ProfileIcon } from '../../../assets';

const ImageContainer = styled.div`
  border-radius: 100%;
  max-height: 40px;
  max-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  object-fit: cover;
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;

const checkImageExists = url => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const ProfileRender = ({ url }) => {
  const [isValidImage, setIsValidImage] = useState(false);

  useEffect(() => {
    if (`${process.env.REACT_APP_API_URL}${url}`) {
      checkImageExists(`${process.env.REACT_APP_API_URL}${url}`).then(exists =>
        setIsValidImage(exists)
      );
    } else {
      setIsValidImage(false);
    }
  }, [url]);

  return (
    <ImageContainer>
      {isValidImage ? (
        <ProfileImage
          src={`${process.env.REACT_APP_API_URL}${url}`}
          alt="profile"
        />
      ) : (
        <ProfileIcon width={40} height={40} />
      )}
    </ImageContainer>
  );
};

ProfileRender.propTypes = {
  url: PropTypes.string,
};
