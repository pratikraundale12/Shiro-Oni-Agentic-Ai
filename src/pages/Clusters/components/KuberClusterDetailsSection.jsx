/*eslint-disable*/
import React, { useEffect } from 'react';
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
const KubeClusterDetailsSection = ({ activeTab }) => {
  const dispatch = useDispatch();
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

  const schema = yup.object().shape({
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

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const configNameValue = watch('configName');

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
  console.log(watch());

  const handleCreateCluster = data => {
    dispatch(ClustersActions.createKubernetesCluster(data));
  };

  //
  return (
    <>
      <Title title={'Create Cluster'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <div className="mt-3 ms-3 me-3">
          {' '}
          <div className="col-6">
            <LabelSelect className="mb-3">
              {KDFM.CLUSTER_NAME} <span style={{ color: 'red' }}>*</span>
            </LabelSelect>
            <InputField
              name="clusterName"
              type="text"
              placeholder={KDFM.ENTER_YOUR_CLUSTER_NAME}
              required={true}
              register={register}
              errors={errors}
              icon={<QRIcons />}
              // disabled={
              //   !isEmpty(clusterIdForAnsible) ||
              //   !isEmpty(nodesUpdateAnsbibleClusterId)
              // }
            />
          </div>
          <div className="row">
            <div className="col-4">
              <LabelSelect className="mb-3">
                Master Node <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="host"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={hostOptions || []}
                placeholder={'Select Master Node'}
                required={true}
                // onChange={handleNiFiVersionChange}
                // disabled={!isEmpty(nodesUpdateAnsbibleClusterId)}
              />
            </div>
            <div className="col-4">
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
            <div className="col-4">
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
          </div>
          {/* <div className="row mt-3">
            <div className="col-4">
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
                // disabled={
                //   !isEmpty(clusterIdForAnsible) ||
                //   !isEmpty(nodesUpdateAnsbibleClusterId)
                // }
              />
            </div>
            <div className="col-4">
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
                // disabled={
                //   !isEmpty(clusterIdForAnsible) ||
                //   !isEmpty(nodesUpdateAnsbibleClusterId)
                // }
              />
            </div>
            <div className="col-4">
              <LabelSelect className="mb-3">
                AWS Secret Access Key <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <InputField
                name="aws_secret_access_key"
                type="text"
                placeholder="Enter AWS Secret Access Key"
                required={true}
                register={register}
                errors={errors}
                icon={<QRIcons />}
                // disabled={
                //   !isEmpty(clusterIdForAnsible) ||
                //   !isEmpty(nodesUpdateAnsbibleClusterId)
                // }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
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
                // disabled={
                //   !isEmpty(clusterIdForAnsible) ||
                //   !isEmpty(nodesUpdateAnsbibleClusterId)
                // }
              />
            </div>
            <div className="col-4">
              <LabelSelect className="mb-3">NiFi Namespace</LabelSelect>
              <InputField
                name="nifi_namespace"
                type="text"
                placeholder="Enter NiFi Namespace"
                register={register}
                errors={errors}
                icon={<QRIcons />}

                // disabled={
                //   !isEmpty(clusterIdForAnsible) ||
                //   !isEmpty(nodesUpdateAnsbibleClusterId)
                // }
              />
            </div>
          </div> */}
        </div>
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" type="button" onClick={() => {}}>
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={handleSubmit(handleCreateCluster)}
            // disabled={
            // }
          >
            Create Cluster
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </>
  );
};
export default KubeClusterDetailsSection;
