/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Modal } from '../../../shared';
import styled from 'styled-components';
import { FileIcon, PlusCircleIcon } from '../../../assets';
import { Button, SelectField } from '../../../shared';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { getOneRegistry, getRegistryList } from '../../../utils/services';
import { SummaryModal } from './SummaryModal';
import { WhiteBoradIcon } from '../../../assets';
import { testRegistry } from '../../../utils/services';
import { RightCircleIcon, ExclamationFailedTestingIcon } from '../../../assets';

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
    margin-left: 8px;
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
  // const [selectedRegistryId, setSelectedRegistryId] = useState(
  // watch('registry')
  // );

  const [openSummary, setOpenSummary] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // const [ selectedRegistryData,setSelectedRegistryData] = useState()
  console.log(registry_id, 'reggggggggiddddddddd');
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

  console.log(registryData, 'selected');
  useEffect(() => {
    fetchRegistry();
  }, []);

  useEffect(() => {
    console.log('Updated registries:', registries);
    console.log('Selected registry:', selectedRegistryId);
    if (selectedRegistryId) {
      fetchRegistryDetails(selectedRegistryId);
    }
  }, [registries, selectedRegistryId]);

  const fetchRegistryDetails = async id => {
    try {
      const response = await getOneRegistry(selectedRegistryId);
      console.log(response, 'ressss');
      setRegistryData(response);
    } catch (error) {
      console.error('Failed to fetch registry details:', error);
    }
  };

  const testRegistryData = async () => {
    // setRegistryData({
    //   name: registryData.name,
    //   registry_url: registryData.registry_url,
    //   username: registryData?.username,
    //   password: registryData?.password,
    //   file: registryData?.file,
    //   passphrase: registryData?.passphrase,
    // })
    // console.log("datasssssss",data)
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
    console.log('RESPONSE', response);
    if (response.status === 204) {
      setSuccessTest(true);
      setContinueStatus(true);
      setTestLoader(false);

      // setClusterData(clusterFormData);
      console.log('tested');
    } else {
      setContinueStatus(false);
      setTestMessage(response.message);
      setFailedTest(true);
      setTestLoader(false);

      console.log('errorr');
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
            label="Registry Name"
            options={registries}
          />
          <ORText>OR</ORText>
          <button
            onClick={() => setNewRegistry(true)}
            style={{ border: 'none', background: 'none', padding: 0 }}
          >
            <Button variant="secondary" disabled={selectedRegistryId}>
              <PlusCircleIcon width={20} height={20} color="red" />
              Add New Registry
            </Button>
          </button>
        </FlexContainer>
        <Container>
          {selectedRegistryId ? (
            <RegistryDetailsDiv>
              <Title>Registry Details</Title>
              <Row>
                <Column size={33.33}>
                  <BoxContentArea>
                    <p>Registry Name</p>
                    <span>{registryData.name}</span>
                  </BoxContentArea>
                  <BoxContentArea>
                    <p>Registry URL</p>
                    <span>{registryData.registry_url}</span>
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
                          <FileType>PFX file</FileType>
                          <FileSize>3.7KB</FileSize>
                        </FileTypeContainer>
                        <FilePath>{registryData.file}</FilePath>
                      </FileDetails>
                    </FileInfo>
                  </CertificateAddedDiv>
                  <div className="d-flex align-items-center justify-content-start">
                    <p className="txt me-4">PFX Paraphrase:</p>
                    <PasswordText>***********</PasswordText>
                  </div>
                </Column>
              </Row>
              <BottomButtonDiv>
                <ButtonDiv>
                  <Button
                    variant="secondary"
                    onClick={() => setNewRegistry(true)}
                  >
                    Edit
                  </Button>
                  <Button onClick={handleDelete}>Delete</Button>
                </ButtonDiv>
              </BottomButtonDiv>
            </RegistryDetailsDiv>
          ) : (
            <NoDataContainer>
              <WhiteBoradIcon />
              <NoDataText>No data found</NoDataText>
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
              Back
            </Button>
            <Button
              disabled={!continueStatus}
              onClick={() => {
                setOpenSummary(true);
              }}
            >
              Continue
            </Button>
          </BtnDiv>
          <BtnDiv>
            <Button
              onClick={() => {
                testRegistryData();
              }}
              isLoading={testLoader}
            >
              Test Cluster
            </Button>
          </BtnDiv>
        </BottomButtonDivs>
      </ParentDiv>

      {/* <SummaryModal openSummary={openSummary} setOpenSummary={setOpenSummary} selectedRegistry={selectedRegistryId}/> */}
      <SummaryModal
        clusterData={clusterData}
        registryData={registryData}
        openSummary={openSummary}
        setOpenSummary={setOpenSummary}
        isEdit={isEdit}
        clusterId={clusterId}
        registry_id={registry_id}
      />

      <Modal
        title="Testing Successfull"
        isOpen={successTest}
        onRequestClose={() => setSuccessTest(false)}
        size="sm"
        // secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={() => setSuccessTest(false)}
      >
        <>
          <div className="text-center">
            <RightCircleIcon color="#0CBF59" />
          </div>
          <h5 className="pt-4 mt-2 mb-0 text-center">
            registry Test Successful
          </h5>
          <p className="pt-3 mb-0 text-center">
            Your registry Test was successful. You <br /> can now proceed to the
            next steps.
          </p>
        </>
      </Modal>

      <Modal
        title="Testing Successfull"
        isOpen={failedTest}
        onRequestClose={() => setFailedTest(false)}
        size="sm"
        primaryButtonText="Continue"
        onSubmit={() => setFailedTest(false)}
      >
        <>
          <div className="text-center">
            <ExclamationFailedTestingIcon width={90} height={65} />
          </div>
          <h5 className="pt-4 mt-2 mb-0 text-center">Cluster Test Failed</h5>
          {testMessage != '' ? (
            <p className="pt-3 mb-0 text-center">{testMessage}</p>
          ) : (
            <p className="pt-3 mb-0 text-center">
              We encountered an issue while testing your cluster. Please check
              if your File is Correct
            </p>
          )}
        </>
      </Modal>
    </>
  );
};

AddRegistry.propTypes = {
  setNewRegistry: PropTypes.func,
};
