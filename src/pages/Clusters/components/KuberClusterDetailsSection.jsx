/*eslint-disable*/
import React, { useEffect, useMemo, useState } from 'react';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import styled from 'styled-components';
import { Button, InputField, SelectField } from '../../../shared';
import { KDFM } from '../../../constants';
import { QRIcons } from '../../../assets';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty, uniqBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { a } from '@table-library/react-table-library/index-6891a60a';
import PemUploadField from '../PEMUploadFile';
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
const UploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #ff7a00;
  margin-bottom: 12px;
  padding: 5px 12px;
  background-color: white;
  font-weight: bold;
  border: 1px solid #ff7a00;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: rgb(253, 250, 245);
  }
`;
const KubeClusterDetailsSection = ({ activeTab }) => {
  const dispatch = useDispatch();
  const [formSchemaCluster, setFormSchemaCluster] = useState('eks');
  const kubeConfigList = useSelector(
    ClustersSelectors.getlistConfigListKubernetes
  );
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);

  const hostOptions = listHostIpData
    ?.filter(ele => !ele?.is_selected)
    ?.map(ele => ({
      label: ele?.kube_cluster_name,
      value: ele?.id,
    }));

  const configOptionsUnsorted = kubeConfigList
    ?.filter(ele => !ele?.is_part_of_cluster)
    ?.map(ele => ({ label: ele?.config_name, value: ele?.config_name }));
  const configOptions = uniqBy(configOptionsUnsorted, 'value');
  const configVerionsList = useSelector(ClustersSelectors.getkubConfigVersion);
  const configVersionOption =
    (!isEmpty(configVerionsList) &&
      configVerionsList?.map(ele => ({
        label: ele?.config_version.toString(),
        value: ele?.config_version,
      }))) ||
    []; //

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
  });
  let schemaForm = formSchemaCluster === 'eks' ? schemaEKS : schemaEC2;
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
    defaultValues: { cluster_type: 'eks' },
  });
  const configNameValue = watch('configName');
  const clusterType = watch('cluster_type');

  const schemaCluster = useMemo(() => clusterType, [clusterType]);

  useEffect(() => {
    setFormSchemaCluster(schemaCluster);
  }, [schemaCluster, setFormSchemaCluster]);
  useEffect(() => {
    dispatch(ClustersActions.fetchConfigListForKubernetes());
    dispatch(ClustersActions.fetchMasterHostNodesList());
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
    payload.append('host', data?.host);
    if (formSchemaCluster === 'eks') {
      payload.append('aws_region', data?.aws_region);
      payload.append('aws_access_key_id', data?.aws_access_key_id);
      payload.append('aws_secret_access_key', data?.aws_secret_access_key);
      payload.append('aws_session_token', data?.aws_session_token);
    }
    if (formSchemaCluster === 'ec2') {
      payload.append('ec2_bastion_host', data?.ec2_bastion_host);
      payload.append('ec2_ssh_username', data?.ec2_ssh_username);
      payload.append('ec2_local_forward_port', data?.ec2_local_forward_port);
      payload.append('ec2_ssh_pem_file', data?.ec2_ssh_pem_file);
    }

    dispatch(ClustersActions.createKubernetesCluster(payload));
  };

  //
  return (
    <>
      <Title title={'Create Cluster'} />
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
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <LabelSelect className="mb-3">
                Kubernetes Cluster Name <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="host"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={hostOptions || []}
                placeholder={'Select Kubernetes Cluster Name'}
                required={true}
              />
            </div>
            <div className="col-6">
              <LabelSelect className="mb-3">
                {KDFM.CONFIG_NAME} <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="configName"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={configOptions || []}
                placeholder={KDFM.SELECT_CONFIG_NAME}
                required={true}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <LabelSelect className="mb-3">
                {KDFM.CONFIG_VERSION} <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="configVersion"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={configVersionOption || []}
                placeholder={KDFM.SELECT_CONFIG_VERSION}
                required={true}
              />
            </div>
            <div className="col-6">
              <LabelSelect className="mb-3">Cluster Type</LabelSelect>
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
                  ] || []
                }
                placeholder={KDFM.SELECT_CONFIG_VERSION}
                required={true}
              />
            </div>
          </div>
          {clusterType === 'eks' && (
            <>
              {' '}
              <div className="row mt-3">
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    AWS Region <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="aws_region"
                    type="text"
                    placeholder={'Enter AWS Region'}
                    required={true}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                  />
                </div>
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    AWS Access Key Id <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="aws_access_key_id"
                    type="text"
                    placeholder="Enter AWS Access Key Id"
                    required={true}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    AWS Secret Access Key{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="aws_secret_access_key"
                    type="text"
                    placeholder="Enter AWS Secret Access Key"
                    required={true}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                  />
                </div>
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    AWS Session Token <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="aws_session_token"
                    type="text"
                    placeholder={'Enter AWS Session Token'}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                    required={true}
                  />
                </div>
              </div>
            </>
          )}
          {clusterType === 'ec2' && (
            <>
              {' '}
              <div className="row mt-3">
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    Bastion Host (Public IP / DNS){' '}
                    <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="ec2_bastion_host"
                    type="text"
                    placeholder={'Enter Bastion Host'}
                    required={true}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                  />
                </div>
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    SSH User <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="ec2_ssh_username"
                    type="text"
                    placeholder="Enter SSH User"
                    required={true}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <LabelSelect className="mb-3">
                    Local Forward Port <span style={{ color: 'red' }}>*</span>
                  </LabelSelect>
                  <InputField
                    name="ec2_local_forward_port"
                    type="text"
                    placeholder="Enter Local Forward Port"
                    required={true}
                    register={register}
                    errors={errors}
                    icon={<QRIcons />}
                  />
                </div>
                <div className="col-6">
                  {/* <LabelSelect className="mb-3"> */}
                  <PemUploadField
                    name="ec2_ssh_pem_file"
                    watch={watch}
                    control={control}
                    required
                    rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                    placeholder="Upload kubernetes config file"
                    errors={errors}
                    fileLable="File"
                    validExtensionsArray={[
                      //   '.pem',
                      //   '.pfx',
                      //   '.p12',
                      //   '.jks',
                      '.txt',
                      '.yaml',
                      '.yml',
                    ]}
                    acceptString={'.txt,.yaml,.yml'}
                    errorText={'YAML or PFX'}
                    label="Kubernetes config file"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" type="button" onClick={() => {}}>
            {KDFM.BACK}
          </Button>

          <Button type="submit" onClick={handleSubmit(handleCreateCluster)}>
            Create Cluster
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </>
  );
};
export default KubeClusterDetailsSection;
