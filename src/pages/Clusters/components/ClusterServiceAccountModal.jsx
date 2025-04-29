import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateCluster } from '../../../store/apis';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersSelectors } from '../../../store/clusters';
import { InputField, PasswordField } from '../../../shared';
import { CurvedLockIcon, CurvedProfileIcon } from '../../../assets';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';

const Container = styled.div``;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ClusterServiceAccountModal = ({
  clusterId,
  hostToEdit,
  onClose,
}) => {
  // Selectors for loading & error states
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

  const schema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  });

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset();
    if (!isEmpty(hostToEdit)) {
      setValue('username', hostToEdit.username);
    }
  }, [hostToEdit, reset, setValue]);

  // Get all field values
  const values = watch();
  const id = clusterId;

  const handleSave = async () => {
    const payload = new FormData();

    const hasUsername = !!values.username;
    const hasPassword = !!values.password;
    const isProtected = hasUsername && hasPassword;

    payload.append('is_protected', isProtected);
    payload.append('protection_type', 'password');
    payload.append('protection_username', values.username || '');
    payload.append('protection_password', values.password || '');

    const response = await updateCluster(id, payload);
    if (response && response.id) {
      toast.success('Host updated successfully');
      onClose();
    } else {
      toast.error('Failed to update host');
    }
  };

  return (
    <>
      <FullPageLoader loading={loading} />

      <Container>
        <div className="row mb-3">
          <div className="col-4">
            <InputField
              name="username"
              type="text"
              label="User Name"
              placeholder="Enter Your User Name"
              register={register}
              errors={errors}
              icon={<CurvedProfileIcon />}
              disabled={loading}
            />
          </div>

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
  clusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  hostToEdit: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
    isPassword: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
};
