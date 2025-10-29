/*eslint-disable*/
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import * as yup from 'yup';
import { LinkIcon, NoDataIcon, PlusCircleIcon, QRIcons } from '../../assets';
import { CLUSTER_MODULE_TABS, KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField } from '../../shared';
import {
  ClustersActions,
  ClustersSelectors,
  GridActions,
  GridSelectors,
  NamespacesActions,
} from '../../store';
import {
  getOneRegistry,
  getRegistryList,
  testCluster,
  testRegistry,
  updateCluster,
} from '../../store/apis';
import { Certificate } from './components/Certificate';
import CertificateTextDisplay from './components/CertificateTextDisplay';
import ClusterCheckBoxSection from './components/ClusterCheckboxSection';
import ClusterFieldsForm from './components/ClusterFieldsForm';
import ClusterNavigationTab from './components/ClusterNavigationTab';
import ClusterTagInput from './components/ClusterTagInput';
import ClusterTestSection from './components/ClusterTestSection';
import { Creditionals } from './components/Creditionals';
import { FailedTestModal } from './components/FailedTestModal';
import RegistryFormSection from './components/RegistryFormSection';
import { SuccessTestModal } from './components/SuccessTestModal';
import { SummaryModal } from './components/SummaryModal';
import { Title } from './components/Title';
import { ClusterServiceAccountModal } from './components/ClusterServiceAccountModal';
import { AuthenticationSelectors } from '../../store/authentication';
import { ClusterCustomProcessor } from './components/ClusterCustomProcessor';
import { SSHDetailsTabSection } from './components/SSHDetailsTabSection';
import { DriversCluster } from './components/DriversClusters';
import { FlowGzTabSection } from './components/FlowGzSection';
import { createRegistry } from '../../store/index1';
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

export const Add = () => {
  const [activeTab, setActiveTab] = useState(CLUSTER_MODULE_TABS.CLUSTER);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isCredOpen, setIsCredOpen] = useState(false);
  const [test, setTest] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [newRegistry, setNewRegistry] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [dataFill, setDataFill] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [failedTestMessage, setFailedTestMessage] = useState('');
  const [registries, setRegistries] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const { state: data } = location.state || {};
  const [tags, setTags] = useState(data?.tag || '');
  const [clusterData, setClusterData] = useState({
    clusterName: data?.name || '',
    nifiUrl: data?.nifi_url || '',
    metrics_url: data?.metrics_url || '',
    logs_url: data?.logs_url || '',
  });
  const [clusterId, setClusterId] = useState(data?.id);
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, 'clusters')
  );
  const [saveButtonEnable, setSaveButtonEnable] = useState(true);
  const [error, setError] = useState('');
  const filteredGridData = gridData.filter(item => {
    return item?.nifi_url !== data?.nifi_url;
  });

  const hostToEdit = clusterData?.clusterName || clusterId;

  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const isSuperAdmin = currentUserData?.role === 'superadmin';

  const ClusterSchema = yup.object().shape({
    clusterName: yup
      .string()
      .min(3, 'Cluster Name must be at least 3 characters long')
      .max(30, 'Cluster Name must be at most 30 characters long')
      .required('Cluster Name is required')
      .test(
        'unique-cluster-name',
        'Cluster name already exists',
        function (value) {
          if (!value) return true;
          return !filteredGridData?.some(
            reg => reg?.name.trim().toLowerCase() === value.trim().toLowerCase()
          );
        }
      ),
    nifiUrl: yup
      .string()
      .url('Enter a valid NiFi URL')
      .required('NiFi URL is required')
      .test('unique-registry-url', ' Cluster already exists', function (value) {
        if (!value) return true;
        return !filteredGridData?.some(
          reg =>
            reg?.nifi_url.trim() === value.trim() ||
            reg?.nifi_url.trim() + '/nifi' === value.trim()
        );
      }),
    metrics_url: yup.string().url('Enter a valid Metrics URL'),
    logs_url: yup.string().url('Enter a valid Logs URL'),
  });
  const RegistrySchema = yup.object().shape({
    registryName: yup
      .string()
      .min(3, 'Registry Name must be at least 3 characters long')
      .max(30, 'Registry Name must be at most 30 characters long')
      .required('Registry Name is required')
      .test(
        'unique-registry-name',
        'Registry name already exists',
        function (value) {
          if (!value) return true;
          return !registries?.some(
            reg =>
              reg?.label.trim().toLowerCase() === value.trim().toLowerCase()
          );
        }
      ),
    registryUrl: yup
      .string()
      .url('Enter a valid Registry URL')
      .required('NiFi URL is required')
      .test(
        'unique-registry-urls',
        'Registry already exists',
        function (value) {
          if (!value) return true;
          return !registries?.some(
            reg => reg?.registry_url.trim() === value.trim()
          );
        }
      ),
  });

  useEffect(() => {
    const originalData = data || {};
    if (
      clusterData.clusterName !== originalData.name ||
      clusterData.nifiUrl !== originalData.nifi_url ||
      clusterData.metrics_url !== originalData.metrics_url ||
      clusterData.logs_url !== originalData.logs_url
    ) {
      dispatch(ClustersActions.addEditClusterData(clusterData));
    }
  }, [clusterData, data, dispatch]);

  const [registryData, setRegistryData] = useState({
    registryName: '',
    is_registry_authenticated: true,
    registryUrl: '',
  });

  const [isEditDetails, setIsEditDetails] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [notificationEnable, setNotificationEnable] = useState(
    data?.notification_enable || false
  );
  const [approverEnable, setApproverEnable] = useState(
    data?.approver_enable || false
  );
  const [changeRequestEnable, setChangeRequestApproverEnable] = useState(
    data?.change_request_enable || false
  );
  const sortRegisrtyURL = registries?.map(ele => ele?.registry_url);
  const registryURLs =
    useSelector(ClustersSelectors.getClusterFormData) || sortRegisrtyURL;
  const handleSchemaCheck = activeTab => {
    return activeTab === CLUSTER_MODULE_TABS.CLUSTER
      ? ClusterSchema
      : RegistrySchema;
  };
  useEffect(() => {
    if (!approverEnable) {
      setChangeRequestApproverEnable(false);
    }
  }, [approverEnable]);

  const {
    control,
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(handleSchemaCheck(activeTab)),
    mode: 'all',
    reValidateMode: 'onChange',
  });

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
    } else if (activeTab === CLUSTER_MODULE_TABS.SERVICE_ACCOUNT) {
      setActiveTab(CLUSTER_MODULE_TABS.REGISTRY);
    } else {
      setActiveTab(CLUSTER_MODULE_TABS.CLUSTER);
    }
  };

  const editClusterData = async () => {
    try {
      const payload = {
        name: clusterData?.clusterName,
        nifi_url: clusterData?.nifiUrl,
        logs_url: isEmpty(clusterData?.logs_url) ? null : clusterData?.logs_url,
        metrics_url: isEmpty(clusterData?.metrics_url)
          ? null
          : clusterData?.metrics_url,
        tag: tags,
        notification_enable: notificationEnable,
        approver_enable: approverEnable,
        change_request_enable: changeRequestEnable,
        has_custom_service_account: false,
      };

      const id = clusterId;
      const response = await updateCluster(id, payload);

      if (response?.id) {
        const cluster = localStorage.getItem('selected_cluster');
        if (cluster) {
          const parsedCluster = JSON.parse(cluster);
          if (parsedCluster?.value === clusterId) {
            localStorage.setItem(
              'selected_cluster',
              JSON.stringify({ label: response?.name, value: response?.id })
            );
            dispatch(
              NamespacesActions.setSelectedCluster({
                label: response?.name,
                value: response?.id,
              })
            );
            dispatch(
              GridActions.fetchGridSuccess({
                module: 'clusters',
                data: { name: response?.name },
              })
            );
          }
        }
        toast.success('Cluster updated successfully!');
      } else {
        throw new Error(response?.message || 'Failed to update cluster');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'An error occurred while updating the cluster'
      );
    }
  };

  const handleAddRegistry = async data => {
    const dataPayload = {
      name: data.registryName,
      is_registry_authenticated: data.is_registry_authenticated,
      registry_url: data.registryUrl,
    };

    const reponse = await createRegistry(dataPayload);
    if (reponse?.status === 201) {
      setActiveTab(CLUSTER_MODULE_TABS.REGISTRY);
      setNewRegistry(false);
      fetchRegistry();
    }
  };

  const onSubmit = data => {
    if (!isEmpty(registries) && activeTab === CLUSTER_MODULE_TABS.REGISTRY) {
      handleAddRegistry(data);
      return;
    }
    if (clusterId) {
      editClusterData();
      history.push('/clusters');
    } else {
      setRegistryData({
        registryName: data.registryName,
        is_registry_authenticated: data.is_registry_authenticated,
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
        if (registryURLs?.data?.includes(new URL(data?.registryUrl)?.origin)) {
          setOpenSummary(true);
        } else {
          handleAddRegistry(data);
        }
      }
    }
  };

  const watchedFields = watch([
    'clusterName',
    'nifiUrl',
    'metrics_url',
    'logs_url',
    'registryName',
    'registryUrl',
    'tags',
    'is_registry_authenticated',
  ]);

  const checkDuplicate = filteredGridData?.some(
    reg => reg.nifi_url === watchedFields?.[1]
  );
  const checkDuplicateName = filteredGridData?.some(
    reg => reg.name === watchedFields?.[0]
  );
  const checkDuplicateRegistryName = registries?.some(
    reg => reg.name === watchedFields?.[4]
  );
  const checkDuplicateRegistry = registries?.some(
    reg => reg.registry_url === watchedFields?.[5]
  );

  const clusterName = useWatch({ control, name: 'clusterName' });
  const nifiUrl = useWatch({ control, name: 'nifiUrl' });
  const metrics_url = useWatch({ control, name: 'metrics_url' });
  const logs_url = useWatch({ control, name: 'logs_url' });
  const registryName = useWatch({ control, name: 'registryName' });
  const registryUrl = useWatch({ control, name: 'registryUrl' });

  useEffect(() => {
    if (activeTab === 'cluster') {
      if (
        clusterName !== clusterData.clusterName ||
        nifiUrl !== clusterData.nifiUrl ||
        logs_url !== clusterData.logs_url ||
        metrics_url !== clusterData.metrics_url
      ) {
        setClusterData({
          clusterName: clusterName || '',
          nifiUrl: nifiUrl || '',
          metrics_url: metrics_url || '',
          logs_url: logs_url || '',
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
    clusterName,
    nifiUrl,
    logs_url,
    metrics_url,
    registryName,
    registryUrl,
    activeTab,
    newRegistry,
    isEditDetails,
    data?.id,
    clusterData,
    registryData,
  ]);

  useEffect(() => {
    if (
      data?.registry_id ||
      data?.created_by_ansible ||
      data?.is_kube_cluster
    ) {
      reset({
        registry: data?.registry_id || '',
        clusterName: clusterData?.clusterName,
        metrics_url: clusterData?.metrics_url || '',
        logs_url: clusterData?.logs_url || '',
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
        registry_url: item?.registry_url,
      }));
      setRegistries(names);
    } catch (error) {
      console.error('Failed to fetch registries:', error);
    }
  };
  const fetchRegistryDetails = async () => {
    try {
      const response = await getOneRegistry(selectedRegistryId);
      setRegistryData(response);
    } catch (error) {
      console.error('Failed to fetch registry details:', error);
    }
  };

  const noRegistryAPIcall = () => {
    if (
      activeTab === CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR ||
      activeTab === CLUSTER_MODULE_TABS.SSH_DETAILS ||
      activeTab === CLUSTER_MODULE_TABS.DRIVERS ||
      activeTab === CLUSTER_MODULE_TABS.FLOW_GZ ||
      activeTab === CLUSTER_MODULE_TABS.SERVICE_ACCOUNT
    ) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    if (noRegistryAPIcall()) {
      fetchRegistry();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedRegistryId && noRegistryAPIcall()) {
      fetchRegistryDetails();
    }
  }, [registries, selectedRegistryId, activeTab, newRegistry]);

  const handleRegistry = () => {
    if (
      registryURLs?.data?.includes(registryData?.registry_url) ||
      sortRegisrtyURL.includes(registryData?.registry_url)
    ) {
      setIsCertificateOpen(false);
      setIsCredOpen(false);
      setTestSuccess(false);
      setTest(true);
      setOpenSummary(true);
    } else {
      toast.error('This registry do not  exist!');
    }
  };
  function handleKeyDown(e) {
    const value = inputValue;
    if (e.key === 'Backspace') {
      if (value === '') {
        const currentTags = tags.split(',').filter(tag => tag);
        if (currentTags.length > 0) {
          currentTags.pop();
          setTags(currentTags.join(','));
        }
      }
      return;
    }
    if (e.key === 'Enter') {
      const trimmedValue = value.trim().replace(/,$/, '');
      if (!trimmedValue) return;
      if (trimmedValue.length > 20) {
        setError('Maximum 20 characters allowed');
        return;
      }
      if (trimmedValue.length < 2) {
        setError('Minimum 2 characters required');
        return;
      }
      const currentTags = tags.split(',').filter(tag => tag);
      if (
        currentTags.some(
          tag => tag.toLowerCase() === trimmedValue.toLowerCase()
        )
      ) {
        toast.error('Tag already exists');
        return;
      }
      if (currentTags.length >= 5) {
        toast.error('Tag limit reached (5 tags max)');
        return;
      }
      setTags([...currentTags, trimmedValue].join(','));
      setInputValue('');
      setError('');
    }
  }

  function removeTag(tagToRemove) {
    const currentTags = tags.split(',').filter(tag => tag);
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags.join(','));
  }
  const testData = async () => {
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);

      const response = await testCluster(payload);
      if (response.status === 200) {
        setTestSuccess(true);
        setSuccessModal(true);
      } else {
        setFailedTestMessage(response.message);
        setFailedModal(true);
      }
    } else {
      //this code needs to updateee for edit functionality
      payload.append('name', registryData?.registryName || registryData.name);
      payload.append(
        'nifi_url',
        registryData?.registryUrl || registryData.registry_url
      );
      payload.append(
        'is_registry_authenticated',

        registryData?.is_registry_authenticated
      );
      const response = await testRegistry(payload);
      if (response.status === 204) {
        setTestSuccess(true);
        setSuccessModal(true);
      } else {
        setFailedModal(true);
      }
    }
  };

  const checkEditSave = () => {
    return (
      data?.tag === tags &&
      data?.approver_enable === approverEnable &&
      data?.notification_enable === notificationEnable &&
      data?.change_request_enable === changeRequestEnable
    );
  };

  useEffect(() => {
    if (checkEditSave()) {
      setSaveButtonEnable(true);
    } else {
      setSaveButtonEnable(false);
    }
  }, [data, tags, approverEnable, notificationEnable, changeRequestEnable]);
  const handleTitleProvider = data => {
    if (data) {
      return `Edit ${isEditDetails ? 'Registry' : 'Cluster'} Details`;
    } else {
      return 'Add New Cluster Details';
    }
  };
  const isRegistryDetailDisable = () => {
    return (
      clusterId &&
      (watchedFields?.[1] !== data?.nifi_url ||
        watchedFields?.[0] !== data?.name ||
        !checkEditSave())
    );
  };

  const giveSubmitButtonText = () => {
    if (newRegistry) {
      return KDFM.CONTINUE;
    } else if (clusterId) {
      return KDFM.SAVE;
    } else {
      return KDFM.CONTINUE;
    }
  };
  const hasValidationErrors = () => Object.keys(errors).length > 0;

  const showSubmitButtonOnCluster = () => {
    return activeTab === 'cluster' || newRegistry;
  };

  const showRegistryContiueButton = () => {
    return !newRegistry && activeTab === 'registry';
  };

  const isTestInvalid = () => !testSuccess;

  const isFieldValuesUnchanged = () =>
    watchedFields?.[0] === data?.name &&
    watchedFields?.[2] ===
      (data?.metrics_url === null ? '' : data?.metrics_url) &&
    watchedFields?.[3] === (data?.logs_url === null ? '' : data?.logs_url);

  const isSaveDisabled = () =>
    isFieldValuesUnchanged() && checkEditSave() && saveButtonEnable;

  const isDisabled = () => {
    if (!watchedFields?.[7] && activeTab === 'registry') {
      return false;
    }
    if (hasValidationErrors()) return true;
    if (newRegistry) {
      return isTestInvalid();
    }
    if (clusterId) {
      return isSaveDisabled() || !test;
    }
    return isTestInvalid();
  };

  return (
    <Wrapper>
      <Title title={handleTitleProvider(data)} />
      <Container>
        <ClusterNavigationTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setNewRegistry={setNewRegistry}
          isRegistryDetailDisable={isRegistryDetailDisable()}
          data={data}
        />

        {activeTab === CLUSTER_MODULE_TABS.CLUSTER && (
          <FormContainer>
            <ClusterFieldsForm
              register={register}
              errors={errors}
              testSuccess={testSuccess}
            />
            <ClusterTagInput
              tags={tags}
              removeTag={removeTag}
              inputValue={inputValue}
              setInputValue={setInputValue}
              register={register}
              handleKeyDown={handleKeyDown}
              setError={setError}
              error={error}
            />
            <ClusterCheckBoxSection
              approverEnable={approverEnable}
              setApproverEnable={setApproverEnable}
              setChangeRequestApproverEnable={setChangeRequestApproverEnable}
              setNotificationEnable={setNotificationEnable}
              changeRequestEnable={changeRequestEnable}
              notificationEnable={notificationEnable}
            />
            <ClusterTestSection
              test={test}
              setIsCertificateOpen={setIsCertificateOpen}
              testSuccess={testSuccess}
              dataFill={dataFill}
              checkDuplicate={checkDuplicate}
              checkDuplicateName={checkDuplicateName}
              setIsCredOpen={setIsCredOpen}
              testData={testData}
              watchedFields={watchedFields}
              data={data}
            />
            {testSuccess && !successModal && (
              <CertificateTextDisplay
                clusterModule={true}
                activeTab={activeTab}
                clusterId={clusterId}
              />
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
                  reset({
                    registryName: '',
                    registryUrl: '',
                  });
                  setRegistryData('');
                }}
              >
                {KDFM.ADD_NEW_REGISTRY}
              </StyledButton>
            </div>
            {!selectedRegistryId && (
              <NoDataContainer>
                <NoDataIcon />
                <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
              </NoDataContainer>
            )}
          </FormContainer>
        )}
        {activeTab === CLUSTER_MODULE_TABS.REGISTRY && newRegistry && (
          <FormContainer>
            <RegistryFormSection
              register={register}
              errors={errors}
              testSuccess={testSuccess}
              test={test}
              setIsCertificateOpen={setIsCertificateOpen}
              dataFill={dataFill}
              checkDuplicateRegistry={checkDuplicateRegistry}
              checkDuplicateRegistryName={checkDuplicateRegistryName}
              setIsCredOpen={setIsCredOpen}
              testData={testData}
              successModal={successModal}
              activeTab={activeTab}
              clusterId={clusterId}
              registryData={registryData}
              watchedFields={watchedFields}
            />
          </FormContainer>
        )}
        {isSuperAdmin && activeTab === CLUSTER_MODULE_TABS.SERVICE_ACCOUNT && (
          <FormContainer>
            <ClusterServiceAccountModal
              tags={tags}
              hostToEdit={hostToEdit}
              clusterData={clusterData}
              clusterId={clusterId}
              data={data}
            />
          </FormContainer>
        )}
        {activeTab === CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR && (
          <FormContainer>
            {<ClusterCustomProcessor data={data} />}
          </FormContainer>
        )}
        {activeTab === CLUSTER_MODULE_TABS.SSH_DETAILS && (
          <FormContainer>
            <SSHDetailsTabSection data={data} />
          </FormContainer>
        )}
        {activeTab === CLUSTER_MODULE_TABS.DRIVERS && (
          <FormContainer>
            <DriversCluster data={data} />
          </FormContainer>
        )}

        {activeTab === CLUSTER_MODULE_TABS.FLOW_GZ && (
          <FormContainer>
            <FlowGzTabSection
              tags={tags}
              hostToEdit={hostToEdit}
              clusterData={clusterData}
              clusterId={clusterId}
              data={data}
            />
          </FormContainer>
        )}
      </Container>
      <FlexWrapper>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={handleBack}>
            {KDFM.BACK}
          </Button>
          {showSubmitButtonOnCluster() && (
            <Button onClick={handleSubmit(onSubmit)} disabled={isDisabled()}>
              {giveSubmitButtonText()}
            </Button>
          )}
          {showRegistryContiueButton() && (
            <Button
              id="registry-details-continue-btn"
              onClick={handleRegistry}
              disabled={!selectedRegistryId}
            >
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
        setSaveButtonEnable={setSaveButtonEnable}
      />
      <SummaryModal
        clusterData={clusterData}
        registryData={registryData}
        openSummary={openSummary}
        setOpenSummary={setOpenSummary}
        registry_id={selectedRegistryId}
        clusterId={clusterId}
        edit={!!clusterId}
        notificationEnable={notificationEnable}
        approverEnable={approverEnable}
        changeRequestEnable={changeRequestEnable}
        tags={tags}
      />
      {successModal && (
        <SuccessTestModal
          successTest={successModal}
          setSuccessTest={setSuccessModal}
          name={`${activeTab} test Successful`}
          text="Your configuration test was successful.
           Continue with the next steps."
          title="Testing Successful"
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
