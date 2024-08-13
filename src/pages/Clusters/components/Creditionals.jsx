import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { SmallPerfileIcon } from '../../../assets';
import { Modal } from '../../../shared';
import { PasswordField } from '../../../shared';
import { InputField } from '../../../shared';
import { SuccessTestModal } from './SuccessTestModal';
import { FailedTestModal } from './FailedTestModal';
import { testCluster, testRegistry } from '../../../store/index1';

export const Creditionals = ({
  isCredOpen,
  setIsCredOpen,
  setTestSuccess,
  // testSuccess,
  activeTab,
  clusterData,
  registryData,
}) => {
  const [suceessModal, setSuccessModal] = useState(false);
  const [failedModal, setFailedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  console.log('REGESTYRDAT', registryData);
  const handleTest = async data => {
    console.log(data);
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);
      payload.append('username', data.username);
      payload.append('password', data.password);

      const response = await testCluster(payload);
      console.log('Response:', response);
      if (response.status === 204) {
        setTestSuccess(true);
        setIsCredOpen(false);
        setSuccessModal(true);
        setLoading(false);
      } else {
        setTestMessage(response.message);

        setIsCredOpen(false);
        setFailedModal(true);
        setLoading(false);
      }
    } else {
      payload.append('name', registryData?.registryName || registryData.name);
      payload.append(
        'registry_url',
        registryData?.registryUrl || registryData.registry_url
      );
      payload.append('username', data.username);
      payload.append('password', data.password);

      const response = await testRegistry(payload);
      console.log('Response:', response);
      if (response.status === 204) {
        setTestSuccess(true);
        setIsCredOpen(false);
        setSuccessModal(true);
        setLoading(false);
      } else {
        setTestMessage(response.message);

        setIsCredOpen(false);
        setFailedModal(true);
        setLoading(false);
      }
    }
  };

  const onSubmit = data => {
    setLoading(true);

    handleTest(data);

    reset({
      username: '',
      password: '',
    });
  };

  return (
    <>
      <Modal
        title="Add Creditionals"
        isOpen={isCredOpen}
        onRequestClose={() => setIsCredOpen(false)}
        size="sm"
        loading={loading}
        secondaryButtonText="Back"
        primaryButtonText="Test Creditionals"
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '60px',
          }}
        >
          <InputField
            name="username"
            register={register}
            icon={<SmallPerfileIcon />}
            label="Username"
            placeholder="Enter your Username"
            errors={errors}
          />
          <PasswordField
            name="password"
            register={register}
            watch={watch}
            label="password"
            placeholder="Enter your Password"
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

Creditionals.propTypes = {
  isCredOpen: PropTypes.bool,
  setIsCredOpen: PropTypes.func,
  setTestSuccess: PropTypes.func,
  clusterData: PropTypes.object,
  registryData: PropTypes.object,
  activeTab: PropTypes.string,
};
