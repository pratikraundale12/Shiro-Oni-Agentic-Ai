import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import { updateCluster } from '../../../store/apis';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { InputField, PasswordField, RadioSelectField } from '../../../shared';
import { KDFM } from '../../../constants';
import { CurvedLockIcon, CurvedProfileIcon } from '../../../assets';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { useNavigate } from 'react-router-dom';

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
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [method, setMethod] = useState('password');

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
    { id: 1, value: 'password', label: 'Username' },
    { id: 2, value: 'pem', label: 'P12 File' },
  ];

  const schemaPassword = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });
  const schemaPEM = yup.object({
    password: yup.string().required('Password is required'),
    pfxFile: yup.mixed().required('PEM file is required'),
  });
  const schema = method === 'password' ? schemaPassword : schemaPEM;

  const {
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset();
    if (!isEmpty(hostToEdit)) {
      if (hostToEdit.isPassword) {
        setMethod('password');
        setValue('username', hostToEdit.username);
      } else {
        setMethod('pem');
      }
    }
  }, [hostToEdit]);

  const watchedMethod = watch('methodForCredentials');
  useEffect(() => {
    if (watchedMethod) {
      setMethod(watchedMethod);

      if (watchedMethod === 'password') {
        setValue('pfxFile', null);
      } else if (watchedMethod === 'pem') {
        setValue('username', '');
      }
    }
  }, [watchedMethod]);

  const values = watch();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && !isAdding && !addError) {
      navigate(-1);
    }
  }, [submitted, isAdding, addError]);

  const handleSave = async () => {
    const formData = new FormData();
    console.log('clusterId:', clusterId);
    console.log('clusterData:', clusterData);
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

    const saType = method === 'password' ? 'username_password' : 'pem';
    formData.append('service_account_type', saType);

    if (method === 'password') {
      formData.append('service_username', values.username);
      formData.append('service_password', values.password);
      formData.append('has_custom_service_account', 'false');
    } else {
      formData.append('has_custom_service_account', 'true');
      formData.append('service_account_certificate_password', values.password);
      formData.append('service_account_certificate', values.pfxFile);
    }
    if (!clusterId || !formData) {
      console.error(
        'ClusterServiceAccountModal: Missing clusterId or formData'
      );
      console.log('clusterId:', clusterId);
      console.log('formData:', JSON.stringify(formData));
      toast.error('Failed to save: Missing required data');
      return;
    }

    if (isEmpty(hostToEdit)) {
      console.log('Updating host:........................', clusterId);
      console.log('formData...............:', formData);
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
      console.log(
        '.................................................................................:'
      );
      console.log('hostToEdit...............:', hostToEdit);
      dispatch(
        ClustersActions.addServiceAccountHostRequest({
          clusterId,
          formData,
        })
      );
    } else {
      console.log('Updating host:........................', clusterId);
      console.log('formData...............:', formData);
      console.log(
        '.................................................................................:'
      );
      console.log('hostToEdit...............:', hostToEdit);
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
      dispatch(
        ClustersActions.updateServiceAccountHostRequest({
          clusterId,
          formData,
        })
      );
    }

    setSubmitted(true);
  };

  useEffect(() => {
    const shouldDisable =
      (method === 'password' && !values.username) ||
      !values.password ||
      (method === 'pem' && !values.pfxFile) ||
      loading;

    dispatch(ClustersActions.setTestCredsButtonVisible(shouldDisable));
  }, [values.username, values.password, values.pfxFile, method, loading]);

  return (
    <>
      <FullPageLoader loading={loading} />

      <Container>
        <div className="d-flex mb-3">
          <RadioSelectField
            name="methodForCredentials"
            options={OPTIONS}
            register={register}
            defaultValue="password"
            disabled={loading}
          />
        </div>

        <div className="row mb-3">
          {method === 'password' && (
            <div className="col-4">
              <InputField
                name="username"
                type="text"
                label="Username"
                placeholder="Enter Your User Name"
                register={register}
                errors={errors}
                icon={<CurvedProfileIcon />}
                disabled={loading}
              />
            </div>
          )}
          {method === 'pem' && (
            <div className="col-4">
              <ModalContainer>
                <PemUploadField
                  name="pfxFile"
                  label="P12 File"
                  watch={watch}
                  control={control}
                  required
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={KDFM.UPLOAD_P12_FILE}
                  errors={errors}
                  fileLable="P12 file"
                  disabled={loading}
                />
              </ModalContainer>
            </div>
          )}
          <div className="col-4">
            <PasswordField
              name="password"
              register={register}
              watch={watch}
              label="Password"
              icon={<CurvedLockIcon />}
              placeholder="Enter Your Password"
              disableToggle={false}
              errors={errors}
              disabled={loading}
            />
          </div>
        </div>

        <FlexWrapper>
          <div className="" style={{ display: 'flex', gap: '1rem' }}>
            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleSave}
            >
              {isEmpty(hostToEdit) ? 'Add Host' : 'Update Host'}
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
    registryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Added registryId validation
    notification_enable: PropTypes.bool,
    approver_enable: PropTypes.bool,
    change_request_enable: PropTypes.bool,
  }).isRequired,
  clusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  hostToEdit: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isPassword: PropTypes.bool,
    username: PropTypes.string,
    // if you read more fields (e.g. pfxFile), add them here
  }),
};
