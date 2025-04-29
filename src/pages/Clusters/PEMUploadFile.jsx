/* eslint-disable */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CrossIcon, CurvedFolderIcon } from '../../assets';

const Container = styled.div`
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
    color: ${props => props.theme.colors.darker};
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

  .select-file {
    position: absolute;
    top: 11px;
    right: 10px;
    color: #ff7a00;
    cursor: pointer;
  }

  .file-info {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .file-name {
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.colors.darker};
  }

  .file-size {
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.colors.grey};
  }

  .remove-icon {
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-text {
    color: ${props => props.theme.colors.error};
    margin-top: 10px;
    font-size: 10px;
    font-weight: 500;
  }

  .file-actions {
    position: absolute;
    top: 19px;
    right: 10px;
    display: flex;
    align-items: center;
  }

  .remove-button {
    cursor: pointer;
    color: ${props => props.theme.colors.error || '#FF0000'};
    background: none;
    border: none;
    padding: 0;
    display: flex;
  }
`;

const PemUploadField = ({
  name,
  errors = {},
  label = 'PEM File',
  icon = <CurvedFolderIcon width={20} height={20} />,
  rightIcon = null,
  required = false,
  control,
  setValue,
  onKeyDown,
  placeholder = 'Upload PEM file',
  validExtensionsArray = ['.pem', '.pfx', '.p12'],
  acceptString = '.pem,.pfx,.p12',
  errorText = 'PEM or PFX',
  ...props
}) => {
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleClickInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = onChange => {
    setFileName('');
    setFileError('');
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (setValue) {
      setValue(name, null);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={{ required }}
      render={({ field: { onChange } }) => {
        const handleFileUpload = event => {
          const file = event.target.files[0];
          if (file) {
            const validExtensions = validExtensionsArray;
            const fileExtension = file.name
              .substring(file.name.lastIndexOf('.'))
              .toLowerCase();

            if (!validExtensions.includes(fileExtension)) {
              setFileError(`Please upload a valid ${errorText} file`);
              toast.error(`Please upload a valid ${errorText}  file`);
              return;
            }

            setFileName(file.name);
            setFileError('');
            onChange(file);
          }
        };

        return (
          <Container className={errors[name] ? 'error' : ''}>
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
                aria-invalid={!!errors[name]}
                placeholder={placeholder}
                value={fileName || ''}
                readOnly
                onKeyDown={handleKeyDown}
                {...props}
              />
              {fileName ? (
                <div className="file-actions">
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveFile(onChange)}
                    title="Remove file"
                  >
                    <CrossIcon width={16} height={16} />
                  </button>
                </div>
              ) : (
                <span className="select-file" onClick={handleClickInput}>
                  {rightIcon}
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptString}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
            {(fileError || errors[name]) && (
              <div className="error-text">
                {fileError || errors[name]?.message}
              </div>
            )}
          </Container>
        );
      }}
    />
  );
};

PemUploadField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  rightIcon: PropTypes.node,
  errors: PropTypes.object,
  required: PropTypes.bool,
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default PemUploadField;
