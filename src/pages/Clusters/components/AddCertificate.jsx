import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { BagIcon, CrossIcon, FileIcon } from '../../../assets';
import { Button, InputField, Modal } from '../../../shared';
import TogglePassword from '../../../shared/FormInputs/components/PasswordField/components/TogglePassword';

const InputBox = styled.div`
  .input-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PFXContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const CertificateDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  width: 100%;
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;
const FilePath = styled.span`
  display: block;
  margin-top: 5px;
`;

const FileTypeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const FileType = styled.div`
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FileSize = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 0.4rem;

  > div {
    margin-bottom: 0;
  }

  .eye-icon {
    cursor: pointer;
  }
`;

const CertificateContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  padding: 20px 0;
  border-radius: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.darker};
  }
`;

const CertificateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
`;

const CertificateDetailsnew = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled(Button)`
  height: 36px;
  padding: 0 16px;
`;

export const AddCertificate = ({
  addCertificate,
  setAddCertificate,
  setCertificate,
  certificates,
}) => {
  const [file, setFile] = useState(certificates?.file || null);
  const [passphrase, setPassphrase] = useState(certificates?.passphrase || '');
  const [errors, setErrors] = useState({ file: '', passphrase: '' });
  const [show, setShow] = useState(false);

  const handleFileSelect = event => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.p12')) {
        setFile(selectedFile);
        setErrors(prevErrors => ({ ...prevErrors, file: '' }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          file: 'Invalid file type. Please upload a .p12 file!',
        }));
      }
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setErrors(prevErrors => ({ ...prevErrors, file: '' }));
  };

  const handlePassphraseChange = event => {
    setPassphrase(event.target.value);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      file: '',
      passphrase: '',
    };

    if (!file) {
      newErrors.file = 'PFX file is required.';
      valid = false;
    }
    if (passphrase.length < 6) {
      newErrors.passphrase = 'Passphrase must be at least 6 characters long.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const onSubmit = event => {
    event.preventDefault();
    if (validateForm()) {
      const certificateData = {
        file,
        passphrase,
      };
      setCertificate(certificateData);
      setAddCertificate(false);
    }
  };

  const togglePassword = useCallback(
    () => setShow(prevState => !prevState),
    []
  );

  return (
    <Modal
      title="Add Certificate"
      isOpen={addCertificate}
      onRequestClose={() => setAddCertificate(false)}
      size="sm"
      secondaryButtonText="Cancel"
      primaryButtonText="Continue"
      onSubmit={onSubmit}
      footerAlign="start"
      contentStyles={{ maxWidth: '34%' }}
    >
      <InputBox>
        <PFXContainer>
          <CertificateDetails>
            {/* <FileIcon width={25} height={35} />
              <div>
                <FileType>PFX file</FileType>
                <FileInfo>
                  {file ? (
                    <FileDetails>
                      <FileTypeContainer>
                        <FileSize onClick={handleFileRemove}>
                          <CrossIcon />
                        </FileSize>
                      </FileTypeContainer>
                      <FilePath>{file.name}</FilePath>
                      <svg
                        width={475}
                        height={8}
                        viewBox="0 0 475 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width={475} height={8} rx={4} fill="#38812F" />
                      </svg>
                    </FileDetails>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          document.getElementById('hiddenFileInput').click()
                        }
                      >
                        Select File
                      </Button>
                      <HiddenFileInput
                        type="file"
                        id="hiddenFileInput"
                        onChange={handleFileSelect}
                      />
                      {errors.file && (
                        <span style={{ color: 'red' }}>{errors.file}</span>
                      )}
                    </>
                  )}
                </FileInfo>
              </div> */}

            <CertificateContainer>
              <CertificateHeader>NiFi Certificate</CertificateHeader>
              <CertificateDetailsnew>
                <FileIcon width={50} height={50} />
                <FileInfo>
                  <FileDetails>
                    {file ? (
                      <>
                        <FileTypeContainer>
                          <FileType>PFX file</FileType>
                          <FileSize onClick={handleFileRemove}>
                            <CrossIcon />
                          </FileSize>
                        </FileTypeContainer>

                        <FilePath>
                          {file?.name ||
                            certificates?.file?.name ||
                            certificates?.file}
                        </FilePath>

                        <svg
                          width="100%"
                          height={8}
                          viewBox="0 0 475 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width={475} height={8} rx={4} fill="#38812F" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <FileTypeContainer>
                          <FileType>PFX file</FileType>
                        </FileTypeContainer>

                        <StyledButton
                          variant="secondary"
                          onClick={() =>
                            document.getElementById('hiddenFileInput').click()
                          }
                        >
                          Select File
                        </StyledButton>
                        <HiddenFileInput
                          type="file"
                          id="hiddenFileInput"
                          onChange={handleFileSelect}
                        />
                      </>
                    )}
                    {errors.file && (
                      <span style={{ color: 'red' }}>{errors.file}</span>
                    )}
                    {/* {file && (
                        <FilePath>
                          {certificates?.file.name || certificates?.file}
                        </FilePath>
                      )} */}
                  </FileDetails>
                </FileInfo>
              </CertificateDetailsnew>
            </CertificateContainer>
          </CertificateDetails>
        </PFXContainer>

        <Wrapper>
          <InputField
            name="passphrase"
            type={show ? 'text' : 'password'}
            icon={<BagIcon />}
            placeholder="Enter Your Password"
            rightIcon={<TogglePassword show={show} onToggle={togglePassword} />}
            value={passphrase}
            onChange={handlePassphraseChange}
          />
          {errors.passphrase && (
            <span style={{ color: 'red' }}>{errors.passphrase}</span>
          )}
        </Wrapper>
      </InputBox>
    </Modal>
  );
};

AddCertificate.propTypes = {
  addCertificate: PropTypes.bool.isRequired,
  setAddCertificate: PropTypes.func.isRequired,
  certificates: PropTypes.object.isRequired,
  setCertificate: PropTypes.func.isRequired,
};
