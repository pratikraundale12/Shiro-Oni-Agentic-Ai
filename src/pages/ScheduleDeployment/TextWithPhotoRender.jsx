import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TextColor = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ImageHolder = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 10px;
`;

export const TextWithPhotoRender = ({ text, content }) => {
  return (
    <>
      <div className="d-flex">
        <ImageHolder src={content?.deployer_photo_url} alt="img" />{' '}
        <TextColor>{text}</TextColor>{' '}
      </div>
    </>
  );
};
TextWithPhotoRender.propTypes = {
  text: PropTypes.string,
  content: PropTypes.object,
};
