/*eslint-disable*/
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  LinkIcon,
  NoDataIcon,
  PlusCircleIcon,
  QRIcons,
  RightCircleIcon,
  TagIcon,
} from '../../assets';
import { CLUSTER_MODULE_TABS, KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, CheckboxField, InputField, SelectField } from '../../shared';
import CopyToClipboard from '../../shared/CopyToClipboard';
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
  cursor: ${({ disabled }) =>
    disabled ? 'not-allowed !important' : 'pointer !important'};
  opacity: ${({ disabled }) => (disabled ? '0.5 !important' : '1')};
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
const CheckBoxFlex = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
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
  max-width: 100%;
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

const TagsInputContainer = styled.div`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 0.5em 0.5em 0.5em 56px;
  border-radius: 3px;
  width: 100%;
  font-size: 14px;
  color: #444445;
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 40px;
  input::placeholder {
    color: ${props => props.theme.colors.grey};
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
  }
  input:focus-visible {
    outline: none;
  }
  input:focus {
    border: none;
  }
`;
const IconTag = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  z-index: 1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
`;
const TagItem = styled.div`
  background-color: rgb(218, 216, 216);
  display: flex;
  padding: 0.5em 0.75em;
  border-radius: 20px;
`;
const CloseButton = styled.span`
  padding-top: 3px;
  height: 20px;
  width: 20px;
  background-color: rgb(48, 48, 48);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 18px;
  cursor: pointer;
`;
const TagsInput = styled.input`
  flex-grow: 1;
  padding: 0.5em 0;
  border: none;
  outline: none;
`;
const CharacterCount = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
`;

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
  const filteredGridData = gridData.filter(item => {
    return item?.nifi_url !== data?.nifi_url;
  });

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
            reg => reg.name.toLowerCase() === value.toLowerCase()
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
          reg => reg.nifi_url === value || reg.nifi_url + '/nifi' === value
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
            reg => reg.label.toLowerCase() === value.toLowerCase()
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
          return !registries?.some(reg => reg.registry_url === value);
        }
      ),
  });

  useEffect(() => {
    if (clusterData) {
      dispatch(ClustersActions.addEditClusterData(clusterData));
    }
  }, [clusterData]);

  const [registryData, setRegistryData] = useState({
    registryName: '',
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
  const sortRegisrtyURL = registries?.map(ele => ele?.registry_url);
  const registryURLs =
    useSelector(ClustersSelectors.getClusterFormData) || sortRegisrtyURL;

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

  const editClusterData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
      toast.error(response.message);
    }
  };

  const onSubmit = data => {
    if (clusterId) {
      editClusterData();
      history.push('/clusters');
    } else {
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
        if (registryURLs?.data?.includes(new URL(data?.registryUrl)?.origin)) {
          setOpenSummary(true);
        } else {
          toast.error('This registry do not  exist!');
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
  useEffect(() => {
    const clusterName = watchedFields?.[0];
    const logs_url = watchedFields?.[3];
    const nifiUrl = watchedFields?.[1];
    const metrics_url = watchedFields?.[2];
    const registryUrl = watchedFields?.[5];
    const registryName = watchedFields?.[4];
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
    watchedFields,
    clusterData,
    setClusterData,
    setRegistryData,
    setTest,
    activeTab,
  ]);
  useEffect(() => {
    if (data?.registry_id) {
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

  useEffect(() => {
    fetchRegistry();
  }, [activeTab]);

  useEffect(() => {
    if (selectedRegistryId) {
      fetchRegistryDetails(selectedRegistryId);
    }
  }, [registries, selectedRegistryId, activeTab, newRegistry]);

  const fetchRegistryDetails = async () => {
    try {
      const response = await getOneRegistry(selectedRegistryId);
      setRegistryData(response);
    } catch (error) {
      console.error('Failed to fetch registry details:', error);
    }
  };

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
        toast.error('Maximum 20 characters allowed');
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
    }
  }

  const handleBlur = () => {
    setInputValue('');
  };

  function removeTag(tagToRemove) {
    const currentTags = tags.split(',').filter(tag => tag);
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags.join(','));
  }
  const testData = async () => {
    setLoading(true);
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);

      const response = await testCluster(payload);
      if (response.status === 200) {
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

  const checkEditSave = () => {
    return (
      data?.tag === tags &&
      data?.approver_enable === approverEnable &&
      data?.notification_enable === notificationEnable
    );
  };

  useEffect(() => {
    if (checkEditSave()) {
      setSaveButtonEnable(true);
    } else {
      setSaveButtonEnable(false);
    }
  }, [data, tags, approverEnable, notificationEnable]);

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
            onClick={() => {
              setActiveTab(CLUSTER_MODULE_TABS.CLUSTER);
              setNewRegistry(false);
            }}
          >
            {KDFM.CLUSTER_DETAILS}
          </NavButton>
          <>
            <NavButton
              active={activeTab === CLUSTER_MODULE_TABS.REGISTRY}
              onClick={() =>
                Object.keys(data || {})?.length
                  ? setActiveTab(CLUSTER_MODULE_TABS.REGISTRY)
                  : {}
              }
              disabled={
                clusterId &&
                (watchedFields?.[1] !== data?.nifi_url ||
                  watchedFields?.[0] !== data?.name ||
                  !checkEditSave())
              }
              data-tooltip-id="navButtonTooltip"
            >
              {KDFM.REGISTRY_DETAILS}
            </NavButton>

            {clusterId &&
              (watchedFields?.[1] !== data?.nifi_url ||
                watchedFields?.[0] !== data?.name ||
                !checkEditSave()) && (
                <ReactTooltip
                  id="navButtonTooltip"
                  place="right"
                  effect="solid"
                  content="You have unsaved changes on Cluster Details"
                  style={{
                    whiteSpace: 'normal',
                    zIndex: 9999,
                  }}
                  event="focus"
                  eventOff="blur"
                />
              )}
          </>
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
            <InputField
              name="metrics_url"
              register={register}
              icon={<LinkIcon />}
              label={KDFM.METRICS_URL}
              placeholder={KDFM.ENTER_METRICS_URL}
              errors={errors}
            />
            <InputField
              name="logs_url"
              register={register}
              icon={<LinkIcon />}
              label={KDFM.LOGS_URL}
              placeholder={KDFM.ENTER_LOGS_URL}
              errors={errors}
            />
            <label htmlFor="tags-input" className="tags-input-label">
              Cluster Tags
            </label>
            <TagsInputContainer className="tags-input-container">
              <IconTag className="icon-placeholder">
                <TagIcon />
              </IconTag>
              {tags
                .split(',')
                .filter(tag => tag)
                .map((tag, index) => (
                  <TagItem className="tag-item" key={index}>
                    <CharacterCount className="text">
                      {tag.length > 10 ? `${tag.substring(0, 10)}...` : tag}
                    </CharacterCount>
                    <CloseButton
                      className="close"
                      role="button"
                      tabIndex={0}
                      onClick={() => removeTag(tag)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          removeTag(tag);
                        }
                      }}
                      aria-label={`Remove tag ${tag}`}
                    >
                      &times;
                    </CloseButton>
                  </TagItem>
                ))}

              <TagsInput
                type="text"
                value={inputValue}
                placeholder={
                  tags.split(',').filter(tag => tag).length === 0
                    ? 'Cluster Tags'
                    : ''
                }
                name="tags"
                {...register('tags')}
                onKeyDown={e => handleKeyDown(e)}
                onBlur={handleBlur}
                onChange={e => setInputValue(e.target.value)}
                aria-label="Add a tag"
              />

              {tags.split(',').filter(tag => tag).length >= 5 && (
                <p
                  className="mb-0"
                  style={{
                    color: 'red',
                    position: 'absolute',
                    bottom: '-25px',
                    left: '0px',
                  }}
                >
                  Tag limit reached (5 tags max)
                </p>
              )}
            </TagsInputContainer>

            <CheckBoxFlex>
              <CheckboxField
                name="check"
                label="Need approval for the deployment schedule?"
                checked={approverEnable}
                onChange={e => setApproverEnable(e.target.checked)}
              />
              <CheckboxField
                name="check"
                label="Do you want any notification for this cluster?"
                checked={notificationEnable}
                onChange={e => setNotificationEnable(e.target.checked)}
              />
            </CheckBoxFlex>

            <Flex>
              {test ? (
                <>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CERTIFICATE}</ButtonLabel>
                    <Button
                      onClick={() => setIsCertificateOpen(true)}
                      disabled={
                        testSuccess ||
                        !dataFill ||
                        checkDuplicate ||
                        checkDuplicateName ||
                        watchedFields?.[1] === data?.nifi_url
                      }
                    >
                      {KDFM.ADD_CERTIFICATE}
                    </Button>
                  </div>
                  <ORText>{KDFM.SEPARATOR}</ORText>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                    <Button
                      onClick={() => setIsCredOpen(true)}
                      disabled={
                        testSuccess ||
                        !dataFill ||
                        checkDuplicate ||
                        checkDuplicateName ||
                        watchedFields?.[1] === data?.nifi_url
                      }
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
                    // disabled={!isEditDetails}
                    loading={loading}
                  >
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
                      ? clusterId
                        ? KDFM.CLUSTER_TESTED_SUCCES
                        : KDFM.CLUSTER_TESTED_SUCCES_PROMPT
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
            {selectedRegistryId ? (
              <></>
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
                      disabled={
                        testSuccess ||
                        !dataFill ||
                        checkDuplicateRegistry ||
                        checkDuplicateRegistryName
                      }
                    >
                      {KDFM.ADD_CERTIFICATE}
                    </Button>
                  </div>
                  <ORText>OR</ORText>
                  <div>
                    <ButtonLabel>{KDFM.TEST_VIA_CREDENTIALS}</ButtonLabel>
                    <Button
                      onClick={() => setIsCredOpen(true)}
                      disabled={
                        testSuccess ||
                        !dataFill ||
                        checkDuplicateRegistry ||
                        checkDuplicateRegistryName
                      }
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
                  <RightCircleIcon width={60} height={60} />
                  <TextTest>
                    {activeTab === CLUSTER_MODULE_TABS.REGISTRY
                      ? KDFM.REGISTRY_TESTED_SUCCESS_PROMPT
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
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={
                Object.keys(errors).length > 0 ||
                (newRegistry
                  ? !testSuccess
                  : clusterId
                    ? (watchedFields?.[0] === data?.name &&
                        watchedFields?.[2] ===
                          (data?.metrics_url === null
                            ? ''
                            : data?.metrics_url) &&
                        watchedFields?.[3] ===
                          (data?.logs_url === null ? '' : data?.logs_url) &&
                        checkEditSave() &&
                        saveButtonEnable) ||
                      !test
                    : !testSuccess)
              }
            >
              {newRegistry
                ? KDFM.CONTINUE
                : clusterId
                  ? KDFM.SAVE
                  : KDFM.CONTINUE}
            </Button>
          )}
          {!newRegistry && activeTab === 'registry' && (
            <Button
              onClick={handleRegistry}
              // disabled={ !testSuccess}
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
        edit={clusterId ? true : false}
        notificationEnable={notificationEnable}
        approverEnable={approverEnable}
        tags={tags}
      />
      {suceessModal && (
        <SuccessTestModal
          successTest={suceessModal}
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
