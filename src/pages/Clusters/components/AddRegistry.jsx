import React from 'react';
import styled from 'styled-components';
import { FileIcon, PlusCircleIcon } from '../../../assets';
import { Button, SelectField } from '../../../shared';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribute space evenly */
  gap: 90px; /* Adjust the value as needed */
`;

const ORText = styled.p`
  margin: 0;
  padding: 0 10px;
`;

const Container = styled.div`
  margin-top: 16px;
`;

const RegistryDetailsDiv = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const Title = styled.p`
  margin-bottom: 20px;
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`;

const Column = styled.div`
  flex: ${props => (props.size ? `0 0 ${props.size}%` : '0 0 100%')};
  max-width: ${props => (props.size ? `${props.size}%` : '100%')};
  padding-right: 15px;
  padding-left: 15px;
`;

const BoxContentArea = styled.div`
  margin-bottom: 15px;

  p {
    margin-bottom: 5px;
    font-weight: 500;
  }

  span {
    display: block;
  }
`;

const CertificateAddedDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const FileSize = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const PasswordText = styled.div`
  margin-left: 16px;
`;

const BottomButtonDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  font-weight: 500;

  & > svg {
    margin-left: 8px; /* Adjust the margin value as needed */
  }
`;

const BottomButtonDivs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

const BtnDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ParentDiv = styled.div`
  padding: 20px;
  background: #f5f7fa;
`;

export const AddRegistry = ({ setNewRegistry }) => {
  const { control } = useForm();
  return (
    <ParentDiv>
      <FlexContainer>
        <SelectField control={control} label="Registry Name" />

        <ORText>OR</ORText>
        <div
          onClick={() => {
            setNewRegistry(true);
          }}
        >
          <Button
            variant="secondary"
            //  size="large"
          >
            <PlusCircleIcon width={20} height={20} color="red" />
            Add New Registry
          </Button>
        </div>
      </FlexContainer>
      <Container>
        <RegistryDetailsDiv>
          <Title>Registry Details</Title>
          <Row>
            <Column size={33.33}>
              <BoxContentArea>
                <p>Registry Name</p>
                <span>DevNiFi</span>
              </BoxContentArea>
              <BoxContentArea>
                <p>Registry URL</p>
                <span>URL: https://172.31.47.210/9443</span>
              </BoxContentArea>
              <BoxContentArea>
                <p>Username</p>
                <span>N/A</span>
              </BoxContentArea>
              <BoxContentArea>
                <p>Password</p>
                <span>N/A</span>
              </BoxContentArea>
            </Column>
            <Column size={66.66}>
              <BoxContentArea>
                <p>Nifi Certificate</p>
              </BoxContentArea>
              <CertificateAddedDiv>
                <div>
                  <FileIcon width={25} height={35} />
                </div>
                <FileInfo>
                  <FileDetails>
                    <FileTypeContainer>
                      <FileType>
                        PFX file
                        {/* <CircleExclamationMarkIcon color='#DDE4F0' /> */}
                      </FileType>
                      <FileSize>20MB</FileSize>
                    </FileTypeContainer>
                    <FilePath>
                      /home/rahulksi184/Softwares/NIFI_Dev_Certificates/nifi-certificate
                    </FilePath>
                  </FileDetails>
                </FileInfo>
              </CertificateAddedDiv>
              <div className="d-flex align-items-center justify-content-start">
                <p className="txt me-4">PFX Paraphrase:</p>
                <PasswordText>********************</PasswordText>
              </div>
            </Column>
          </Row>
          <BottomButtonDiv>
            <ButtonDiv>
              <Button variant="secondary">Edit</Button>
              <Button>Delete</Button>
            </ButtonDiv>
          </BottomButtonDiv>
        </RegistryDetailsDiv>
      </Container>
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

AddRegistry.propTypes = {
  setNewRegistry: PropTypes.func,
};

