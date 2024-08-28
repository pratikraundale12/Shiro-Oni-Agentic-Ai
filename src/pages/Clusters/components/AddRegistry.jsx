/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { FileIcon, PlusCircleIcon, WhiteBoradIcon } from '../../../assets';
import { KDFM } from '../../../constants';
import { Button, SelectField } from '../../../shared';
import {
  getOneRegistry,
  getRegistryList,
  testRegistry,
} from '../../../store/index1';
import { FailedTestModal } from './FailedTestModal';
import { SuccessTestModal } from './SuccessTestModal';
import { SummaryModal } from './SummaryModal';

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 90px;
`;

const ORText = styled.p`
  margin: 0;
  padding: 0 10px;
`;

const Container = styled.div`
  margin-top: 16px;
`;

const RegistryDetailsDiv = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: 20px;
  border-radius: 8px;
`;

const Title = styled.h6`
  font-family: noto sans;
  font-size: 16px;
  font-weight: 600;
  line-height: 21.79px;
  letter-spacing: -0.005em;
  margin-bottom: 20px;
  color: #4b5564;
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
  margin-bottom: 20px;

  p {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    line-height: 15.73px;
    letter-spacing: -0.005em;
    color: #2d343f;
  }

  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 14.52px;
    letter-spacing: -0.005em;
    color: #7a7a7a;
  }
`;

const CertificateAddedDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const FileSize = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #4b5564;
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
  font-size: 12px;
  font-weight: 400;
  line-height: 14.52px;
  letter-spacing: -0.005em;
  color: #7a7a7a;
`;

const FileTypeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem !important;
`;

const FileType = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #4b5564;
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

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const NoDataText = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #666;
`;

const Passphrase = styled.div`
  align-items: center !important;
  justify-content: flex-start !important;
  display: flex !important;
`;

const PFXPassphrase = styled.div`
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 15.73px;
  letter-spacing: -0.005em;
  color: var(--model-heading);
`;

const StyledButton = styled(Button)`
  border-color: ${props => props.theme.colors.darker};

  span {
    color: ${props => props.theme.colors.primary};
  }

  &:hover {
    background-color: ${props => props.theme.colors.lightGrey};
  }
`;

export const AddRegistry = ({
  setNewRegistry,
  clusterData,
  registryData,
  setRegistryData,
  setActiveTab,
  isEdit = false,
  registry_id,
  clusterId,
}) => {
  const [successTest, setSuccessTest] = useState(false);
  const [testLoader, setTestLoader] = useState(false);
  const [failedTest, setFailedTest] = useState(false);
  const [continueStatus, setContinueStatus] = useState(false);
  const { control, reset, watch } = useForm({
    defaultValues: {
      registry: registry_id || '', // or any default values you need
    },
  });
  const [registries, setRegistries] = useState([]);
  const selectedRegistryId = watch('registry');

  const [openSummary, setOpenSummary] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const fetchRegistry = async () => {
    try {
      const response = await getRegistryList();
      const names = response.data.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setRegistries(names);
    } catch (error) {
      console.error('Failed to fetch registries:', error);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  useEffect(() => {
    if (selectedRegistryId) {
      fetchRegistryDetails(selectedRegistryId);
    }
  }, [registries, selectedRegistryId]);

  const fetchRegistryDetails = async () => {
    try {
      const response = await getOneRegistry(selectedRegistryId);
      console.log(response, 'ressss');
      setRegistryData(response);
    } catch (error) {
      console.error('Failed to fetch registry details:', error);
    }
  };

  const testRegistryData = async () => {
    const payload = new FormData();
    setTestLoader(true);
    registryData?.id && payload.append('id', registryData?.id);
    payload.append('name', registryData?.name);
    payload.append('nifi_url', registryData?.registry_url);
    registryData?.password &&
      payload.append('password', registryData?.password);
    registryData?.username &&
      payload.append('username', registryData?.username) &&
      payload.append('username', registryData?.username);
    registryData?.file && payload.append('file', registryData?.file);
    registryData?.passphrase &&
      payload.append('passphrase', registryData?.passphrase);
    const response = await testRegistry(payload);
    if (response.status === 204) {
      setSuccessTest(true);
      setContinueStatus(true);
      setTestLoader(false);
    } else {
      setContinueStatus(false);
      setTestMessage(response.message);
      setFailedTest(true);
      setTestLoader(false);
    }
  };

  const handleDelete = () => {
    setRegistryData('');
    // setSelectedRegistryId('');
    reset({ registry: '' });
  };

  return (
    <>
      <ParentDiv>
        <FlexContainer>
          <SelectField
            control={control}
            name="registry"
            label={KDFM.REGISTRY_NAME}
            options={registries}
          />
          <ORText>{KDFM.SEPARATOR}</ORText>
          <button
            onClick={() => setNewRegistry(true)}
            style={{ border: 'none', background: 'none', padding: 0 }}
          >
            <StyledButton
              variant="secondary"
              // disabled={selectedRegistryId}
              icon={<PlusCircleIcon width={20} height={20} color="red" />}
            >
              {KDFM.ADD_NEW_REGISTRY}
            </StyledButton>
          </button>
        </FlexContainer>
        <Container>
          {selectedRegistryId ? (
            <RegistryDetailsDiv>
              <Title>{KDFM.REGISTRY_DETAILS}</Title>
              <Row>
                <Column size={33.33}>
                  <BoxContentArea>
                    <p>{KDFM.REGISTRY_NAME}</p>
                    <span>{registryData.name}</span>
                  </BoxContentArea>
                </Column>
                <Column size={66.66}>
                  <BoxContentArea>
                    <p>{KDFM.NIFI_CERTIFICATE}</p>
                  </BoxContentArea>
                  <CertificateAddedDiv>
                    <div>
                      <FileIcon width={25} height={35} />
                    </div>
                    <FileInfo>
                      <FileDetails>
                        <FileTypeContainer>
                          <FileType>{KDFM.PFX_FILE}</FileType>
                          <FileSize>{KDFM.PFX_FILE_SIZE}</FileSize>
                        </FileTypeContainer>
                        <FilePath>{registryData.file}</FilePath>
                      </FileDetails>
                    </FileInfo>
                  </CertificateAddedDiv>
                  <Passphrase>
                    <PFXPassphrase>{KDFM.PFX_PASSPHRASE}:</PFXPassphrase>
                    <PasswordText>***********</PasswordText>
                  </Passphrase>
                </Column>
              </Row>
              <BottomButtonDiv>
                <ButtonDiv>
                  <Button
                    variant="secondary"
                    onClick={() => setNewRegistry(true)}
                  >
                    {KDFM.EDIT}
                  </Button>
                  <Button onClick={handleDelete}>{KDFM.DELETE}</Button>
                </ButtonDiv>
              </BottomButtonDiv>
            </RegistryDetailsDiv>
          ) : (
            <NoDataContainer>
              <WhiteBoradIcon />
              <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
            </NoDataContainer>
          )}
        </Container>
        <BottomButtonDivs>
          <BtnDiv>
            <Button
              variant="secondary"
              onClick={() => {
                setActiveTab('cluster');
              }}
            >
              {KDFM.BACK}
            </Button>
            <Button
              disabled={!continueStatus}
              onClick={() => {
                setOpenSummary(true);
              }}
            >
              {KDFM.CONTINUE}
            </Button>
          </BtnDiv>
          <BtnDiv>
            <Button
              onClick={() => {
                testRegistryData();
              }}
              isLoading={testLoader}
            >
              {KDFM.TEST_CLUSTER}
            </Button>
          </BtnDiv>
        </BottomButtonDivs>
      </ParentDiv>

      <SummaryModal
        clusterData={clusterData}
        registryData={registryData}
        openSummary={openSummary}
        setOpenSummary={setOpenSummary}
        isEdit={isEdit}
        clusterId={clusterId}
        registry_id={registry_id}
      />

      <SuccessTestModal
        successTest={successTest}
        setSuccessTest={setSuccessTest}
        name="Registry"
      />

      <FailedTestModal
        failedTest={failedTest}
        setFailedTest={setFailedTest}
        testMessage={testMessage}
        activeTab="registry"
      />
    </>
  );
};

AddRegistry.propTypes = {
  setNewRegistry: PropTypes.func,
  clusterData: PropTypes.object,
  registryData: PropTypes.object,
  setRegistryData: PropTypes.func,
  setActiveTab: PropTypes.func,
  isEdit: PropTypes.bool,
  registry_id: PropTypes.string,
  clusterId: PropTypes.string,
};
