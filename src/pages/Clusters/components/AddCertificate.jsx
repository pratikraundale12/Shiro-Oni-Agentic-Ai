/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, PasswordField } from '../../../shared';
import { CrossIcon, KeyIcons } from '../../../assets';
import { Modal } from '../../../shared';

// Define your styled components here

const InputBox = styled.div`
  .input-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FileIcon = styled.svg`
  width: 50px;
  height: 50px;
  fill: none;
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
  align-items: flex-start;
  width: 100%;
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
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FileSize = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const RemoveIcon = styled.svg`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// Define validation schema with yup
const schema = yup.object().shape({
  file: yup
    .mixed()
    .required('File is required')
    .test('fileExtension', 'File must be of type .p12', value => {
      return value && value.name.endsWith('.p12');
    }),
  passphrase: yup
    .string()
    .required('Passphrase is required')
    .min(0, 'Passphrase can be empty') // Allows empty passphrase, adjust if necessary
    .max(50, 'Passphrase is too long'), // Optional maximum length
});
export const AddCertificate = ({
  addCertificate,
  setAddCertificate,
  setCertificate,
  certificates,
}) => {
  const [file, setFile] = useState(certificates?.file || null);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: certificates,
  });

  const handleFileSelect = event => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile({
        name: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + 'MB',
        path: selectedFile.path,
      });
      setValue('file', selectedFile);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setValue('file', null);
  };

  const onSubmit = data => {
    console.log('certificate', data);
    const certificateData = {
      file: data.file,
      passphrase: data.passphrase,
    };
    setCertificate({
      file: data.file,
      passphrase: data.passphrase,
    });
    setAddCertificate(false);
    console.log('certificate', certificateData);
    // Add your logic to handle the form submission
  };

  return (
    <Modal
      title="Add Certificate"
      isOpen={addCertificate}
      onRequestClose={() => setAddCertificate(false)}
      size="sm"
      secondaryButtonText="Cancel"
      primaryButtonText="Continue"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputBox>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-box">
            <div className="d-flex">
              <FileIcon
                className="file-icon"
                width="50"
                height="50"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.4401 6.25H18.7493C14.821 6.25 12.8568 6.25 11.6364 7.47039C10.416 8.69078 10.416 10.655 10.416 14.5833V35.4167C10.416 39.345 10.416 41.3092 11.6364 42.5296C12.8568 43.75 14.821 43.75 18.7493 43.75H31.2494C35.1777 43.75 37.1419 43.75 38.3623 42.5296C39.5827 41.3092 39.5827 39.345 39.5827 35.4167V18.3926C39.5827 17.541 39.5827 17.1152 39.4241 16.7324C39.2655 16.3495 38.9644 16.0484 38.3623 15.4463L30.3864 7.47039C29.7843 6.86824 29.4832 6.56717 29.1003 6.40858C28.7175 6.25 28.2917 6.25 27.4401 6.25Z"
                  stroke="#33363F"
                  strokeWidth="2"
                />
                <path
                  d="M27.084 6.25V14.5833C27.084 16.5475 27.084 17.5296 27.6942 18.1398C28.3044 18.75 29.2865 18.75 31.2507 18.75H39.584"
                  stroke="#33363F"
                  strokeWidth="2"
                />
              </FileIcon>
              <PFXContainer>
                <CertificateDetails>
                  <FileIcon width={25} height={35} />
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
                            <rect
                              width={475}
                              height={8}
                              rx={4}
                              fill="#38812F"
                            />
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
                            register={register}
                            onChange={handleFileSelect}
                            errors={errors}
                          />
                          {errors.file && (
                            <span style={{ color: 'red' }}>
                              {errors.file.message}
                            </span>
                          )}
                        </>
                      )}
                    </FileInfo>
                  </div>
                </CertificateDetails>
              </PFXContainer>
            </div>
          </div>
          {/* <InputField
            type="text"
            placeholder="Enter your Passphrase"
            name="passphrase"
            icon={<KeyIcons />}
            register={register}
            errors={errors.passphrase}
            // required={true}
          /> */}
          <PasswordField
            name="passphrase"
            register={register}
            errors={errors.passphrase}
            watch={watch}
            required="Password is required"
            label="Password"
            helperText="Must be 8 characters at least"
          />
        </form>
      </InputBox>
    </Modal>
  );
};
