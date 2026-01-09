/* eslint-disable */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField } from '../../shared';
import { Title } from '../Clusters/components/Title';
import ClusterSetupNavigationTab from '../Clusters/components/ClusterSetupNavigationTab';
import { ClustersActions, ClustersSelectors } from '../../store';
import RegistryNavigationTab from './RegistryNavigationTab';
import { QRIcons } from '../../assets';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    defaultValues: { cluster_type: 'aks', nifi_namespace: 'nifi' },
  });
  const handleCreateRegistry = () => {};
  useEffect(() => {
    dispatch(ClustersActions.fetchMasterHostNodesList());
  }, [dispatch]);
  return (
    <Wrapper>
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
                name="clusterName"
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
                name="host"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={[]}
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
                name="configName"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={[]}
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
                name="configVersion"
                icon={<QRIcons />}
                register={register}
                errors={errors}
                control={control}
                options={[]}
                placeholder={'Select Registry Configuration Version'}
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
              />
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
              history.back();
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button type="submit" onClick={handleSubmit(handleCreateRegistry)}>
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
