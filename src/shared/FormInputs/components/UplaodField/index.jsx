import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { hasError } from '../../../../helpers';
import { CrossIcon } from '../../../../assets';
import defaultLogo from '../../../../assets/images/default-logo.png';
import defaultFavicon from '../../../../assets/images/default-favicon.ico';

const Container = styled.div`
  margin-bottom: 1.4rem;

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    color: ${props => props.theme.colors.darker};
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }

  .wrapper {
    position: relative;
    margin-top: 10px;
  }

  &.error {
    input {
      border-color: ${props => props.theme.colors.error} !important;
    }
  }

  .icon-placeholder {
    position: absolute;
    top: 2px;
    left: 2px;
    bottom: 2px;
    z-index: 1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.lightGrey};
  }

  input {
    width: 100%;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    background-color: ${props => props.theme.colors.white};
    padding: 16px 32px 16px 56px;
    font-size: 14px;
    color: ${props => props.theme.colors.darker};
    font-family: ${props => props.theme.fontNato};
    &::placeholder {
      color: ${props => props.theme.colors.grey};
      font-family: ${props => props.theme.fontNato};
      font-size: 14px;
    }
    &:focus-visible {
      outline: none;
    }
    &:focus {
      border: 1px solid ${props => props.theme.colors.darker};
    }
    &:disabled {
      background: ${props => props.theme.colors.darkGrey3};
      cursor: not-allowed;
    }
  }

  .icon {
    position: absolute;
    top: 14px;
    right: 10px;
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
  }

  .image-preview {
    margin-top: 10px;
    max-width: 250px;
    max-height: 200px;
    border-radius: 8px;
    position: relative;
  }

  .remove-icon {
    position: absolute;
    top: -5px;
    right: -5px;
    color: ${props => props.theme.colors.white};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
  }

  .error-text {
    color: ${props => props.theme.colors.error};
    margin-top: 10px;
  }
`;

const UploadField = ({
  name,
  errors = {},
  label,
  icon = null,
  rightIcon = null,
  required = false,
  control,
  image,
  setValue,
  onKeyDown,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [isShowRemoveImageIcon, setIsShowRemoveImageIcon] = useState(true);
  const error = hasError(errors, name);

  const handleRemoveImage = () => {
    setValue(name, null);
    const input = document.querySelector(`#file-upload-${name}`);
    if (input) {
      input.value = null;
    }
    const defaultImage = name === 'logo' ? defaultLogo : defaultFavicon;
    setImageSrc(defaultImage);
    setFileName(getFileNameFromUrl(defaultImage));
    setIsShowRemoveImageIcon(false);
    if (control && control.setValue) {
      control.setValue(name, null);
    }
  };

  useEffect(() => {
    if (image) {
      if (image instanceof Blob) {
        const objectURL = URL.createObjectURL(image);
        setImageSrc(objectURL);
        setFileName(`uploaded-${Date.now()}`);
      } else {
        setImageSrc(image);
        setFileName(getFileNameFromUrl(image));
      }
      setIsShowRemoveImageIcon(true);
    } else {
      const defaultImage = name === 'logo' ? defaultLogo : defaultFavicon;
      setImageSrc(defaultImage);
      setFileName(getFileNameFromUrl(defaultImage));
      setIsShowRemoveImageIcon(false);
    }
  }, [image, name]);

  const getFileNameFromUrl = url => {
    const convertedFileName = url.replace(/\.[a-f0-9]{8,}\./, '.');
    return convertedFileName.substring(url.lastIndexOf('/') + 1);
  };

  // Default onKeyDown behavior
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={{ required }}
      render={({ field: { onChange } }) => {
        const handlePhotoUpload = event => {
          const file = event.target.files[0];
          if (file) {
            if (file.size > MAX_FILE_SIZE) {
              toast.error('File size must be less than 2MB');
              return;
            }
            if (
              name === 'favicon' &&
              file.type !== 'image/x-icon' &&
              file.type !== 'image/vnd.microsoft.icon'
            ) {
              toast.error('Please upload a valid favicon file (.ico)');
              // setFileError('Invalid file type for favicon');
              return;
            } else if (
              name === 'logo' &&
              !['image/jpeg', 'image/png', 'image/jpg'].includes(
                file.type
              )
            ) {
              toast.error('Please upload a valid image file (jpg, png, jpeg)');
              // setFileError('Invalid file type for logo');
              return;
            }

            const objectURL = URL.createObjectURL(file);
            setImageSrc(objectURL);
            setFileName(file.name);
            setIsShowRemoveImageIcon(true);
            onChange(file);
            setFileError('');
          } else {
            toast.error('Please upload a valid image');
            // setFileError('Invalid file type');
          }
        };

        return (
          <Container className={classNames({ error })}>
            {label && (
              <label>
                {label}
                {required && <span className="required">&nbsp;*</span>}
              </label>
            )}
            <div className="wrapper">
              <span className="icon-placeholder">{icon}</span>
              <input
                name={name}
                aria-invalid={error}
                value={fileName}
                readOnly
                onKeyDown={handleKeyDown}
                {...props}
              />
              {rightIcon && (
                <>
                  <label htmlFor={`file-upload-${name}`} className="icon">
                    {rightIcon}
                  </label>
                  <input
                    id={`file-upload-${name}`}
                    type="file"
                    accept="image/*, .ico,image/x-icon,image/vnd.microsoft.icon"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </>
              )}
            </div>
            {imageSrc && (
              <div
                className="image-preview"
                style={{
                  width: name === 'logo' ? '250px' : '60px',
                  marginTop: '20px',
                }}
              >
                <img
                  src={imageSrc}
                  alt="Uploaded Preview"
                  width={name === 'logo' ? 200 : 30}
                  height={name === 'logo' ? 200 : 30}
                />
                {isShowRemoveImageIcon && (
                  <button className="remove-icon" onClick={handleRemoveImage}>
                    <CrossIcon
                      height={name === 'logo' ? 24 : 14}
                      width={name === 'logo' ? 24 : 14}
                    />
                  </button>
                )}
              </div>
            )}
            {fileError && <div className="error-text">{fileError}</div>}
          </Container>
        );
      }}
    />
  );
};

UploadField.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  register: PropTypes.func,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  rightIcon: PropTypes.node,
  type: PropTypes.string,
  errors: PropTypes.shape({}),
  required: PropTypes.bool,
  registerOptions: PropTypes.shape({}),
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default UploadField;
