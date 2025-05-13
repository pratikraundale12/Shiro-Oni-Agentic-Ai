/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled, { ThemeConsumer } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, SwitchButton } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { InputField, PasswordField, RadioSelectField } from '../../../shared';
import { KDFM } from '../../../constants';
import {
  CurvedLockIcon,
  CurvedProfileIcon,
  CircleExclamationMarkIcon,
} from '../../../assets';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { useNavigate } from 'react-router-dom';
import { updateCluster } from '../../../store/index1';
import { theme } from '../../../styles';

const Container = styled.div``;
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 0;
`;
const UploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #ff7a00;
  margin-bottom: 12px;
  padding: 5px 12px;
  background: white;
  font-weight: bold;
  border: 1px solid #ff7a00;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: #fdfaf5;
  }
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ClusterServiceAccountModal = ({
  tags,
  hostToEdit,
  clusterData,
  clusterId,
  data,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize state
  const [method, setMethod] = useState(
    data?.service_account_type || 'username_password'
  );
  const [changeRequestEnabled, setChangeRequestEnabled] = useState(
    data?.has_custom_service_account || false
  );

  const isChecking = useSelector(ClustersSelectors.isCheckingServiceAccount);
  const checkError = useSelector(ClustersSelectors.getServiceAccountCheckError);
  const isAdding = useSelector(ClustersSelectors.isAddingServiceAccountHost);
  const addError = useSelector(ClustersSelectors.getAddServiceAccountHostError);
  const isUpdating = useSelector(
    ClustersSelectors.isUpdatingServiceAccountHost
  );
  const updateError = useSelector(
    ClustersSelectors.getUpdateServiceAccountHostError
  );

  const loading = isChecking || isAdding || isUpdating;

  const OPTIONS = [
    { id: 1, value: 'username_password', label: 'Username' },
    { id: 2, value: 'p12', label: 'P12 File' },
  ];

  const schemaPassword = yup.object({
    service_username: yup.string().required('Username is required'),
    service_password: yup.string().required('Password is required'),
  });

  const schemaPEM = yup.object({
    service_account_certificate_password: yup
      .string()
      .required('Password is required'),
    service_account_certificate: yup.mixed().required('P12 file is required'),
  });

  const schema = method === 'username_password' ? schemaPassword : schemaPEM;

  const {
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      service_account_type: data?.service_account_type || 'username_password',
      service_username: data?.service_username || '',
      service_password: data?.service_password || '',
      service_account_certificate: data?.service_account_certificate || '',
      service_account_certificate_password:
        data?.service_account_certificate_password || '',
      change_request_enable: data?.change_request_enable || false,
      has_custom_service_account: data?.has_custom_service_account || false,
    },
  });

  useEffect(() => {
    if (!changeRequestEnabled) {
      setValue(
        'service_account_type',
        data?.service_account_type === 'p12' ? 'p12' : 'username_password'
      );
    }
  }, [changeRequestEnabled]);

  const handleChangeRequestToggle = () => {
    const newState = !changeRequestEnabled;
    setChangeRequestEnabled(newState);

    if (!newState) {
      reset({
        service_account_type: 'username_password',
        service_username: data?.service_username || '',
        service_password: data?.service_password || '',
        service_account_certificate: data?.service_account_certificate || '',
        service_account_certificate_password:
          data?.service_account_certificate_password || '',
        change_request_enable: false,
      });
      setMethod('username_password');
      setValue('service_account_type', 'username_password');
    } else {
      reset({
        service_account_type: data?.service_account_type || 'username_password',
        service_username: data?.service_username || '',
        service_password: data?.service_password || '',
        service_account_certificate: data?.service_account_certificate || '',
        service_account_certificate_password:
          data?.service_account_certificate_password || '',
        change_request_enable: data?.change_request_enable || false,
      });
      const updatedMethod = data?.service_account_type || 'username_password';
      setMethod(updatedMethod);
      setValue('service_account_type', updatedMethod);
    }
  };

  useEffect(() => {
    if (method === 'username_password') {
      setValue('service_username', data?.service_username || '');
      setValue('service_password', data?.service_password || '');
    } else if (method === 'p12') {
      setValue(
        'service_account_certificate',
        data?.service_account_certificate || ''
      );
      setValue(
        'service_account_certificate_password',
        data?.service_account_certificate_password || ''
      );
    }
  }, [method, data, setValue]);

  const watchedMethod = watch('service_account_type');

  useEffect(() => {
    if (watchedMethod) {
      setMethod(watchedMethod);
    }
  }, [watchedMethod]);

  const handleSave = async () => {
    const formData = new FormData();
    const payloadData = {
      name: clusterData.clusterName,
      nifi_url: clusterData.nifiUrl,
      ...(clusterData.registryId && { registry_id: clusterData.registryId }),
      ...(clusterData.logs_url && { logs_url: clusterData.logs_url }),
      ...(clusterData.metrics_url && { metrics_url: clusterData.metrics_url }),
      tag: tags,
      notification_enable: clusterData.notification_enable || false,
      has_custom_service_account: changeRequestEnabled ? true : false,
      service_account_type: 'username_password',
      service_username: watch('service_username'),
      service_password: watch('service_password'),
    };

    const response = await updateCluster(clusterId, payloadData);
    console.log('Response:', response);
    formData.append('name', clusterData.clusterName);
    formData.append('nifi_url', clusterData.nifiUrl);

    if (clusterData.registryId) {
      formData.append('registry_id', clusterData.registryId);
    }

    if (clusterData.logs_url) {
      formData.append('logs_url', clusterData.logs_url);
    }

    if (clusterData.metrics_url) {
      formData.append('metrics_url', clusterData.metrics_url);
    }

    formData.append('tag', tags);
    formData.append(
      'notification_enable',
      clusterData.notification_enable || false
    );
    formData.append('approver_enable', clusterData.approver_enable || false);
    formData.append(
      'change_request_enable',
      clusterData.change_request_enable || false
    );

    if (changeRequestEnabled) {
      const saType =
        method === 'username_password' ? 'username_password' : 'p12';
      formData.append('service_account_type', saType);

      if (method === 'username_password') {
        formData.append('service_username', watch('service_username'));
        formData.append('service_password', watch('service_password'));
        formData.append('has_custom_service_account', 'true');
        formData.append('service_account_certificate_password', '');
        formData.append('service_account_certificate', '');
      } else {
        formData.append('service_username', '');
        formData.append('service_password', '');
        formData.append('has_custom_service_account', 'true');
        formData.append(
          'service_account_certificate_password',
          watch('service_account_certificate_password')
        );
        formData.append(
          'service_account_certificate',
          watch('service_account_certificate')
        );
      }
    } else {
      formData.append('has_custom_service_account', 'false');
      formData.append('service_account_type', 'username_password');
      formData.append('service_username', '');
      formData.append('service_password', '');
      formData.append('service_account_certificate_password', '');
      formData.append('service_account_certificate', '');
    }

    if (!clusterId || !formData) {
      console.error(
        'ClusterServiceAccountModal: Missing clusterId or formData'
      );
      toast.error('Failed to save: Missing required data');
      return;
    }

    if (isEmpty(hostToEdit)) {
      dispatch(
        ClustersActions.addServiceAccountHostRequest({
          clusterId,
          formData,
        })
      );
    } else {
      dispatch(
        ClustersActions.updateServiceAccountHostRequest({
          clusterId,
          formData,
        })
      );
    }

    navigate(-1);
  };

  return (
    <>
      <FullPageLoader loading={loading} />

      <Container>
        <div>
          <h5 className="mb-3">Do You Want Custom Service Account? </h5>
          <div className="mb-3">
            <CircleExclamationMarkIcon color={theme.colors.primary} />
            <span className='ml-2' style={{ fontSize: '1rem' }}>If a <span className='font-semibold' style={{ color: theme.colors.primary }}>common service account</span> is defined in the global settings, it
            will be <span className='font-semibold' style={{ color: theme.colors.primary }}>overridden</span> by the cluster-specific configuration from here.</span>
          </div>
          <SwitchButton
            id="changeServiceAccountToggle"
            name=""
            checked={changeRequestEnabled}
            onChange={handleChangeRequestToggle}
            isDisabled={loading}
          />
        </div>

        <div className="row mb-3 mt-3">
          {method === 'username_password' && (
            <>
              <div className="col-4">
                <InputField
                  name="service_username"
                  type="text"
                  label="Username"
                  placeholder="Enter Your User Name"
                  required
                  register={register}
                  errors={errors}
                  icon={<CurvedProfileIcon />}
                  disabled={!changeRequestEnabled || loading}
                />
              </div>
              <div className="col-4">
                <PasswordField
                  name="service_password"
                  register={register}
                  watch={watch}
                  label="Password"
                  required
                  icon={<CurvedLockIcon />}
                  placeholder="Enter Your Password"
                  disableToggle={false}
                  errors={errors}
                  disabled={!changeRequestEnabled || loading}
                />
              </div>
            </>
          )}
          {method === 'p12' && (
            <>
              <div className="col-4">
                <ModalContainer>
                  <PemUploadField
                    name="service_account_certificate"
                    label="P12 File"
                    watch={watch}
                    control={control}
                    required
                    rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                    placeholder={KDFM.UPLOAD_P12_FILE}
                    errors={errors}
                    fileLable="P12 file"
                    disabled={!changeRequestEnabled || loading}
                  />
                </ModalContainer>
              </div>
              <div className="col-4">
                <PasswordField
                  name="service_account_certificate_password"
                  register={register}
                  watch={watch}
                  label="Password"
                  required
                  icon={<CurvedLockIcon />}
                  placeholder="Enter Your Password"
                  disableToggle={false}
                  errors={errors}
                  disabled={!changeRequestEnabled || loading}
                />
              </div>
            </>
          )}
        </div>

        <FlexWrapper>
          <div className="" style={{ display: 'flex', gap: '1rem' }}>
            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </FlexWrapper>
        {(checkError || addError || updateError) && (
          <p className="text-danger mt-2">
            {checkError || addError || updateError}
          </p>
        )}
      </Container>
    </>
  );
};

ClusterServiceAccountModal.propTypes = {
  tags: PropTypes.string.isRequired,
  clusterData: PropTypes.shape({
    clusterName: PropTypes.string,
    nifiUrl: PropTypes.string,
    metrics_url: PropTypes.string,
    logs_url: PropTypes.string,
    registryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notification_enable: PropTypes.bool,
    approver_enable: PropTypes.bool,
    change_request_enable: PropTypes.bool,
    service_account_type: PropTypes.oneOf(['username_password', 'p12']),
    service_username: PropTypes.string,
    service_password: PropTypes.string,
    service_account_certificate: PropTypes.string,
    service_account_certificate_password: PropTypes.string,
    has_custom_service_account: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
  clusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  hostToEdit: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isPassword: PropTypes.bool,
    username: PropTypes.string,
    password: PropTypes.string,
    service_account_certificate_password: PropTypes.string,
  }),
  data: PropTypes.shape({
    clusterName: PropTypes.string,
    nifiUrl: PropTypes.string,
    metrics_url: PropTypes.string,
    logs_url: PropTypes.string,
    registryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notification_enable: PropTypes.bool,
    approver_enable: PropTypes.bool,
    change_request_enable: PropTypes.bool,
    service_account_type: PropTypes.oneOf(['username_password', 'p12']),
    service_username: PropTypes.string,
    service_password: PropTypes.string,
    service_account_certificate: PropTypes.string,
    service_account_certificate_password: PropTypes.string,
    has_custom_service_account: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }),
};
