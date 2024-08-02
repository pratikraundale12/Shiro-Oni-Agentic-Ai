import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { UpArrowImageIcon, UserUploadIcon } from '../../assets';
import { toast } from 'react-toastify';

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
  right: 25px !important;
  position: absolute;
  bottom: 25px;
`;
const UploadImageInnerContainer = styled.div`
  height: 115px;
  width: 115px;
  border-radius: 50%;
  object-fit: cover;
`;
const UploadImageOuterContainer = styled.div`
  background: #f5f7fa;
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 28px;
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
          const file = event.target.files[0];
          event.target.value = null;
          if (file && validImageTypes.includes(file.type)) {
            onChange(file);
          } else {
            toast.error('Please upload a valid image file');
          }
        };

        return (
          <div style={{ position: 'relative' }}>
            <UploadLabel htmlFor="file-upload">
              {file ? (
                <UploadImageOuterContainer>
                  <PreviewImage src={getFilePreview()} alt="Profile Preview" />
                  <ArrowContainer>
                    <UpArrowImageIcon />
                  </ArrowContainer>
                </UploadImageOuterContainer>
              ) : (
                <UploadImageOuterContainer>
                  <UploadImageInnerContainer>
                    <UserUploadIcon />
                  </UploadImageInnerContainer>
                </UploadImageOuterContainer>
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
