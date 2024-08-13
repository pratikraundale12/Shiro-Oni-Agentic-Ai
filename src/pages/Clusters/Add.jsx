import React, { useEffect, useState } from 'react';
// import { isEmpty } from 'lodash';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NoDataIcon, PlusCircleIcon, WhiteBoradIcon } from '../../assets';
import { Title } from './components/Title';
import { Button, InputField, SelectField } from '../../shared';
import { useForm } from 'react-hook-form';
import { LinkIcon, QRIcons } from '../../assets';
import { Certificate } from './components/Certificate';
import { Creditionals } from './components/Creditionals';
import { useLocation } from 'react-router-dom';
import { RegexConst } from '../../constants';
import { SummaryModal } from './components/SummaryModal';
import { SuccessTestModal } from './components/SuccessTestModal';
import { FailedTestModal } from './components/FailedTestModal';
import { history } from '../../helpers/history';
import {
  testCluster,
  testRegistry,
  getOneRegistry,
  getRegistryList,
} from '../../store/apis';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 88%;
`;

const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 94%;
`;

const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
`;

const NavButton = styled.button`
  border: 0;
  background: none;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontNato};
  color: ${props =>
    props.active ? props.theme.colors.error : props.theme.colors.darkGrey2};
  cursor: auto;
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active && `border-bottom: 1px solid ${props.theme.colors.error};`}
`;

const Flex = styled.div`
  display: flex;
  gap: 2rem;
`;

const FlexTwo = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  padding: 2rem;
`;

const ORText = styled.div`
  color: #7a7a9d;
  font-weight: 500;
  font-size: 20px;
  margin-top: 20px;
  line-height: 26px;
  margin-top: 32px;
`;

const ButtonLabel = styled.h6`
  margin-bottom: 10px;
  color: #425466;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  margin-top: 15px;
`;

const UploadCertificateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-top: 150px;
  margin-left: 20px;
  margin-right: 20px;
  height: 95px;
`;

const CertificateMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const TextTest = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  color: #444445;
  line-height: 27.24px;
`;

const StyledButton = styled(Button)`
  height: 70px;
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.darkGrey2}; /* Optional: Remove this line if you want a fully transparent button */
  background-color: transparent;
  color: ${props =>
    props.theme.colors.primary}; /* Set this to the desired text color */
  font-size: 20px;

  &:hover {
    background-color: transparent;
    color: ${props => props.theme.colors.primaryActive};
  }
  span {
    font-size: 20px;
    font-weight: 500;
    line-height: 27.24px;
    font-family: ${props => props.theme.fontNato};
  }
`;

const RegistryDetailsDiv = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: 25px;
  border-radius: 8px;
  margin-top: 110px;
`;

const TitleRegistry = styled.h6`
  font-family: noto sans;
  font-size: 16px;
  font-weight: 600;
  line-height: 21.79px;
  letter-spacing: -0.005em;
  margin-bottom: 20px;
  color: #4b5564;
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

const RegistryDetailsDivTwo = styled.div`
  padding-left: -4px;
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

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  margin: 80px;
`;

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const ClusterSchema = yup.object().shape({
  clusterName: yup
    .string()
    .matches(RegexConst.NAME, 'Cluster Name must be at least 3 characters long')
    .required('Cluster Name is required'),
  nifiUrl: yup
    .string()
    .matches(RegexConst.NIFI_URL, 'Enter a valid URL')
    .required('NiFi URL is required'),
});

const RegistrySchema = yup.object().shape({
  registryName: yup
    .string()
    .matches(
      RegexConst.NAME,
      'Registry Name must be at least 3 characters long'
    )
    .required('Registry Name is required'),
  registryUrl: yup
    .string()
    .matches(RegexConst.NIFI_URL, 'Enter a valid URL')
    .required('NiFi URL is required'),
});

const TABS = {
  CLUSTER: 'cluster',
  REGISTRY: 'registry',
};

export const Add = () => {
  const [activeTab, setActiveTab] = useState(TABS.CLUSTER);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCredOpen, setIsCredOpen] = useState(false);
  // const [clusterTest, setClusterTest] = useState(false);
  const [test, setTest] = useState(true);
  const [suceessModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [newRegistry, setNewRegistry] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [dataFill, setDataFill] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [failedTestMessage, setFailedTestMessage] = useState('');
  const location = useLocation();
  const data = location.state || {};
  const [clusterData, setClusterData] = useState({
    clusterName: data?.name || '',
    nifiUrl: data?.nifi_url || '',
  });
  const [registryData, setRegistryData] = useState({
    registryName: '',
    registryUrl: '',
  });
  const [clusterId, setClusterId] = useState(data?.id);

  const {
    control,
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      activeTab === TABS.CLUSTER ? ClusterSchema : RegistrySchema
    ),
  });

  const [registries, setRegistries] = useState([]);
  const selectedRegistryId = watch('registry');
  console.log(data, 'ed');
  const handleBack = () => {
    setIsCertificateOpen(false);
    setIsCredOpen(false);
    setTestSuccess(false);
    setDataFill(false);

    setTest(true);
    if (activeTab === TABS.REGISTRY && newRegistry) {
      setActiveTab(TABS.REGISTRY);
      setNewRegistry(false);
    } else if (activeTab === TABS.CLUSTER) {
      history.push('/clusters');
    } else {
      setActiveTab(TABS.CLUSTER);
    }
  };

  const onSubmit = data => {
    console.log(data, 'DATAAAaaaaaaaaa');
    setClusterData({
      clusterName: data.clusterName,
      nifiUrl: data.nifiUrl,
    });
    setRegistryData({
      registryName: data.registryName,
      registryUrl: data.registryUrl,
    });
    setIsCertificateOpen(false);
    setIsCredOpen(false);
    setTestSuccess(false);
    setDataFill(false);

    setTest(true);
    if (activeTab === TABS.CLUSTER) {
      setActiveTab(TABS.REGISTRY);
    } else if (activeTab === TABS.REGISTRY) {
      setOpenSummary(true);
    }
  };

  const watchedFields = watch([
    'clusterName',
    'nifiUrl',
    'registryName',
    'registryUrl',
  ]);

  useEffect(() => {
    const [clusterName, nifiUrl, registryName, registryUrl] = watchedFields;

    if (activeTab === 'cluster') {
      if (
        clusterName !== clusterData.clusterName ||
        nifiUrl !== clusterData.nifiUrl
      ) {
        setClusterData({
          clusterName: clusterName || '',
          nifiUrl: nifiUrl || '',
        });
      }
    } else if (newRegistry && activeTab === 'registry' && !data?.id) {
      if (
        registryName !== registryData?.registryName ||
        registryUrl !== registryData?.registryUrl
      ) {
        console.log(registryName, registryUrl, 'dataaaare');
        setRegistryData({
          registryName: registryName || '',
          registryUrl: registryUrl || '',
        });
      }
    }

    if (
      (clusterName && nifiUrl && activeTab === 'cluster') ||
      (registryName && registryUrl && activeTab === 'registry')
    ) {
      setDataFill(true);
    } else {
      setDataFill(false);
    }

    if (nifiUrl?.startsWith('https') || registryUrl?.startsWith('https')) {
      setTest(true);
    } else if (nifiUrl?.startsWith('http') || registryUrl?.startsWith('http')) {
      setTest(false);
    }
  }, [
    watchedFields,
    clusterData,
    setClusterData,
    setRegistryData,
    setDataFill,
    setTest,
  ]);
  useEffect(() => {
    if (data?.registry_id) {
      reset({
        registry: data?.registry_id || '',
        clusterName: clusterData?.clusterName,
        nifiUrl: clusterData?.nifiUrl,
        registryName: registryData?.name,
        registryUrl: registryData?.registry_url || '',
      });
      setClusterId(data?.id);
    }
  }, [reset, activeTab, newRegistry]);
  console.log(dataFill, 'DATAFIELD');

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
  }, [activeTab]);

  useEffect(() => {
    console.log('Updated registries:', registries);
    console.log('Selected registry:', selectedRegistryId);
    if (selectedRegistryId) {
      fetchRegistryDetails(selectedRegistryId);
    }
  }, [registries, selectedRegistryId, activeTab]);

  const fetchRegistryDetails = async () => {
    try {
      const response = await getOneRegistry(selectedRegistryId);
      console.log(response, 'ressss');
      setRegistryData(response);
    } catch (error) {
      console.error('Failed to fetch registry details:', error);
    }
  };

  const handleRegistry = () => {
    console.log(clusterData, 'cl');
    console.log(registryData, 'rd');
    setIsCertificateOpen(false);
    setIsCredOpen(false);
    setTestSuccess(false);
    setTest(true);
    setOpenSummary(true);
  };

  const testData = async () => {
    setLoading(true);
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);

      const response = await testCluster(payload);
      console.log('Response:', response);
      if (response.status === 204) {
        setTestSuccess(true);
        setSuccessModal(true);
        setLoading(false);
      } else {
        setFailedTestMessage(response.message);
        setFailedModal(true);
        setLoading(false);
      }
    } else {
      payload.append('name', registryData?.registryName || registryData.name);
      payload.append(
        'nifi_url',
        registryData?.registryUrl || registryData.registry_url
      );

      const response = await testRegistry(payload);
      console.log('Response:', response);
      if (response.status === 204) {
        setTestSuccess(true);
        setSuccessModal(true);
        setLoading(false);
      } else {
        setFailedModal(true);
        setLoading(false);
      }
    }
  };
  return (
    <Wrapper>
      <Title title="Add New Cluster Details" />
      <Container>
        <NavTabs id="nav-tab" role="tablist">
          <NavButton active={activeTab === TABS.CLUSTER}>
            Cluster Details
          </NavButton>
          <NavButton active={activeTab === TABS.REGISTRY}>
            Registry Details
          </NavButton>
        </NavTabs>

        {activeTab === TABS.CLUSTER && (
          <FormContainer>
            <InputField
              name="clusterName"
              register={register}
              icon={<QRIcons />}
              label="Cluster Name"
              placeholder="Enter your Cluster Name"
              errors={errors}
            />
            <InputField
              name="nifiUrl"
              register={register}
              icon={<LinkIcon />}
              label="Nifi Url"
              placeholder="Enter your Nifi Url"
              errors={errors}
            />
            <Flex>
              {test ? (
                <>
                  {' '}
                  <div>
                    <ButtonLabel>Test Via Certificate</ButtonLabel>
                    <Button
                      onClick={() => setIsCertificateOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      Add Certificate
                    </Button>
                  </div>
                  <ORText>OR</ORText>
                  <div>
                    <ButtonLabel>Test Via Creditionals</ButtonLabel>
                    <Button
                      onClick={() => setIsCredOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      Enter Creditionals
                    </Button>
                  </div>{' '}
                </>
              ) : (
                <div>
                  <ButtonLabel>Test Cluster</ButtonLabel>
                  <Button onClick={testData} loading={loading && 'testng...'}>
                    Test Cluster
                  </Button>
                </div>
              )}
            </Flex>
          </FormContainer>
        )}

        {activeTab === TABS.REGISTRY && !newRegistry && (
          <FormContainer>
            <SelectField
              control={control}
              name="registry"
              label="Registry Name"
              options={registries}
            />
            <ORText style={{ textAlign: 'center' }}>OR</ORText>
            <StyledButton
              variant="secondary"
              icon={<PlusCircleIcon color="red" />}
              onClick={() => {
                setNewRegistry(true);
              }}
            >
              Add New Registry
            </StyledButton>

            {selectedRegistryId ? (
              <RegistryDetailsDiv>
                <TitleRegistry>Registry Details</TitleRegistry>
                <Flex>
                  <BoxContentArea>
                    <p>Registry Name</p>
                    <span>{registryData.name}</span>
                  </BoxContentArea>

                  <BoxContentArea>
                    <p>Registry Url</p>
                    <span>{registryData.registry_url}</span>
                  </BoxContentArea>
                </Flex>
                <RegistryDetailsDivTwo>
                  <FlexTwo>
                    {!testSuccess && (
                      <Flex>
                        <div>
                          <ButtonLabel>Test Via Certificate</ButtonLabel>
                          <Button
                            onClick={() => {
                              setIsCertificateOpen(true);
                            }}
                            disabled={testSuccess}
                          >
                            Add Certificate
                          </Button>
                        </div>
                        <ORText>OR</ORText>
                        <div>
                          <ButtonLabel>Test Via Creditionals</ButtonLabel>
                          <Button
                            onClick={() => {
                              setIsCredOpen(true);
                            }}
                            disabled={testSuccess}
                          >
                            Enter Creditionals
                          </Button>
                        </div>
                      </Flex>
                    )}
                    <BottomButtonDiv>
                      {testSuccess && (
                        <CertificateMessage>
                          <WhiteBoradIcon />
                          <TextTest>Cluster Tested Successfully</TextTest>
                        </CertificateMessage>
                      )}
                      <ButtonDiv>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setNewRegistry(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button>Delete</Button>
                      </ButtonDiv>
                    </BottomButtonDiv>
                  </FlexTwo>
                </RegistryDetailsDivTwo>
              </RegistryDetailsDiv>
            ) : (
              <NoDataContainer>
                <NoDataIcon />
                <NoDataText>No Data Found!!</NoDataText>
              </NoDataContainer>
            )}
          </FormContainer>
        )}

        {activeTab === TABS.REGISTRY && newRegistry && (
          <FormContainer>
            <InputField
              name="registryName"
              register={register}
              icon={<QRIcons />}
              label="Registry Name"
              placeholder="Enter your Registry Name"
              errors={errors}
            />
            <InputField
              name="registryUrl"
              register={register}
              icon={<LinkIcon />}
              label="Registry Url"
              placeholder="Enter your Registry Url"
              errors={errors}
            />
            <Flex>
              {test ? (
                <>
                  <div>
                    <ButtonLabel>Test Via Certificate</ButtonLabel>
                    <Button
                      onClick={() => setIsCertificateOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      Add Certificate
                    </Button>
                  </div>
                  <ORText>OR</ORText>
                  <div>
                    <ButtonLabel>Test Via Creditionals</ButtonLabel>
                    <Button
                      onClick={() => setIsCredOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      Enter Creditionals
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <ButtonLabel>Test Cluster</ButtonLabel>
                  <Button
                    onClick={testData}
                    // disabled={addCertificateSatus}
                  >
                    Test Registry
                  </Button>
                </div>
              )}
            </Flex>
          </FormContainer>
        )}

        {testSuccess && newRegistry && (
          <UploadCertificateContainer>
            <CertificateMessage>
              <WhiteBoradIcon />
              <TextTest>Cluster Tested Successfully</TextTest>
            </CertificateMessage>
          </UploadCertificateContainer>
        )}
      </Container>
      <FlexWrapper>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          {(activeTab === 'cluster' || newRegistry) && (
            <Button onClick={handleSubmit(onSubmit)} disabled={!testSuccess}>
              Continue
            </Button>
          )}
          {!newRegistry && activeTab === 'registry' && (
            <Button onClick={handleRegistry} disabled={!testSuccess}>
              Continue
            </Button>
          )}
        </div>
      </FlexWrapper>
      <Certificate
        isCertificateOpen={isCertificateOpen}
        setIsCertificateOpen={setIsCertificateOpen}
        setTestSuccess={setTestSuccess}
        testSuccess={testSuccess}
        activeTab={activeTab}
        clusterData={clusterData}
        registryData={registryData}
      />
      <Creditionals
        isCredOpen={isCredOpen}
        setIsCredOpen={setIsCredOpen}
        setTestSuccess={setTestSuccess}
        testSuccess={testSuccess}
        activeTab={activeTab}
        clusterData={clusterData}
        registryData={registryData}
      />

      <SummaryModal
        clusterData={clusterData}
        registryData={registryData}
        openSummary={openSummary}
        setOpenSummary={setOpenSummary}
        registry_id={selectedRegistryId}
        clusterId={clusterId}
        edit={clusterId ? true : false}
      />

      <SuccessTestModal
        successTest={suceessModal}
        setSuccessTest={setSuccessModal}
        name={activeTab}
      />

      <FailedTestModal
        failedTest={failedModal}
        setFailedTest={setFailedModal}
        testMessage={failedTestMessage}
      />
    </Wrapper>
  );
};
