import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { CrossIcon, FileIcon } from '../../assets';
import { getFileSize } from '../../helpers';
import { Button, SvgButton } from '../../shared';

const StyledButton = styled(Button)`
  height: 36px;
  padding: 0 20px;
  margin-top: 4px;
  border-radius: 4px;
  max-width: 130px;
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }
`;

const FileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const FileDetailsContainer = styled.div`
  width: 100%;
  margin-left: 10px;
`;

const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileLabel = styled.span`
  color: ${props => props.theme.colors.darker};
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
`;

const Progress = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.darkSuccess};
  margin-top: 6px;
`;

const StyleFile = styled.span`
  font-size: 12px;
  font-weight: 400;
`;

const RemoveButton = styled(SvgButton)`
  width: 14px;
  height: 14px;
`;

const ErrorText = styled.span`
  margin-top: 2px;
  margin-left: 2px;
  color: #ff0000;
  font-weight: 500;
  font-size: 10px;
  display: block;
`;

export const UploadFile = ({
  name,
  control,
  watch,
  fileLable = 'PFX File',
}) => {
  const ref = useRef();
  const file = watch(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => {
        const handleChange = event => {
          const uploadedFile = event.target.files[0];

          const validTypes = [
            'application/x-pkcs12',
            'application/x-x509-ca-cert',
            'text/plain',
          ];

          const validExtensions = ['.p12', '.pfx', '.pem'];

          const fileExtension = uploadedFile?.name
            ?.substring(uploadedFile.name.lastIndexOf('.'))
            ?.toLowerCase();

          const isValidType =
            validTypes.includes(uploadedFile?.type) ||
            validExtensions.includes(fileExtension);

          if (!isValidType) {
            toast.error('Invalid file type');
          } else {
            onChange(uploadedFile);
          }
        };

        const handleRemove = () => {
          onChange(null);
          if (ref.current) {
            ref.current.value = '';
          }
        };

        return (
          <div>
            <FileWrapper>
              <FileIcon width={48} height={48} />
              <FileDetailsContainer>
                <FlexBetween>
                  <FileLabel>{fileLable}</FileLabel>
                  {file && (
                    <RemoveButton onClick={handleRemove} icon={<CrossIcon />} />
                  )}
                </FlexBetween>
                {file && (
                  <FlexBetween>
                    <StyleFile>{file?.name}</StyleFile>
                    <StyleFile>{getFileSize(file?.size)}</StyleFile>
                  </FlexBetween>
                )}
                {file ? (
                  <Progress />
                ) : (
                  <StyledButton
                    variant="secondary"
                    onClick={() => ref.current.click()}
                    type="button"
                  >
                    Select file
                  </StyledButton>
                )}
              </FileDetailsContainer>
            </FileWrapper>
            <input
              ref={ref}
              type="file"
              accept=".p12, .pfx, .pem"
              onChange={handleChange}
              hidden
            />
            {error && <ErrorText>{error.message}</ErrorText>}
          </div>
        );
      }}
    />
  );
};

UploadFile.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  fileLable: PropTypes.string,
};
