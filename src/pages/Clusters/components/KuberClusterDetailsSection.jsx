import React, { useEffect, useMemo, useState } from 'react';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import styled from 'styled-components';
import {
  Button,
  CheckboxField,
  InputField,
  SelectField,
} from '../../../shared';
import { KDFM } from '../../../constants';
import { QRIcons } from '../../../assets';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty, uniqBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../../store';
import { FullPageLoader } from '../../../components';
import KubeClusterConfigDetailsModal from './KubeClusterConfigdetailsModal';
import { history } from '../../../helpers/history';
const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
// eslint-disable-next-line react/prop-types
const KubeClusterDetailsSection = ({ activeTab }) => {
  const dispatch = useDispatch();
  const [formSchemaCluster, setFormSchemaCluster] = useState('eks');
  const [openAddConfigModal, setOpenAddConfigModal] = useState(false);
  const [sshAdd, setShhAdd] = useState(false);
  const [aksSaveDb, setAksSaveDb] = useState(false);
  const kubeConfigList = useSelector(
    ClustersSelectors.getlistConfigListKubernetes
  );
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  const kubeClusterIDEdit = useSelector(
    ClustersSelectors.getansibleClucterToEdit
  );
  const kubeUpgradeData = useSelector(
    ClustersSelectors.getkubeClusterUpgradeData
  );

  const hostOptions = listHostIpData
    ?.filter(ele => !ele?.is_selected)
    ?.map(ele => ({
      label: ele?.kube_cluster_name,
      value: ele?.id,
    }));
  const hostOptionsOnUpgrade = listHostIpData?.map(ele => ({
    label: ele?.kube_cluster_name,
    value: ele?.id,
  }));

  const configOptionsUnsorted = kubeConfigList
    ?.filter(ele => !ele?.is_part_of_cluster)
    ?.map(ele => ({ label: ele?.config_name, value: ele?.config_name }));
  const allconfigOptionsUnsorted = kubeConfigList?.map(ele => ({
    label: ele?.config_name,
    value: ele?.config_name,
  }));
  const configOptions = uniqBy(configOptionsUnsorted, 'value');
  const configOptionsOnUpgrade = uniqBy(allconfigOptionsUnsorted, 'value');
  const configVerionsList = useSelector(ClustersSelectors.getkubConfigVersion);
  const lastVisit = useSelector(ClustersSelectors.getlastVisitedTab);
  const recentSelectedCluster = useSelector(
    ClustersSelectors.getrecentClusterSelected
  );
  const configVersionOption =
    (!isEmpty(configVerionsList) &&
      configVerionsList?.map(ele => ({
        label: ele?.config_version.toString(),
        value: ele?.config_version,
      }))) ||
    []; //
  const noSpaces = /^(\S.*\S|\S)$/;
  const schemaAKS = yup.object().shape({
    clusterName: yup
      .string()
      .required('Cluster name is required')
      .test(
        'no-leading-trailing-spaces',
        'Cluster name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Cluster name must contain only letters, numbers, underscores, or hyphens.'
      ),
    host: yup.string().required('Master Node is required'),
    configName: yup.string().required('Config name is required'),
    configVersion: yup.string().required('Config version is required'),
    tenantId: yup.string().required('Tenant ID is required'),
    clientId: yup.string().required('Client ID is required'),
    clientSecret: yup.string().required('Client Secret is required'),
    subscriptionId: yup.string().required('Subscription ID is required'),
    resourceGroup: yup.string().required('Resource Group is required'),
    nifi_namespace: yup
      .string()
      .required('NiFi namespace is required')
      .matches(
        noSpaces,
        'NiFi namespace must not contain leading or trailing spaces'
      ),
  });
  const schemaEKS = yup.object().shape({
    clusterName: yup
      .string()
      .required('Cluster name is required')
      .test(
        'no-leading-trailing-spaces',
        'Cluster name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Cluster name must contain only letters, numbers, underscores, or hyphens.'
      ),
    host: yup.string().required('Master Node is required'),
    configName: yup.string().required('Config name is required'),
    configVersion: yup.string().required('Config version is required'),
    aws_region: yup.string().required('AWS Region is required'),
    aws_access_key_id: yup.string().required('AWS Access Key Id is required'),
    aws_secret_access_key: yup
      .string()
      .required('AWS Secret Access Key is required'),
    aws_session_token: yup.string().required('AWS Session Token is required'),
    nifi_namespace: yup
      .string()
      .required('NiFi namespace is required')
      .matches(
        noSpaces,
        'NiFi namespace must not contain leading or trailing spaces'
      ),
  });
  const schemaEC2 = yup.object().shape({
    clusterName: yup
      .string()
      .required('Cluster name is required')
      .test(
        'no-leading-trailing-spaces',
        'Cluster name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Cluster name must contain only letters, numbers, underscores, or hyphens.'
      ),
    host: yup.string().required('Master Node is required'),
    configName: yup.string().required('Config name is required'),
    configVersion: yup.string().required('Config version is required'),
    ec2_bastion_host: yup.string().required('Host is required'),
    ec2_ssh_username: yup.string().required('Username is required'),
    ec2_local_forward_port: yup.string().required('Post is required'),
    ec2_ssh_pem_file: yup.mixed().required('File is required'),
    nifi_namespace: yup
      .string()
      .required('NiFi namespace is required')
      .matches(
        noSpaces,
        'NiFi namespace must not contain leading or trailing spaces'
      ),
  });
  const schemaEC2withoutSSH = yup.object().shape({
    clusterName: yup
      .string()
      .required('Cluster name is required')
      .test(
        'no-leading-trailing-spaces',
        'Cluster name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Cluster name must contain only letters, numbers, underscores, or hyphens.'
      ),
    host: yup.string().required('Master Node is required'),
    configName: yup.string().required('Config name is required'),
    configVersion: yup.string().required('Config version is required'),
    nifi_namespace: yup
      .string()
      .required('NiFi namespace is required')
      .matches(
        noSpaces,
        'NiFi namespace must not contain leading or trailing spaces'
      ),
  });
  const schemaUpgradeEC2 = yup.object().shape({
    clusterName: yup
      .string()
      .required('Cluster name is required')
      .test(
        'no-leading-trailing-spaces',
        'Cluster name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Cluster name must contain only letters, numbers, underscores, or hyphens.'
      ),
    host: yup.string().required('Master Node is required'),
    configName: yup.string().required('Config name is required'),
    configVersion: yup.string().required('Config version is required'),
  });
  let schemaForm =
    formSchemaCluster === 'aks'
      ? schemaAKS
      : formSchemaCluster === 'eks'
        ? schemaEKS
        : isEmpty(kubeUpgradeData) && !sshAdd
          ? schemaEC2withoutSSH
          : isEmpty(kubeUpgradeData) && sshAdd
            ? schemaEC2
            : schemaUpgradeEC2;
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schemaForm),
    defaultValues: { cluster_type: 'aks', nifi_namespace: 'nifi' },
  });
  const configNameValue = watch('configName');
  const clusterType = watch('cluster_type');
  const kubeClusterConfig = watch('host');
  const clusterNameValue = watch('clusterName');
  const configVersionValue = watch('configVersion');
  const nifiNamespaceName = watch('nifi_namespace');
  const schemaCluster = useMemo(() => clusterType, [clusterType]);
  const loggedInCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  useEffect(() => {
    setFormSchemaCluster(schemaCluster);
  }, [schemaCluster, setFormSchemaCluster]);
  useEffect(() => {
    dispatch(ClustersActions.fetchConfigListForKubernetes());
    dispatch(ClustersActions.fetchMasterHostNodesList());
    dispatch(ClustersActions.setAzureTestPassed(false));
    return () => {
      dispatch(ClustersActions.setkubConfigVersion({}));
    };
  }, [dispatch]);
  useEffect(() => {
    if (!isEmpty(configNameValue)) {
      dispatch(
        ClustersActions.fetchConfigVersionsPerConfig({
          config_name: configNameValue,
        })
      );
    }
  }, [configNameValue]);
  const handleCreateCluster = data => {
    const payload = new FormData();
    payload.append('clusterName', data?.clusterName);
    payload.append('configName', data?.configName);
    payload.append('configVersion', data?.configVersion);
    payload.append('cluster_type', data?.cluster_type);
    payload.append(
      'operationType',
      !isEmpty(kubeClusterIDEdit) ? 'upgrade' : 'create'
    );
    payload.append('host', data?.host);
    payload.append('nifi_namespace', data?.nifi_namespace);
    if (formSchemaCluster === 'eks') {
      payload.append('aws_region', data?.aws_region);
      payload.append('aws_access_key_id', data?.aws_access_key_id);
      payload.append('aws_secret_access_key', data?.aws_secret_access_key);
      payload.append('aws_session_token', data?.aws_session_token);
    }
    if (formSchemaCluster === 'ec2' && isEmpty(kubeUpgradeData) && sshAdd) {
      payload.append('ec2_bastion_host', data?.ec2_bastion_host);
      payload.append('ec2_ssh_username', data?.ec2_ssh_username);
      payload.append('ec2_local_forward_port', data?.ec2_local_forward_port);

      payload.append('ec2_ssh_pem_file', data?.ec2_ssh_pem_file);
      payload.append('useSsh', true);
    }
    if (formSchemaCluster === 'ec2' && isEmpty(kubeUpgradeData) && !sshAdd) {
      payload.append('useSsh', false);
    }
    if (formSchemaCluster === 'aks') {
      payload.append('tenantId', data?.tenantId);
      payload.append('clientId', data?.clientId);
      payload.append('clientSecret', data?.clientSecret);
      payload.append('subscriptionId', data?.subscriptionId);
      payload.append('resourceGroup', data?.resourceGroup);
      payload.append('saveInDb', aksSaveDb);
      payload.append('useSsh', false);
    }

    dispatch(ClustersActions.createKubernetesCluster(payload));
    if (loggedInCluster?.value == kubeClusterIDEdit) {
      dispatch(
        NamespacesActions.setSelectedCluster({
          label: '',
          value: '',
        })
      );
      localStorage.removeItem('selected_cluster');
    }
  };
  useEffect(() => {
    if (!isEmpty(kubeClusterIDEdit)) {
      dispatch(
        ClustersActions.fetchKubeClusterDataToUpgrade({ id: kubeClusterIDEdit })
      );
    }
  }, [kubeClusterIDEdit]);
  useEffect(() => {
    if (!isEmpty(kubeUpgradeData) && !isEmpty(kubeClusterIDEdit)) {
      setValue('clusterName', kubeUpgradeData?.name);
      setValue('host', kubeUpgradeData?.master_node?.id);
      setValue('configName', kubeUpgradeData?.config_name);
      setValue('configVersion', kubeUpgradeData?.config_version);
      setValue('cluster_type', kubeUpgradeData?.cluster_type);
      setValue('nifi_namespace', kubeUpgradeData?.nifi_namespace);
    }
  }, [kubeUpgradeData]);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchKubeClusterDataToUpgrade')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'testAzureConfig')
  );
  const onError = errors => {
    if (
      errors?.ec2_bastion_host ||
      errors?.ec2_local_forward_port ||
      errors?.ec2_ssh_username ||
      errors?.aws_access_key_id ||
      errors?.aws_region ||
      errors?.aws_secret_access_key ||
      errors?.aws_session_token ||
      errors?.ec2_ssh_pem_file ||
      errors?.clientId ||
      errors?.clientSecret ||
      errors?.resourceGroup ||
      errors?.subscriptionId ||
      errors?.tenantId
    ) {
      return;
    }

    if (isEmpty(errors)) {
      handleSubmit(handleCreateCluster)();
    } else {
      setOpenAddConfigModal(false);
    }
  };
  useEffect(() => {
    if (
      !isEmpty(configOptions) &&
      configOptions.length === 1 &&
      isEmpty(kubeClusterIDEdit) &&
      isEmpty(configNameValue)
    ) {
      setValue('configName', configOptions?.[0]?.value);
    }
  }, [configOptions]);
  useEffect(() => {
    if (
      !isEmpty(configVersionOption) &&
      configVersionOption.length === 1 &&
      isEmpty(kubeClusterIDEdit) &&
      !configVersionValue
    ) {
      setValue('configVersion', configVersionOption?.[0]?.value);
    }
  }, [configVersionOption]);

  useEffect(() => {
    if (
      !isEmpty(hostOptions) &&
      hostOptions.length === 1 &&
      isEmpty(kubeClusterIDEdit) &&
      !kubeClusterConfig
    ) {
      setValue('host', hostOptions?.[0]?.value);
    }
  }, [hostOptions]);

  const handleSubmitClick = () => {
    if (clusterType === 'eks' || clusterType === 'aks') {
      setOpenAddConfigModal(true);
    } else {
      // Kube cluster create and upgrade
      if (sshAdd) {
        setOpenAddConfigModal(true);
      } else {
        handleSubmit(handleCreateCluster)();
      }
    }
  };
  useEffect(() => {
    if (!isEmpty(recentSelectedCluster) && isEmpty(kubeClusterIDEdit)) {
      setValue('cluster_type', recentSelectedCluster);
    }
  }, [recentSelectedCluster]);
  return (
    <>
      <Title
        title={!isEmpty(kubeClusterIDEdit) ? 'Edit Cluster' : 'Create Cluster'}
      />
      <FullPageLoader loading={loading || loading2} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <div className="mt-3 ms-3 me-3">
          {' '}
          <div className="row">
            <div className="col-12">
              <LabelSelect className="mb-3">
                NiFi Cluster Name <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <InputField
                name="clusterName"
                type="text"
                placeholder="Enter your NiFi cluster name"
                required={true}
                register={register}
                errors={errors}
                icon={<QRIcons />}
                disabled={!isEmpty(kubeClusterIDEdit)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <LabelSelect className="mb-3">
                Kubernetes Cluster <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="host"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={
                  !isEmpty(kubeClusterIDEdit)
                    ? hostOptionsOnUpgrade || []
                    : hostOptions || []
                }
                placeholder={'Select Kubernetes Cluster'}
                required={true}
                disabled={!isEmpty(kubeClusterIDEdit)}
              />
            </div>
            <div className="col-6">
              <LabelSelect className="mb-3">
                NiFi Configuration <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="configName"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={
                  !isEmpty(kubeClusterIDEdit)
                    ? configOptionsOnUpgrade || []
                    : configOptions || []
                }
                placeholder="Select NiFi Configuration"
                required={true}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <LabelSelect className="mb-3">
                NiFi Configuration Version
                <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="configVersion"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={configVersionOption || []}
                placeholder={'Select NiFi Configuration Version'}
                required={true}
                sortAlphabetically={false}
              />
            </div>
            <div className="col-6">
              <LabelSelect className="mb-3">
                Kubernetes cluster type
              </LabelSelect>
              <SelectField
                name="cluster_type"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={
                  [
                    { label: 'Amazon EKS', value: 'eks' },
                    {
                      label: 'Self-Managed Kubernetes',
                      value: 'ec2',
                    },
                    {
                      label: 'Azure Kubernetes Service',
                      value: 'aks',
                    },
                  ] || []
                }
                placeholder={KDFM.SELECT_CONFIG_VERSION}
                required={true}
                disabled={!isEmpty(kubeClusterIDEdit)}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <LabelSelect className="mb-3">
                NiFi Cluster Namespace <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <InputField
                name="nifi_namespace"
                type="text"
                placeholder="Enter NiFi cluster namespace"
                required={true}
                register={register}
                errors={errors}
                icon={<QRIcons />}
                disabled={!isEmpty(kubeClusterIDEdit)}
              />
            </div>
            <div className="col-6 d-flex align-items-center">
              {clusterType === 'ec2' && isEmpty(kubeUpgradeData) && (
                <CheckboxField
                  name="check"
                  label="Do you want to add Kubernetes Admin Jumpbox?"
                  checked={sshAdd}
                  onChange={e => setShhAdd(e.target.checked)}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              if (lastVisit === 'cluster') {
                history.push(`/clusters`);
              } else {
                dispatch(ClustersActions.setActiveTabClusterSetup(lastVisit));
              }
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            // onClick={handleSubmit(handleCreateCluster, onError)}
            disabled={
              isEmpty(clusterNameValue?.trim()) ||
              isEmpty(kubeClusterConfig) ||
              isEmpty(configNameValue) ||
              !(
                configVersionValue !== null &&
                configVersionValue !== undefined &&
                !isNaN(configVersionValue)
              ) ||
              isEmpty(nifiNamespaceName?.trim())
            }
            // onClick={() => setOpenAddConfigModal(true)}
            // onClick={handleSubmit(handleCreateCluster)}
            onClick={handleSubmitClick}
          >
            {!isEmpty(kubeClusterIDEdit) ? 'Upgrade Cluster' : 'Create Cluster'}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <KubeClusterConfigDetailsModal
        register={register}
        errors={errors}
        openAddConfigModal={openAddConfigModal}
        setOpenAddConfigModal={setOpenAddConfigModal}
        clusterType={clusterType}
        control={control}
        watch={watch}
        handleCreateCluster={handleCreateCluster}
        handleSubmit={handleSubmit}
        reset={reset}
        kubeClusterIDEdit={kubeClusterIDEdit}
        onError={onError}
        aksSaveDb={aksSaveDb}
        setAksSaveDb={setAksSaveDb}
      />
    </>
  );
};
export default KubeClusterDetailsSection;
