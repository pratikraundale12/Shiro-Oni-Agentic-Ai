import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { CrossIcon, UpArrowImageIcon, UserUploadIcon } from '../../assets';
import { toast } from 'react-toastify';

const PreviewImage = styled.img`
  width: 115px;
  height: 115px;
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
const RemoveImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  margin-top: 5px;
  top: 0;
  right: 0;
  cursor: pointer;
`;

export const ProfileUpload = ({ name, control, watch, url, setValue }) => {
  const file = watch(name);

  const removeUploadedImage = () => {
    setValue(name, null);
  };

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
          const validImageTypes = ['image/jpeg', 'image/png'];
          const file = event.target.files[0];
          event.target.value = null;
          if (file && validImageTypes.includes(file.type)) {
            onChange(file);
          } else {
            toast.error('Please upload a valid image');
          }
        };

        return (
          <div style={{ position: 'relative' }}>
            <UploadLabel htmlFor="file-upload">
              {file ? (
                <>
                  <UploadImageOuterContainer>
                    <PreviewImage
                      src={getFilePreview()}
                      alt="Profile Preview"
                    />
                    <ArrowContainer>
                      <UpArrowImageIcon />
                    </ArrowContainer>
                  </UploadImageOuterContainer>
                </>
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
            />{' '}
            {file && (
              <RemoveImage onClick={removeUploadedImage}>
                Remove Photo &nbsp;
                <CrossIcon />
              </RemoveImage>
            )}
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
