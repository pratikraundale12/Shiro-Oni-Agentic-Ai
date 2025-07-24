import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { KeyIcons } from '../../../assets';
import { FullPageLoader } from '../../../components';
import { CLUSTER_MODULE_TABS, KDFM } from '../../../constants';
import { Modal, PasswordField } from '../../../shared';
import { ClustersActions } from '../../../store';
import { testCluster, testRegistry } from '../../../store/apis/clusters';
import { UploadFile } from '../UploadFile';
import { FailedTestModal } from './FailedTestModal';

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

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 12px;
  margin-bottom: 35px;
`;

const DEFAULT_VALUES = {
  pfxFile: null,
  password: '',
};

export const Certificate = ({
  isCertificateOpen,
  setIsCertificateOpen,
  setTestSuccess,
  clusterData,
  // testSuccess,
  activeTab,
  registryData,
  setSuccessModal,
  setTestCertificateFile,
  setTestCertificatePassword,
  setTestCertificatePasswordForRegistry,
  setTestCertificateFileForRegistry,
  data,
}) => {
  const dispatch = useDispatch();
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
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isCertificateOpen) {
      reset({
        password: data?.service_account_certificate_password || '',
      });
    }
  }, [isCertificateOpen, data, reset]);

  const handleTest = async data => {
    const payload = new FormData();
    if (activeTab === 'cluster') {
      payload.append('name', clusterData.clusterName);
      payload.append('nifi_url', clusterData.nifiUrl);
      payload.append('file', data.pfxFile);
      payload.append('passphrase', data.password);
      payload.append('skip_credentials', false);
      setTestCertificateFile(data.pfxFile);
      setTestCertificatePassword(data.password);
      setTestCertificateFileForRegistry('');
      setTestCertificatePasswordForRegistry('');
      const response = await testCluster(payload);
      if (response.status === 200) {
        setTestSuccess(true);
        setIsCertificateOpen(false);
        setSuccessModal(true);
        setLoading(false);
        dispatch(ClustersActions.setClusterFormData(response?.data));
      } else {
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
      setTestCertificateFileForRegistry(data.pfxFile);
      setTestCertificatePasswordForRegistry(data.password);
      const response = await testRegistry(payload);
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
    reset(DEFAULT_VALUES);
  };

  return (
    <>
      <FullPageLoader loading={loading} />
      <Modal
        title={
          activeTab === CLUSTER_MODULE_TABS.CLUSTER
            ? KDFM.ADD_CLUSTER_CERTIFICATE
            : KDFM.ADD_REGISTRY_CERTIFICATE
        }
        isOpen={isCertificateOpen}
        onRequestClose={() => setIsCertificateOpen(false)}
        size="sm"
        secondaryButtonText={KDFM.BACK}
        primaryButtonText={KDFM.TEST_CERTIFICATE}
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
      >
        <NifiText>{KDFM.NIFI_CERTIFICATE}</NifiText>
        <ModalContainer>
          <UploadFile
            name="pfxFile"
            watch={watch}
            control={control}
            label={KDFM.PFX_FILE}
            placeholder={KDFM.SELECT_PFX_FILE}
            errors={errors}
            data={data}
            isCertificateOpen={isCertificateOpen}
            setIsCertificateOpen={setIsCertificateOpen}
          />
          <PasswordField
            name="password"
            watch={watch}
            label={KDFM.PFX_PASSPHRASE}
            register={register}
            placeholder={KDFM.ENTER_PFX_PASSPHRASE}
            icon={<KeyIcons />}
            errors={errors}
          />
        </ModalContainer>
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

Certificate.propTypes = {
  isCertificateOpen: PropTypes.bool,
  setIsCertificateOpen: PropTypes.func,
  setTestSuccess: PropTypes.func,
  testSuccess: PropTypes.bool,
  clusterData: PropTypes.object,
  registryData: PropTypes.object,
  activeTab: PropTypes.string,
  setSuccessModal: PropTypes.func,
  setTestCertificateFile: PropTypes.func,
  setTestCertificatePassword: PropTypes.func,
  setTestCertificateFileForRegistry: PropTypes.func,
  setTestCertificatePasswordForRegistry: PropTypes.func,
  data: PropTypes.any,
};
