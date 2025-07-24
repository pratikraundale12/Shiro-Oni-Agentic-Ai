import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { CrossIcon, FileIcon } from '../../assets';
import { getFileSize } from '../../helpers';
import { Button, Modal, SvgButton } from '../../shared';

const StyledButton = styled(Button)`
  height: 36px;
  padding: 0 15px;
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

const FileLabel = styled.span``;

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
  data,
  setIsCertificateOpen,
}) => {
  const ref = useRef();
  const file = watch(name);
  const [showModal, setShowModal] = useState(false);
  console.log(data, 'data');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => {
        const handleChange = event => {
          const uploadedFile = event.target.files[0];
          if (uploadedFile?.type !== 'application/x-pkcs12') {
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

        // New: handle upload button click
        const handleUploadClick = () => {
          if (
            !isEmpty(
              data?.service_account_certificate_password &&
                data?.service_account_certificate
            )
          ) {
            setShowModal(true); // Only open confirmation modal
          } else {
            ref.current.click();
          }
        };

        // New: handle modal actions
        const handleModalConfirm = () => {
          setShowModal(false);
          setIsCertificateOpen(true); // Close parent modal only after confirmation
          ref.current.click();
        };
        const handleModalCancel = () => {
          setShowModal(false);
          setIsCertificateOpen(true);
        };

        return (
          <div>
            <FileWrapper>
              <FileIcon width={48} height={48} />
              <FileDetailsContainer>
                <FlexBetween>
                  <FileLabel></FileLabel>
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
                    onClick={handleUploadClick}
                    type="button"
                  >
                    Certificate file
                  </StyledButton>
                )}
              </FileDetailsContainer>
            </FileWrapper>
            <input
              ref={ref}
              type="file"
              accept=".p12"
              onChange={handleChange}
              hidden
            />
            {error && <ErrorText>{error.message}</ErrorText>}
            {/* Confirmation Modal using shared Modal component */}
            <Modal
              title="Replace Certificate"
              isOpen={showModal}
              onRequestClose={handleModalCancel}
              size="sm"
              secondaryButtonText="Cancel"
              primaryButtonText="Replace"
              onSubmit={handleModalConfirm}
              onSecondaryButtonClick={handleModalCancel}
              footerAlign="start"
              contentStyles={{ maxWidth: '30%', maxHeight: '50%' }}
            >
              <div style={{ marginBottom: 16 }}>
                A certificate is already uploaded. Do you want to replace it
                with a new one?
              </div>
            </Modal>
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
  data: PropTypes.any, // Add validation for 'data' prop
  setIsCertificateOpen: PropTypes.func,
  isCertificateOpen: PropTypes.bool,
};
