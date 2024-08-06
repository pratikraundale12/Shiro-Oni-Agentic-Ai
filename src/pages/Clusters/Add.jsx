import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Title } from './components/Title';
import { Button, InputField, Modal, PasswordField } from '../../shared';
import { useForm } from 'react-hook-form';
import {
  LinkIcon,
  PlusCircleIcon,
  QRIcons,
  SmallPerfileIcon,
} from '../../assets';
import { testCluster } from '../../store';
import { UploadFile } from './UploadFile';

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
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  padding: 2rem;
`;

const ClusterSchema = yup.object().shape({
  clusterName: yup.string().required('Cluster name is required'),
  nifiUrl: yup.string().required('NiFi Url is required'),
  clusterUsername: yup.string().when('nifiUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Username is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  clusterPassword: yup.string().when('nifiUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Password is required'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const RegistrySchema = yup.object().shape({
  registryName: yup.string().required('Registry name is required'),
  registryUrl: yup.string().required('Registry Url is required'),
  registryUsername: yup.string().when('registryUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Username is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  registryPassword: yup.string().when('registryUrl', {
    is: value => !isEmpty(value) && value.startsWith('https'),
    then: () => yup.string().required('Password is required'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const TABS = {
  CLUSTER: 'cluster',
  REGISTRY: 'registry',
};

export const Add = () => {
  const [activeTab, setActiveTab] = useState(TABS.CLUSTER);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [clusterTest, setClusterTest] = useState(false);
  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      activeTab === TABS.CLUSTER ? ClusterSchema : RegistrySchema
    ),
  });

  const { pfxFile, passphrase } = watch();

  const handleBack = () => setActiveTab(TABS.CLUSTER);

  const handleTest = async data => {
    const testData =
      activeTab === TABS.CLUSTER
        ? {
            nifi_url: data.nifiUrl,
            username: data.clusterUsername,
            password: data.clusterPassword,
          }
        : {
            registry_url: data.registryUrl,
            username: data.registryUsername,
            password: data.registryPassword,
          };
    setLoading(true);
    await testCluster(testData);
    setLoading(false);
    setClusterTest(true);
  };

  const onSubmit = data => {
    if (activeTab === TABS.CLUSTER) {
      setActiveTab(TABS.REGISTRY);
      return;
    }
    console.log(data);
  };

  console.log(watch());
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
              <InputField
                name="clusterUsername"
                register={register}
                icon={<SmallPerfileIcon />}
                label="Username"
                placeholder="Enter your Username"
                errors={errors}
              />
              <PasswordField
                name="clusterPassword"
                register={register}
                watch={watch}
                label="Password"
                errors={errors}
              />
              <span>OR</span>
              <Button
                onClick={() => setIsOpen(true)}
                icon={<PlusCircleIcon width={20} height={20} color="white" />}
                // disabled={addCertificateSatus}
              >
                Add Certificate
              </Button>
            </Flex>
          </FormContainer>
        )}
        {activeTab === TABS.REGISTRY && (
          <>
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
              label="Nifi Url"
              placeholder="Enter your Nifi Url"
              errors={errors}
            />
          </>
        )}
      </Container>
      <FlexWrapper>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={!clusterTest}>
            Continue
          </Button>
        </div>
        <div>
          <Button
            loading={loading && 'Testing...'}
            onClick={handleSubmit(handleTest)}
            disabled={!pfxFile && !passphrase}
          >
            Test Cluster
          </Button>
        </div>
      </FlexWrapper>

      <Modal
        title="Add Cluster Certificate"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        size="sm"
        secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={() => setIsOpen(false)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h6>NiFi Certificate</h6>
          <UploadFile
            name="pfxFile"
            watch={watch}
            control={control}
            label="PFX File"
            placeholder="Enter your PFX File"
            errors={errors}
          />
          <PasswordField
            name="passphrase"
            watch={watch}
            errors={errors}
            register={register}
            label="PFX Passphrase"
            placeholder="Enter your Passphrase"
          />
        </div>
      </Modal>
    </Wrapper>
  );
};

Add.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
};
