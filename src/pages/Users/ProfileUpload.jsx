import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { UpArrowImageIcon, UserUploadIcon } from '../../assets';

const PreviewImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
`;

const UploadLabel = styled.label`
  cursor: pointer;
`;

const UploadInput = styled.input`
  display: none;
`;
const ArrowContainer = styled.div`
  right: 10px !important;
  position: absolute;
  bottom: 10px;
`;

export const ProfileUpload = ({ name, control, watch, url }) => {
  const file = watch(name);

  const getFilePreview = () =>
    file && file.size > 0 ? URL.createObjectURL(file) : url;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={{ required: !url }}
      render={({ field: { onChange } }) => {
        const handlePhotoUpload = event => {
          const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (
            event.target.files[0] &&
            validImageTypes.includes(event.target.files[0].type)
          ) {
            onChange(event.target.files[0]);
          }
        };
        return (
          <div style={{ position: 'relative' }}>
            <UploadLabel htmlFor="file-upload">
              {file ? (
                <div>
                  <PreviewImage src={getFilePreview()} alt="Profile Preview" />
                  <ArrowContainer>
                    <UpArrowImageIcon />
                  </ArrowContainer>
                </div>
              ) : (
                <UserUploadIcon />
              )}
            </UploadLabel>
            <UploadInput
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={event => handlePhotoUpload(event)}
            />
          </div>
        );
      }}
    />
  );
};

ProfileUpload.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  url: PropTypes.string,
  errors: PropTypes.object.isRequired,
};
