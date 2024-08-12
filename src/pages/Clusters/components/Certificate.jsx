import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';
import { KeyIcons } from '../../../assets';
import { Modal, PasswordField } from '../../../shared';
import { testCluster, testRegistry } from '../../../store/apis/clusters';
import { UploadFile } from '../UploadFile';
import { FailedTestModal } from './FailedTestModal';
import { SuccessTestModal } from './SuccessTestModal';
// Define your validation schema
const schema = yup.object().shape({
  pfxFile: yup.mixed().required('PFX file is required'),
  password: yup.string().required('Password is required'),
});

const NifiText = styled.h6`
  font-weight: 500;
  font-size: 14px;
  line-height: 18.52px;
  color: #425466;
`;

export const Certificate = ({
  isCertificateOpen,
  setIsCertificateOpen,
  setTestSuccess,
  clusterData,
  // testSuccess,
  activeTab,
  registryData,
}) => {
  console.log('CLUSTERDATA', clusterData);
  const [suceessModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTest = async data => {
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);
      payload.append('file', data.pfxFile);
      payload.append('passphrase', data.password);

      const response = await testCluster(payload);
      console.log('Response:', response);
      if (response.status === 204) {
        setTestSuccess(true);
        setIsCertificateOpen(false);
        setSuccessModal(true);
        setLoading(false);
      } else {
        console.log('helllllllllllll', response);
        setIsCertificateOpen(false);
        setFailedModal(true);
        setTestMessage(response.message);
        setLoading(false);
      }
    } else {
      payload.append('name', registryData?.registryName || registryData?.name);
      payload.append(
        'nifi_url',
        registryData?.registryUrl || registryData?.registry_url
      );
      payload.append('file', data.pfxFile);
      payload.append('passphrase', data.password);

      const response = await testRegistry(payload);
      console.log('Response:', response);
      if (response.status === 204) {
        setTestSuccess(true);
        setIsCertificateOpen(false);
        setSuccessModal(true);
        setLoading(false);
      } else {
        setIsCertificateOpen(false);
        setFailedModal(true);
        setTestMessage(response.message);
        setLoading(false);
      }
    }
  };

  const onSubmit = data => {
    setLoading(true);
    handleTest(data);

    console.log(data);
    reset({
      pfxFile: '',
      password: '',
    });
  };

  return (
    <>
      <Modal
        title="Add Certificate"
        isOpen={isCertificateOpen}
        onRequestClose={() => setIsCertificateOpen(false)}
        size="sm"
        secondaryButtonText="Back"
        primaryButtonText="Test Certificate"
        onSubmit={handleSubmit(onSubmit)}
        loading={loading}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
      >
        <NifiText>NiFi Certificate</NifiText>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            marginTop: '38px',
            marginBottom: '35px',
          }}
        >
          <UploadFile
            name="pfxFile"
            watch={watch}
            control={control}
            label="PFX File"
            placeholder="Enter your PFX File"
            errors={errors}
          />
          <PasswordField
            name="password"
            watch={watch}
            label="Passphrase"
            register={register}
            placeholder="Enter your Passphrase"
            icon={<KeyIcons />}
            errors={errors}
          />
        </form>
      </Modal>
      <SuccessTestModal
        successTest={suceessModal}
        setSuccessTest={setSuccessModal}
        name={activeTab}
      />

      <FailedTestModal
        failedTest={failedModal}
        setFailedTest={setFailedModal}
        testMessage={testMessage}
      />
    </>
  );
};

Certificate.propTypes = {
  isCertificateOpen: PropTypes.bool,
  setIsCertificateOpen: PropTypes.func,
  setTestSuccess: PropTypes.func,
  testSuccess: PropTypes.bool,
  clusterData: PropTypes.object,
  registryData: PropTypes.object,
  activeTab: PropTypes.string,
};
