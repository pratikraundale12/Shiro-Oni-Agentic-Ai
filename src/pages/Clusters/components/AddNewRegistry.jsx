import React from 'react';
import styled from 'styled-components';
import { InputField } from '../../../shared';
import { Button } from '../../../shared';

import {
  LinkIcons,
  SmallPerfileIcon,
  QRIcons,
  CircleExclamationMarkIcon,
  PlusCircleIcon,
  FileIcon,
  WhiteBoradIcon,
  PencilIcon,
  DeleteSmallIcon,
} from '../../../assets';

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const StyledInputField = styled(InputField)`
  flex: 1;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const CertificateContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
`;

const CertificateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CertificateDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
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
  display: flex;
  align-items: center;

  & > svg {
    margin-left: 8px;
  }
`;

const FileSize = styled.span`
  margin-left: auto;
`;

const CertificateFooter = styled.div`
  display: flex;
  align-items: center;
`;

const ParaphraseLabel = styled.div`
  margin-right: 20px;
`;

const ParaphraseValue = styled.div`
  font-family: monospace;
`;

const UploadCertificateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const CertificateMessage = styled.div`
  display: flex;
  align-items: center;
`;

const EditDeleteContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 10px;
`;

const BottomButtonDivs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px; /* Add margin top for spacing */
`;

const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ParentDiv = styled.div`
  height: 80vh; /* Adjust the height as needed */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 20px;
  background: #f5f7fa;
  padding-bottom: 60px; /* Add padding bottom to ensure buttons are not cut off */
`;

export const AddNewRegistry = () => {
  return (
    <ParentDiv>
      <InputField
        type="text"
        placeholder="Enter your Registry Name"
        name="registryName"
        id="registry-name"
        icon={<QRIcons />}
        label="Registry Name"
      />
      <InputField
        type="text"
        placeholder="Enter your NiFi URL"
        name="nifiUrl"
        id="nifiUrl"
        icon={<LinkIcons />}
        label="NifiUrl"
      />
      <InputContainer>
        <StyledInputField
          type="text"
          placeholder="Enter Your UserName"
          name="username"
          id="username"
          icon={<SmallPerfileIcon />}
          label="Username"
        />
        <StyledInputField
          type="password"
          placeholder="Enter Your Password"
          name="password"
          id="password"
          icon={<LinkIcons />}
          label="Password"
        />
        <FlexContainer>
          <p>OR</p>
          <Button
            icon={<PlusCircleIcon width={20} height={20} color="white" />}
          >
            Add Certificate
          </Button>
        </FlexContainer>
      </InputContainer>

      <CertificateContainer>
        <CertificateHeader>
          <div>
            <label
              htmlFor="first-name"
              className="mb-2 d-flex align-items-center"
            >
              NiFi Certificate
              <CircleExclamationMarkIcon />
            </label>
          </div>
        </CertificateHeader>
        <CertificateDetails>
          <FileIcon width={25} height={35} />
          <FileInfo>
            <FileDetails>
              <FileTypeContainer>
                <FileType>
                  PFX file
                  <CircleExclamationMarkIcon color="#DDE4F0" />
                </FileType>
                <FileSize>20MB</FileSize>
              </FileTypeContainer>
              <FilePath>
                /home/rahulksi184/Softwares/NIFI_Dev_Certificates/nifi-certificate
              </FilePath>
            </FileDetails>
          </FileInfo>
        </CertificateDetails>
        <CertificateFooter>
          <ParaphraseLabel>PFX Paraphrase:</ParaphraseLabel>
          <ParaphraseValue>********************</ParaphraseValue>
        </CertificateFooter>
      </CertificateContainer>

      <UploadCertificateContainer>
        <CertificateMessage>
          <WhiteBoradIcon />
          Registry Certificate Added!!
        </CertificateMessage>
        <EditDeleteContainer>
          <IconButton>
            <PencilIcon />
          </IconButton>
          <IconButton>
            <DeleteSmallIcon />
          </IconButton>
        </EditDeleteContainer>
      </UploadCertificateContainer>
      <BottomButtonDivs>
        <BtnDiv>
          <Button variant="secondary">Back</Button>
          <Button>Continue</Button>
        </BtnDiv>
        <BtnDiv>
          <Button>Test Cluster</Button>
        </BtnDiv>
      </BottomButtonDivs>
    </ParentDiv>
  );
};
