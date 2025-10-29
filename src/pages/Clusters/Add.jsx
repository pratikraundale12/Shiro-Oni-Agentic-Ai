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
  createRegistry,
  getOneRegistry,
  getRegistryList,
  testCluster,
  testRegistry,
  updateCluster,
} from '../../store/apis';
import { AuthenticationSelectors } from '../../store/authentication';
import { Certificate } from './components/Certificate';
import CertificateTextDisplay from './components/CertificateTextDisplay';
import ClusterCheckBoxSection from './components/ClusterCheckboxSection';
import ClusterFieldsForm from './components/ClusterFieldsForm';
import ClusterNavigationTab from './components/ClusterNavigationTab';
import { ClusterServiceAccountModal } from './components/ClusterServiceAccountModal';
import ClusterTagInput from './components/ClusterTagInput';
import ClusterTestSection from './components/ClusterTestSection';
import { Creditionals } from './components/Creditionals';
import { FailedTestModal } from './components/FailedTestModal';
import RegistryFormSection from './components/RegistryFormSection';
import { SuccessTestModal } from './components/SuccessTestModal';
import { SummaryModal } from './components/SummaryModal';
import { Title } from './components/Title';
import { ClusterCustomProcessor } from './components/ClusterCustomProcessor';
import { SSHDetailsTabSection } from './components/SSHDetailsTabSection';
import { DriversCluster } from './components/DriversClusters';
import { FlowGzTabSection } from './components/FlowGzSection';
import RegistryMultiSelect from '../../shared/FormInputs/components/RegistryMultiSelectField';

// import { createRegistry } from '../../store/index1';
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
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 18px;
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
    service_account_certificate: data?.service_account_certificate || '',
    service_account_certificate_password:
      data?.service_account_certificate_password || '',
  });
  const [clusterId, setClusterId] = useState(data?.id);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, 'clusters')
  );

  const [saveButtonEnable, setSaveButtonEnable] = useState(true);
  const [error, setError] = useState('');
  const filteredGridData = gridData.filter(item => {
    if (location?.pathname === '/clusters/add') {
      return true;
    }
    return item?.nifi_url !== data?.nifi_url;
  });

  const hostToEdit = clusterData?.clusterName || clusterId;

  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const clusterDataRedux = useSelector(ClustersSelectors.getAddEditClusterData);
  // Add this state to track if it's a copy operation
  const [isCopyOperation, setIsCopyOperation] = useState(false);

  const isSuperAdmin = currentUserData?.role === 'superadmin';
  const ClusterSchema = yup.object().shape({
    clusterName: yup
      .string()
      .min(3, 'Cluster Name must be at least 3 characters long')
      .max(200, 'Cluster Name must be at most 200 characters long')
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
      .required('NiFi URL is required')
      .test('is-valid-url', 'Enter a valid NiFi URL', function (value) {
        if (!value) return false;
        const trimmedValue = value.trim();
        try {
          new URL(trimmedValue);
          return true;
        } catch {
          return false;
        }
      })
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
      .required('Registry Name is required')
      .test(
        'no-leading-trailing-spaces',
        'Registry Name cannot start or end with spaces',
        value => {
          if (!value) return false;
          return value === value.trim();
        }
      )
      .min(3, 'Registry Name must be at least 3 characters long')
      .max(30, 'Registry Name must be at most 30 characters long')
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
      .required('NiFi Registry URL is required')
      .test(
        'is-valid-url',
        'Enter a valid NiFi Registry URL',
        function (value) {
          if (!value) return false;
          const trimmedValue = value.trim();
          try {
            new URL(trimmedValue);
            return true;
          } catch {
            return false;
          }
        }
      )
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
    default_registry: yup
      .string()
      .required('Default Registry is required')
      .test(
        'default-registry-in-selected',
        'Default registry must be one of the selected registries',
        function (value) {
          if (!value) return false;
          const selectedRegistries = this.parent.registry;
          if (!selectedRegistries || selectedRegistries.length === 0)
            return false;
          return selectedRegistries.some(registry => registry.value === value);
        }
      ),
    registry: yup
      .array()
      .min(1, 'At least one registry must be selected')
      .required('Registry selection is required'),
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

  const [approverEnableForStartAndStop, setApproverEnableForStartAndStop] =
    useState(data?.start_stop_requires_approval || false);

  const [certificateOption, setCertificateOption] = useState(
    data?.is_certificate_based_service_account || false
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
  const [testCertificateFile, setTestCertificateFile] = useState('');
  const [testCertificatePassword, setTestCertificatePassword] = useState('');
  const [testCertificateFileForRegistry, setTestCertificateFileForRegistry] =
    useState('');
  const [uploadFileatEditTime, setUploadFileatEditTime] = useState(false);
  const [
    testCertificatePasswordForRegistry,
    setTestCertificatePasswordForRegistry,
  ] = useState('');
  const [registeryCertificateOption, setRegisteryCertificateOption] =
    useState(false);
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
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(handleSchemaCheck(activeTab)),
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const formStateData = watch();
  const newRegistryDataFromWatch = {
    registry: formStateData?.registryName,
    url: formStateData?.registryUrl,
  };

  const selectedRegistryId = watch('registry');
  const selectedDefalutRegistryId = watch('default_registry');

  // Clear default registry if it's not in the selected registries
  useEffect(() => {
    if (selectedRegistryId && selectedDefalutRegistryId) {
      const isDefaultRegistryInSelected = selectedRegistryId.some(
        registry => registry?.value === selectedDefalutRegistryId
      );

      if (!isDefaultRegistryInSelected) {
        setValue('default_registry', '');
      }
    }
  }, [selectedRegistryId, selectedDefalutRegistryId, setValue]);

  const editClusterData = async () => {
    const selectedRegistriesId = formStateData?.registry?.map(
      item => item?.value
    );

    try {
      // Create FormData object
      const formData = new FormData();

      // Append data to FormData
      formData.append('name', clusterData?.clusterName || '');
      formData.append('nifi_url', clusterData?.nifiUrl || '');
      formData.append(
        'logs_url',
        isEmpty(clusterData?.logs_url) ? '' : clusterData?.logs_url
      );
      formData.append(
        'metrics_url',
        isEmpty(clusterData?.metrics_url) ? '' : clusterData?.metrics_url
      );

      // For arrays like tags, you can either stringify or append individually
      if (tags && Array.isArray(tags)) {
        formData.append('tag', JSON.stringify(tags));
      }

      formData.append(
        'notification_enable',
        notificationEnable ? 'true' : 'false'
      );
      formData.append('approver_enable', approverEnable ? 'true' : 'false');
      formData.append(
        'start_stop_requires_approval',
        approverEnableForStartAndStop ? 'true' : 'false'
      );
      formData.append(
        'change_request_enable',
        changeRequestEnable ? 'true' : 'false'
      );
      formData.append('registry_id', selectedRegistryId || '');
      formData.append('has_custom_service_account', 'false');
      formData.append(
        'is_certificate_based_service_account',
        certificateOption ? 'true' : 'false'
      );

      // Add certificate file and passphrase if present
      if (testCertificateFile) {
        formData.append('service_account_certificate', testCertificateFile);
      }
      if (testCertificatePassword) {
        formData.append(
          'service_account_certificate_password',
          testCertificatePassword
        );
      }

      // Add username and password if present
      if (editUsername) {
        formData.append('service_username', editUsername);
      }
      if (editPassword) {
        formData.append('service_password', editPassword);
      }
      if (selectedRegistriesId) {
        formData.append('registry_ids', selectedRegistriesId);
      }

      const id = clusterId;

      // Make sure your updateCluster function handles FormData
      const response = await updateCluster(id, formData);

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
  useEffect(() => {
    if (
      !isEmpty(clusterData?.clusterName) ||
      !isEmpty(clusterData?.nifiUrl) ||
      !isEmpty(clusterData?.metrics_url) ||
      !isEmpty(clusterData?.logs_url)
    ) {
      dispatch(ClustersActions.addEditClusterData(clusterData));
    }
  }, [clusterData]);

  const setClusterFormData = () => {
    reset({
      clusterName: clusterDataRedux?.clusterName,
      metrics_url: clusterDataRedux?.metrics_url || '',
      logs_url: clusterDataRedux?.logs_url || '',
      nifiUrl: clusterDataRedux?.nifiUrl,
    });
  };
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
      setClusterFormData();
    }
  };

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
        metrics_url !== clusterData.metrics_url ||
        testCertificateFile !== clusterData.service_account_certificate ||
        testCertificatePassword !==
          clusterData.service_account_certificate_password
      ) {
        setClusterData({
          clusterName: clusterName || '',
          nifiUrl: nifiUrl || '',
          metrics_url: metrics_url || '',
          logs_url: logs_url || '',
          service_account_certificate: testCertificateFile || '',
          service_account_certificate_password: testCertificatePassword || '',
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
          is_registry_authenticated: watchedFields?.[7] || true,
          service_account_certificate: testCertificateFileForRegistry || '',
          service_account_certificate_password:
            testCertificatePasswordForRegistry || '',
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
    testCertificateFile,
    testCertificatePassword,
    newRegistry,
    isEditDetails,
    data?.id,
    clusterData,
    registryData,
  ]);

  const selectedOptions =
    !isEmpty(registries) &&
    !isEmpty(data) &&
    registries
      ?.filter(item => data?.registry_ids.includes(item.value))
      .map(item => ({
        label: item.label,
        value: item.value,
      }));

  useEffect(() => {
    if (
      (data?.registry_ids && registries && selectedOptions) ||
      data?.created_by_ansible
    ) {
      reset({
        registry: selectedOptions || data?.registry_ids || [],
        clusterName: clusterData?.clusterName || data?.name,
        metrics_url: clusterData?.metrics_url || data?.metrics_url || '',
        logs_url: clusterData?.logs_url || data?.logs_url || '',
        nifiUrl: clusterData?.nifiUrl || data?.nifi_url,
        registryName: registryData?.name,
        registryUrl: registryData?.registry_url || '',
      });

      // Set default registry value using setValue
      if (data?.default_registry?.id) {
        setValue('default_registry', data?.default_registry?.id);
      }

      setClusterId(data?.id);

      // Check if it's a copy operation (data exists but no id)
      if (!data?.id && data?.name) {
        setIsCopyOperation(true);
      }
    }
  }, [activeTab, newRegistry, registries, data, setValue]);

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
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchRegistryDetails = async () => {
    try {
      const response = await getOneRegistry(
        selectedRegistryId?.[0]?.value || ''
      );
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
    // Check form validation errors for default_registry
    if (errors.default_registry) {
      toast.error(errors.default_registry.message);
      return;
    }

    // Validate that a default registry is selected
    if (!selectedDefalutRegistryId) {
      toast.error('Please select a default registry before continuing');
      return;
    }

    setIsCertificateOpen(false);
    setIsCredOpen(false);
    setTestSuccess(false);
    setTest(true);
    setOpenSummary(true);
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
        'is_registry_authenticated',
        registryData?.is_registry_authenticated
      );
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
      data?.change_request_enable === changeRequestEnable &&
      data?.start_stop_requires_approval === approverEnableForStartAndStop &&
      data?.is_certificate_based_service_account === certificateOption
    );
  };

  useEffect(() => {
    if (checkEditSave()) {
      setSaveButtonEnable(true);
    } else {
      setSaveButtonEnable(false);
    }
  }, [
    data,
    tags,
    approverEnable,
    notificationEnable,
    changeRequestEnable,
    approverEnableForStartAndStop,
    certificateOption,
  ]);
  // Also update the handleTitleProvider function to handle copy operation
  const handleTitleProvider = data => {
    if (data && location?.pathname === '/clusters/edit') {
      return `Edit ${isEditDetails ? 'Registry' : 'Cluster'} Details`;
    } else if (isCopyOperation) {
      return 'Add New Cluster Details';
    } else {
      return 'Add New Cluster Details';
    }
  };
  // Update the isRegistryDetailDisable function
  const isRegistryDetailDisable = () => {
    // For edit mode (existing cluster with ID)
    if (clusterId && !isCopyOperation) {
      return (
        watchedFields?.[1] !== data?.nifi_url ||
        watchedFields?.[0] !== data?.name ||
        !checkEditSave()
      );
    }

    // For copy operation or add new cluster
    if (isCopyOperation || (!clusterId && data)) {
      return (
        !watchedFields?.[0] || // clusterName is empty
        !watchedFields?.[1] || // nifiUrl is empty
        hasValidationErrors() || // has form validation errors
        !testSuccess // cluster test not successful
      );
    }

    // For completely new cluster (no data at all)
    return (
      !watchedFields?.[0] || // clusterName is empty
      !watchedFields?.[1] || // nifiUrl is empty
      hasValidationErrors() || // has form validation errors
      !testSuccess // cluster test not successful
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
    if (!isEmpty(data) && uploadFileatEditTime) {
      return false;
    }
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

  const handleNewRgistrySave = async () => {
    const formData = new FormData();

    formData.append('name', formStateData?.registryName || '');
    formData.append(
      'is_registry_authenticated',
      formStateData?.is_registry_authenticated
    );
    formData.append('registry_url', formStateData?.registryUrl || '');
    formData.append(
      'is_certificate_based_service_account',
      registeryCertificateOption
    );

    if (testCertificateFileForRegistry) {
      formData.append(
        'service_account_certificate',
        testCertificateFileForRegistry
      );
    }

    if (testCertificatePasswordForRegistry) {
      formData.append(
        'service_account_certificate_password',
        testCertificatePasswordForRegistry
      );
    }

    const response = await createRegistry(formData); // Make sure your API expects FormData

    if (response?.status === 201) {
      fetchRegistry();
    } else {
      toast.error(response.message);
    }

    handleBack();
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
          setClusterFormData={setClusterFormData}
          certificateOption={certificateOption}
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
              setApproverEnableForStartAndStop={
                setApproverEnableForStartAndStop
              }
              changeRequestEnable={changeRequestEnable}
              notificationEnable={notificationEnable}
              approverEnableForStartAndStop={approverEnableForStartAndStop}
              certificateOption={certificateOption}
              setCertificateOption={setCertificateOption}
              data={data}
            />
            {
              <ClusterTestSection
                test={test}
                certificateOption={certificateOption}
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
            }
            {testSuccess && !successModal && !certificateOption && (
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
            <div className="w-100 mb-4 row">
              <div className="col-lg-8">
                <LabelSelect>Select Registry</LabelSelect>
                <RegistryMultiSelect
                  enableCheckboxes
                  control={control}
                  name="registry"
                  placeholder={'Select Registry'}
                  options={registries}
                />
              </div>
              <div className="col-lg-4">
                <SelectField
                  label="Default Registry"
                  name="default_registry"
                  control={control}
                  // icon={<LogDocumentIcon color="#444445" />}
                  errors={errors}
                  options={selectedRegistryId}
                  placeholder="Select Default Registry"
                  required={true}
                />
              </div>
            </div>
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
              isCertificateUser={certificateOption}
              registeryCertificateOption={registeryCertificateOption}
              setRegisteryCertificateOption={setRegisteryCertificateOption}
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
          {showSubmitButtonOnCluster() &&
            !(activeTab === CLUSTER_MODULE_TABS.REGISTRY && newRegistry) && (
              <Button onClick={handleSubmit(onSubmit)} disabled={isDisabled()}>
                {giveSubmitButtonText()}
              </Button>
            )}
          {showRegistryContiueButton() &&
            !(activeTab === CLUSTER_MODULE_TABS.REGISTRY && newRegistry) && (
              <Button
                id="registry-details-continue-btn"
                onClick={handleRegistry}
                disabled={
                  isCopyOperation
                    ? false
                    : !isEmpty(data)
                      ? JSON.stringify(data?.registry_ids?.sort()) ===
                          JSON.stringify(
                            selectedRegistryId?.map(item => item?.value).sort()
                          ) &&
                        selectedDefalutRegistryId === data?.default_registry?.id
                      : isEmpty(selectedRegistryId) ||
                        !selectedDefalutRegistryId
                }
              >
                {KDFM.CONTINUE}
              </Button>
            )}
          {activeTab === CLUSTER_MODULE_TABS.REGISTRY && newRegistry && (
            <Button
              id="registry-details-continue-btn"
              onClick={handleNewRgistrySave}
              disabled={isDisabled()}
            >
              {KDFM.SAVE}
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
        setTestCertificateFile={setTestCertificateFile}
        setTestCertificatePassword={setTestCertificatePassword}
        setTestCertificatePasswordForRegistry={
          setTestCertificatePasswordForRegistry
        }
        setTestCertificateFileForRegistry={setTestCertificateFileForRegistry}
        data={data}
        setUploadFileatEditTime={setUploadFileatEditTime}
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
        newregistryData={newRegistryDataFromWatch}
        // Pass setters for username and password
        setEditUsername={setEditUsername}
        setEditPassword={setEditPassword}
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
        approverEnableForStartAndStop={approverEnableForStartAndStop}
        tags={tags}
        certificateOption={certificateOption}
        selectedRegistriesArray={formStateData?.registry}
        default_registry_data={selectedDefalutRegistryId}
        registries={registries}
      />
      {successModal && (
        <SuccessTestModal
          successTest={successModal}
          setSuccessTest={setSuccessModal}
          name={`${activeTab} test Successful`}
          text="Your configuration test was successful.
           Continue with the next steps."
          title="Testing Successful"
          activeTab={activeTab}
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
