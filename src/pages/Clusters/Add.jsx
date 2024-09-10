import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  LinkIcon,
  NoDataIcon,
  PlusCircleIcon,
  QRIcons,
  RightCircleIcon,
  WhiteBoradIcon,
} from '../../assets';
import { CLUSTER_MODULE_TABS, KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField } from '../../shared';
import CopyToClipboard from '../../shared/CopyToClipboard';
import {
  getOneRegistry,
  getRegistryList,
  testCluster,
  testRegistry,
} from '../../store/apis';
import { Certificate } from './components/Certificate';
import { Creditionals } from './components/Creditionals';
import { FailedTestModal } from './components/FailedTestModal';
import { SuccessTestModal } from './components/SuccessTestModal';
import { SummaryModal } from './components/SummaryModal';
import { Title } from './components/Title';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;

const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
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
    props.active ? props.theme.colors.primary : props.theme.colors.darkGrey2};
  cursor: auto;
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active &&
    `border-bottom: 1px solid ${props.theme.colors.primaryActive};`}
`;

const Flex = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const FlexTwo = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  align-items: flex-end;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 65px);
  min-height: 500px;
`;

const ORText = styled.div`
  color: #7a7a9d;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
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
  margin-top: auto;
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
  font-size: 1.25rem;
  color: #444445;
  line-height: 27.24px;
  max-width: 55%;
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
    path {
      fill: ${props => props.theme.colors.primaryActive};
    }
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
  margin-top: auto;
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

  & .copy-button {
    position: absolute;
    right: -3rem;
    top: -0.5rem;
  }

  p {
    margin-bottom: 16px;
    font-size: 13px;
    font-weight: 500;
    line-height: 15.73px;
    letter-spacing: -0.005em;
    color: #2d343f;
  }

  span {
    display: flex;
    position: relative;
    font-size: 1rem;
    font-weight: 400;
    line-height: 14.52px;
    letter-spacing: -0.005em;
    color: #7a7a7a;
  }
`;

const RegistryDetailsDivTwo = styled.div`
  padding-left: -4px;
  margin-top: 1.5rem;
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
    .min(3, 'Cluster Name must be at least 3 characters long')
    .max(30, 'Cluster Name must be at most 30 characters long')
    .required('Cluster Name is required'),
  nifiUrl: yup
    .string()
    .url('Enter a valid NiFi URL')
    .required('NiFi URL is required'),
});

const RegistrySchema = yup.object().shape({
  registryName: yup
    .string()
    .min(3, 'Registry Name must be at least 3 characters long')
    .max(30, 'Registry Name must be at most 30 characters long')
    .required('Registry Name is required'),
  registryUrl: yup
    .string()
    .url('Enter a valid Registry URL')
    .required('NiFi URL is required'),
});

export const Add = () => {
  const [activeTab, setActiveTab] = useState(CLUSTER_MODULE_TABS.CLUSTER);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCredOpen, setIsCredOpen] = useState(false);
  const [test, setTest] = useState(true);
  const [suceessModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [newRegistry, setNewRegistry] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [dataFill, setDataFill] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [failedTestMessage, setFailedTestMessage] = useState('');
  const location = useLocation();
  const { state: data } = location.state || {};
  const [clusterData, setClusterData] = useState({
    clusterName: data?.name || '',
    nifiUrl: data?.nifi_url || '',
  });
  const [registryData, setRegistryData] = useState({
    registryName: '',
    registryUrl: '',
  });
  const [clusterId, setClusterId] = useState(data?.id);
  const [isEditDetails, setIsEditDetails] = useState(false);

  const {
    control,
    watch,
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      activeTab === CLUSTER_MODULE_TABS.CLUSTER ? ClusterSchema : RegistrySchema
    ),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const [registries, setRegistries] = useState([]);
  const selectedRegistryId = watch('registry');
  const handleBack = () => {
    setIsCertificateOpen(false);
    setIsCredOpen(false);
    setTestSuccess(false);
    setDataFill(false);
    setIsEditDetails(false);

    setTest(true);
    if (activeTab === CLUSTER_MODULE_TABS.REGISTRY && newRegistry) {
      setActiveTab(CLUSTER_MODULE_TABS.REGISTRY);
      setNewRegistry(false);
    } else if (activeTab === CLUSTER_MODULE_TABS.CLUSTER) {
      history.push('/clusters');
    } else {
      setActiveTab(CLUSTER_MODULE_TABS.CLUSTER);
    }
  };

  const onSubmit = data => {
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
    if (activeTab === CLUSTER_MODULE_TABS.CLUSTER) {
      setActiveTab(CLUSTER_MODULE_TABS.REGISTRY);
    } else if (activeTab === CLUSTER_MODULE_TABS.REGISTRY) {
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
    } else if (
      newRegistry &&
      !isEditDetails &&
      activeTab === 'registry' &&
      !data?.id
    ) {
      if (
        registryName !== registryData?.registryName ||
        registryUrl !== registryData?.registryUrl
      ) {
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
  }, [activeTab]);

  useEffect(() => {
    if (selectedRegistryId) {
      fetchRegistryDetails(selectedRegistryId);
    }
  }, [registries, selectedRegistryId, activeTab]);

  const fetchRegistryDetails = async () => {
    try {
      const response = await getOneRegistry(selectedRegistryId);
      setRegistryData(response);
    } catch (error) {
      console.error('Failed to fetch registry details:', error);
    }
  };

  const handleRegistry = () => {
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
      //this code needs to updateee for edit functionality
      payload.append('name', registryData?.registryName || registryData.name);
      payload.append(
        'nifi_url',
        registryData?.registryUrl || registryData.registry_url
      );

      const response = await testRegistry(payload);
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
      <Title
        title={
          data
            ? `Edit ${isEditDetails ? 'Registry' : 'Cluster'} Details`
            : 'Add New Cluster Details'
        }
      />
      <Container>
        <NavTabs id="nav-tab" role="tablist">
          <NavButton
            active={activeTab === CLUSTER_MODULE_TABS.CLUSTER}
            onClick={() => setActiveTab(CLUSTER_MODULE_TABS.CLUSTER)}
          >
            {KDFM.CLUSTER_DETAILS}
          </NavButton>
          <NavButton
            active={activeTab === CLUSTER_MODULE_TABS.REGISTRY}
            onClick={() =>
              Object.keys(data || {})?.length
                ? setActiveTab(CLUSTER_MODULE_TABS.REGISTRY)
                : {}
            }
          >
            {KDFM.REGISTRY_DETAILS}
          </NavButton>
        </NavTabs>

        {activeTab === CLUSTER_MODULE_TABS.CLUSTER && (
          <FormContainer>
            <InputField
              name="clusterName"
              register={register}
              icon={<QRIcons />}
              label={KDFM.CLUSTER_NAME}
              placeholder={KDFM.ENTER_CLUSTER_NAME}
              errors={errors}
            />
            <InputField
              name="nifiUrl"
              register={register}
              icon={<LinkIcon />}
              label={KDFM.NIFI_URL}
              disabled={testSuccess}
              placeholder={KDFM.ENTER_NIFI_URL}
              errors={errors}
            />
            <Flex>
              {test ? (
                <>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CERTIFICATE}</ButtonLabel>
                    <Button
                      onClick={() => setIsCertificateOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      {KDFM.ADD_CERTIFICATE}
                    </Button>
                  </div>
                  <ORText>{KDFM.SEPARATOR}</ORText>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                    <Button
                      onClick={() => setIsCredOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      {KDFM.ENTER_CREDENTIALS}
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <ButtonLabel>{KDFM.TEST_CLUSTER}</ButtonLabel>
                  <Button onClick={testData} loading={loading}>
                    {KDFM.TEST_CLUSTER}
                  </Button>
                </div>
              )}
            </Flex>
            {testSuccess && !suceessModal && (
              <UploadCertificateContainer>
                <CertificateMessage>
                  <RightCircleIcon width={60} height={60} />
                  <TextTest>
                    {activeTab === CLUSTER_MODULE_TABS.CLUSTER
                      ? KDFM.CLUSTER_TESTED_SUCCES_PROMPT
                      : KDFM.REGISTRY_TESTED_SUCCESS_PROMPT}
                  </TextTest>
                </CertificateMessage>
              </UploadCertificateContainer>
            )}
          </FormContainer>
        )}

        {activeTab === CLUSTER_MODULE_TABS.REGISTRY && !newRegistry && (
          <FormContainer>
            <SelectField
              control={control}
              name="registry"
              label={KDFM.REGISTRY_NAME}
              options={registries}
              icon={<QRIcons />}
            />
            <ORText style={{ textAlign: 'center' }}>OR</ORText>
            <div>
              <StyledButton
                variant="secondary"
                icon={
                  <PlusCircleIcon
                    color="#FF7A00
                  "
                  />
                }
                onClick={() => {
                  setNewRegistry(true);
                }}
              >
                {KDFM.ADD_NEW_REGISTRY}
              </StyledButton>
            </div>

            {selectedRegistryId ? (
              <RegistryDetailsDiv>
                <TitleRegistry>{KDFM.REGISTRY_DETAILS}</TitleRegistry>
                <Flex>
                  <BoxContentArea>
                    <p>{KDFM.REGISTRY_NAME}</p>
                    <span>{registryData.name}</span>
                  </BoxContentArea>
                  <BoxContentArea>
                    <p>{KDFM.REGISTRY_URL}</p>
                    <span>
                      {registryData.registry_url}
                      <CopyToClipboard
                        className="copy-button"
                        copyItem={registryData.registry_url}
                      />
                    </span>
                  </BoxContentArea>
                </Flex>
                <RegistryDetailsDivTwo>
                  <FlexTwo>
                    {!testSuccess ? (
                      <Flex>
                        <div>
                          <ButtonLabel>{KDFM.TEST_VIA_CERTIFICATE}</ButtonLabel>
                          <Button
                            onClick={() => {
                              setIsCertificateOpen(true);
                            }}
                            disabled={testSuccess}
                          >
                            {KDFM.ADD_CERTIFICATE}
                          </Button>
                        </div>
                        <ORText>{KDFM.SEPARATOR}</ORText>
                        <div>
                          <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                          <Button
                            onClick={() => {
                              setIsCredOpen(true);
                            }}
                            disabled={testSuccess}
                          >
                            {KDFM.ENTER_CREDENTIALS}
                          </Button>
                        </div>
                        {testSuccess && !suceessModal && (
                          <UploadCertificateContainer>
                            <CertificateMessage>
                              <RightCircleIcon width={60} height={60} />
                              <TextTest>
                                {activeTab === CLUSTER_MODULE_TABS.REGISTRY
                                  ? KDFM.REGISTRY_TESTED_SUCCESS_PROMPT
                                  : KDFM.CLUSTER_TESTED_SUCCESSFULLY}
                              </TextTest>
                            </CertificateMessage>
                          </UploadCertificateContainer>
                        )}
                      </Flex>
                    ) : (
                      <CertificateMessage>
                        <RightCircleIcon width={60} height={60} />
                        <TextTest>
                          {activeTab === CLUSTER_MODULE_TABS.REGISTRY
                            ? KDFM.REGISTRY_TESTED_SUCCESS_PROMPT
                            : KDFM.CLUSTER_TESTED_SUCCESSFULLY}
                        </TextTest>
                      </CertificateMessage>
                    )}
                    <ButtonDiv>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setNewRegistry(true);
                          setIsEditDetails(true);
                          setValue('registryName', registryData?.name);
                          setValue('registryUrl', registryData?.registry_url);
                        }}
                      >
                        {KDFM.EDIT}
                      </Button>
                      <Button
                        onClick={() => {
                          reset({ registry: '' });
                          setRegistryData('');
                        }}
                      >
                        {KDFM.DELETE}
                      </Button>
                    </ButtonDiv>
                  </FlexTwo>
                </RegistryDetailsDivTwo>
              </RegistryDetailsDiv>
            ) : (
              <NoDataContainer>
                <NoDataIcon />
                <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
              </NoDataContainer>
            )}
          </FormContainer>
        )}
        {activeTab === CLUSTER_MODULE_TABS.REGISTRY && newRegistry && (
          <FormContainer>
            <InputField
              name="registryName"
              register={register}
              icon={<QRIcons />}
              label={KDFM.REGISTRY_NAME}
              placeholder={KDFM.ENTER_REGISTRY_NAME}
              errors={errors}
            />
            <InputField
              name="registryUrl"
              register={register}
              icon={<LinkIcon />}
              label={KDFM.REGISTRY_URL}
              disabled={testSuccess}
              placeholder={KDFM.ENTER_REGISTRY_URL}
              errors={errors}
            />
            <Flex>
              {test ? (
                <>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CERTIFICATE}</ButtonLabel>
                    <Button
                      onClick={() => setIsCertificateOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      {KDFM.ADD_CERTIFICATE}
                    </Button>
                  </div>
                  <ORText>OR</ORText>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                    <Button
                      onClick={() => setIsCredOpen(true)}
                      disabled={testSuccess || !dataFill}
                    >
                      {KDFM.ENTER_CREDENTIALS}
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <ButtonLabel>{KDFM.TEST_CLUSTER}</ButtonLabel>
                  <Button
                    onClick={testData}
                    // disabled={addCertificateSatus}
                  >
                    {KDFM.TEST_REGISTRY}
                  </Button>
                </div>
              )}
            </Flex>
            {testSuccess && !suceessModal && (
              <UploadCertificateContainer>
                <CertificateMessage>
                  <WhiteBoradIcon />
                  <TextTest>
                    {activeTab === CLUSTER_MODULE_TABS.REGISTRY
                      ? KDFM.REGISRTY_TESTED_SUCCESSFULLY
                      : KDFM.CLUSTER_TESTED_SUCCESSFULLY}
                  </TextTest>
                </CertificateMessage>
              </UploadCertificateContainer>
            )}
          </FormContainer>
        )}
      </Container>
      <FlexWrapper>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={handleBack}>
            {KDFM.BACK}
          </Button>
          {(activeTab === 'cluster' || newRegistry) && (
            <Button onClick={handleSubmit(onSubmit)} disabled={!testSuccess}>
              {KDFM.CONTINUE}
            </Button>
          )}
          {!newRegistry && activeTab === 'registry' && (
            <Button onClick={handleRegistry} disabled={!testSuccess}>
              {KDFM.CONTINUE}
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
        setSuccessModal={setSuccessModal}
      />
      <Creditionals
        isCredOpen={isCredOpen}
        setIsCredOpen={setIsCredOpen}
        setTestSuccess={setTestSuccess}
        testSuccess={testSuccess}
        activeTab={activeTab}
        clusterData={clusterData}
        registryData={registryData}
        setSuccessModal={setSuccessModal}
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
      {suceessModal && (
        <SuccessTestModal
          successTest={suceessModal}
          setSuccessTest={setSuccessModal}
          name={activeTab}
        />
      )}
      <FailedTestModal
        failedTest={failedModal}
        setFailedTest={setFailedModal}
        testMessage={failedTestMessage}
        activeTab={activeTab}
      />
    </Wrapper>
  );
};
