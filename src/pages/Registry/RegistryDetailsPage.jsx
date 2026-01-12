/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField } from '../../shared';
import { Title } from '../Clusters/components/Title';
import ClusterSetupNavigationTab from '../Clusters/components/ClusterSetupNavigationTab';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';
import RegistryNavigationTab from './RegistryNavigationTab';
import { QRIcons } from '../../assets';
import { useForm } from 'react-hook-form';
import { isEmpty, uniqBy } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RegistryCreateUpgradeCredsModal from './RegistryCredsModal';
import { FullPageLoader } from '../../components';

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
const RegistryDetailsPage = ({ activeTab }) => {
  const dispatch = useDispatch();
  const [openAddConfigModal, setOpenAddConfigModal] = useState(false);
  const kubeConfigurationList = useSelector(ClustersSelectors.getHostIpList);
  const registryConfigurationList = useSelector(
    RegistrySelectors.getRegistryConfigurationsList
  );
  const registryConfigVersionList = useSelector(
    RegistrySelectors.getregistryConfigVerions
  );

  //
  // const kubeConfigurationOptions = kubeConfigurationList?.map(ele => ({
  //   label: ele?.kube_cluster_name,
  //   value: ele?.id,
  // }));
  const kubeConfigurationOptions = useMemo(() => {
    return (
      kubeConfigurationList?.map(ele => ({
        label: ele?.kube_cluster_name,
        value: ele?.id,
      })) || []
    );
  }, [kubeConfigurationList]);
  // const registryConfigurationOptions = registryConfigurationList?.map(ele => ({
  //   label: ele?.config_name,
  //   value: ele?.id,
  // }));
  const registryConfigurationVersionsOptions = registryConfigVersionList?.map(
    ele => ({
      label: ele?.config_version.toString(),
      value: ele?.id,
    })
  );

  // const registryConfigurationOptionsUniques = uniqBy(
  //   registryConfigurationOptions,
  //   'label'
  // );
  const registryConfigurationOptionsUniques = useMemo(() => {
    const options = registryConfigurationList?.map(ele => ({
      label: ele?.config_name,
      value: ele?.id,
    }));
    return uniqBy(options, 'label');
  }, [registryConfigurationList]);

  const noSpaces = /^(\S.*\S|\S)$/;
  const schemaAKS = yup.object().shape({
    registryName: yup
      .string()
      .required('Registry name is required')
      .test(
        'no-leading-trailing-spaces',
        'Registry name must not start or end with a space.',
        value => value === value?.trim()
      )
      .matches(
        /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/,
        'Registry name must contain only letters, numbers, underscores, or hyphens.'
      ),
    kubeConfigId: yup.string().required('Kubernetes configuration is required'),
    registryConfigId: yup.string().required('Config version is required'),
    registryConfigs: yup.string().required('Config name is required'),
    // configVersion: yup.string().required('Config version is required'),
    // tenantId: yup.string().required('Tenant ID is required'),
    // clientId: yup.string().required('Client ID is required'),
    // clientSecret: yup.string().required('Client Secret is required'),
    // subscriptionId: yup.string().required('Subscription ID is required'),
    // resourceGroup: yup.string().required('Resource Group is required'),
    nifiNamespace: yup
      .string()
      .required('NiFi namespace is required')
      .matches(
        noSpaces,
        'NiFi namespace must not contain leading or trailing spaces'
      ),
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
    resolver: yupResolver(schemaAKS),
    defaultValues: { registryType: 'aks', nifi_namespace: 'nifi' },
  });

  const registryName = watch('registryName');
  const kubeConfig = watch('kubeConfigId');
  const registryConfig = watch('registryConfigs');
  const registryConfigVersion = watch('registryConfigId');
  const registryType = watch('registryType');
  const nifiNamespace = watch('nifiNamespace');

  useEffect(() => {
    if (
      !isEmpty(kubeConfigurationOptions) &&
      kubeConfigurationOptions.length === 1
    ) {
      setValue('kubeConfigId', kubeConfigurationOptions?.[0]?.value);
    }
  }, [kubeConfigurationOptions]);

  useEffect(() => {
    if (
      !isEmpty(registryConfigurationOptionsUniques) &&
      registryConfigurationOptionsUniques.length === 1
    ) {
      setValue(
        'registryConfigs',
        registryConfigurationOptionsUniques?.[0]?.value
      );
    }
  }, [registryConfigurationOptionsUniques?.length]);

  useEffect(() => {
    if (
      !isEmpty(registryConfigurationVersionsOptions) &&
      registryConfigurationVersionsOptions?.length === 1
    ) {
      setValue(
        'registryConfigId',
        registryConfigurationVersionsOptions?.[0]?.value
      );
    }
  }, [registryConfigurationVersionsOptions?.length]);

  const createBtnDisbaled =
    isEmpty(registryName) ||
    isEmpty(kubeConfig) ||
    isEmpty(registryConfig) ||
    isEmpty(registryConfigVersion) ||
    isEmpty(registryType) ||
    isEmpty(nifiNamespace);

  useEffect(() => {
    if (!isEmpty(registryConfig)) {
      const selectedConfig = registryConfigurationOptionsUniques.filter(
        ele => ele?.value === registryConfig
      );
      if (selectedConfig?.[0]?.label) {
        dispatch(
          RegistryActions.fetchRegistryConfigVersions(
            selectedConfig?.[0]?.label
          )
        );
      }
    }
  }, [registryConfig]);

  const handleSubmitCreate = () => {
    setOpenAddConfigModal(true);
  };
  const handleCreateRegistry = data => {
    dispatch(RegistryActions.createRegistryViaKube(data));
    //
  };
  useEffect(() => {
    dispatch(ClustersActions.fetchMasterHostNodesList());
    dispatch(RegistryActions.fetchRegistryConfigurationList());
    return () => {
      dispatch(RegistryActions.setregistryConfigVerions([]));
    };
  }, [dispatch]);
  const onError = errors => {
    if (isEmpty(errors)) {
      // handleSubmit(handleCreateCluster)();
    } else {
      setOpenAddConfigModal(false);
    }
  };
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'testAzureConfig')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryConfigVersions')
  );

  return (
    <Wrapper>
      <FullPageLoader loading={loading || loading2} />
      <Title title={'Add New Registry'} />
      <Container>
        <RegistryNavigationTab activeTab={activeTab} />
        <div className="mt-3 ms-3 me-3">
          {' '}
          <div className="row">
            <div className="col-12">
              <LabelSelect className="mb-3">
                Registry Name <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <InputField
                name="registryName"
                type="text"
                placeholder="Enter your registry name"
                required={true}
                register={register}
                errors={errors}
                icon={<QRIcons />}
                // disabled={!isEmpty(kubeClusterIDEdit)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <LabelSelect className="mb-3">
                Kubernetes Cluster <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="kubeConfigId"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={kubeConfigurationOptions || []}
                placeholder={'Select Kubernetes Cluster'}
                required={true}
                // disabled={!isEmpty(kubeClusterIDEdit)}
              />
            </div>
            <div className="col-6">
              <LabelSelect className="mb-3">
                Registry Configuration <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="registryConfigs"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={registryConfigurationOptionsUniques || []}
                placeholder="Select Registry Configuration"
                required={true}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <LabelSelect className="mb-3">
                Registry Configuration Version
                <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <SelectField
                name="registryConfigId"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={registryConfigurationVersionsOptions || []}
                placeholder={'Select Registry Configuration Version'}
                required={true}
                sortAlphabetically={false}
              />
            </div>
            <div className="col-6">
              <LabelSelect className="mb-3">Registry type</LabelSelect>
              <SelectField
                name="registryType"
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
                placeholder={'Select registry type'}
                required={true}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <LabelSelect className="mb-3">
                NiFi Cluster Namespace <span style={{ color: 'red' }}>*</span>
              </LabelSelect>
              <InputField
                name="nifiNamespace"
                type="text"
                placeholder="Enter NiFi cluster namespace"
                required={true}
                register={register}
                errors={errors}
                icon={<QRIcons />}
              />
            </div>
          </div>
        </div>
      </Container>
      <RegistryCreateUpgradeCredsModal
        register={register}
        errors={errors}
        openAddConfigModal={openAddConfigModal}
        setOpenAddConfigModal={setOpenAddConfigModal}
        registryType={registryType}
        control={control}
        watch={watch}
        handleCreateRegistry={handleCreateRegistry}
        handleSubmit={handleSubmit}
        reset={reset}
        // kubeClusterIDEdit={kubeClusterIDEdit}
        onError={onError}
        // aksSaveDb={aksSaveDb}
        // setAksSaveDb={setAksSaveDb}
      />
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.back();
            }}
          >
            {KDFM.BACK}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmitCreate}
            disabled={createBtnDisbaled}
          >
            Create Registry
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
RegistryDetailsPage.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default RegistryDetailsPage;
