import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { SmallPerfileIcon } from '../../../assets';
import { FullPageLoader } from '../../../components';
import { KDFM } from '../../../constants';
import { InputField, Modal, PasswordField } from '../../../shared';
import { ClustersActions } from '../../../store';
import { testCluster, testRegistry } from '../../../store/index1';
import { FailedTestModal } from './FailedTestModal';

const DEFAULT_VALUES = {
  username: '',
  password: '',
};

const credentialSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const Creditionals = ({
  isCredOpen,
  setIsCredOpen,
  setTestSuccess,
  activeTab,
  clusterData,
  registryData,
  setSuccessModal,
  setSaveButtonEnable,
  newregistryData = {},
  setEditUsername,
  setEditPassword,
}) => {
  const dispatch = useDispatch();
  const [failedModal, setFailedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(credentialSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleTest = async data => {
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);
      payload.append('username', data.username);
      payload.append('password', data.password);
      payload.append('skip_credentials', false);

      const response = await testCluster(payload);
      if (response.status === 200) {
        setTestSuccess(true);
        setIsCredOpen(false);
        setSuccessModal(true);
        setLoading(false);
        dispatch(ClustersActions.setClusterFormData(response?.data));
        setSaveButtonEnable(false);
        if (setEditUsername) setEditUsername(data?.username);
        if (setEditPassword) setEditPassword(data?.password);
      } else {
        setTestMessage(response.message);
        setIsCredOpen(false);
        setFailedModal(true);
        setLoading(false);
        setSaveButtonEnable(true);
      }
    } else {
      payload.append(
        'name',
        newregistryData?.registry ||
          registryData?.registryName ||
          registryData.name
      );
      payload.append(
        'nifi_url',
        newregistryData?.url ||
          registryData?.registryUrl ||
          registryData.registry_url
      );

      payload.append('username', data.username);
      payload.append('password', data.password);

      const response = await testRegistry(payload);
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
    reset(DEFAULT_VALUES);
  };

  return (
    <>
      <FullPageLoader loading={loading} />
      <Modal
        title={KDFM.ADD_CREDENTIALS}
        isOpen={isCredOpen}
        onRequestClose={() => setIsCredOpen(false)}
        size="sm"
        secondaryButtonText={KDFM.BACK}
        primaryButtonText={KDFM.TEST_CREDENTIALS}
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
            label={KDFM.USERNAME}
            placeholder={KDFM.ENTER_USERNAME}
            errors={errors}
          />
          <PasswordField
            name="password"
            register={register}
            watch={watch}
            label={KDFM.PASSWORD}
            placeholder={KDFM.ENTER_PASSWORD}
            errors={errors}
          />
        </form>
      </Modal>
      <FailedTestModal
        failedTest={failedModal}
        setFailedTest={setFailedModal}
        testMessage={testMessage}
        activeTab={activeTab}
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
  setSuccessModal: PropTypes.func,
  setSaveButtonEnable: PropTypes.bool,
  newregistryData: PropTypes.object,
  setEditUsername: PropTypes.func,
  setEditPassword: PropTypes.func,
};
