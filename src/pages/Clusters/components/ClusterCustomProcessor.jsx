/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, InputField } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { KDFM } from '../../../constants';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader, Table } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { useNavigate } from 'react-router-dom';
import { CurvedFolderIcon } from '../../../assets';
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
const NodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  color: ${theme.colors.primary};
`;
export const ClusterCustomProcessor = ({
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
  const isAdding = useSelector(ClustersSelectors.isAddingServiceAccountHost);
  const isUpdating = useSelector(
    ClustersSelectors.isUpdatingServiceAccountHost
  );

  const loading = isChecking || isAdding || isUpdating;

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
    },
  });

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

  const handleSave = async () => {
    const formData = new FormData();
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
  const COLUMNS = [
    {
      label: 'File Name',
      renderCell: item => <>{item?.host_name || 'N/A'}</>,
      resize: true,
      width: '40%',
    },
    {
      label: 'File',
      renderCell: item => <>{item?.port}</>,
      resize: true,
      width: '40%',
    },

    {
      label: 'Actions',
      renderCell: item => (
        <>
          {
            <span data-tooltip-id={`certificate-${item?.id}-detail`}>
              {/* <NotePadIcon
                height="21"
                width="21"
                color={
                  item?.has_certificate
                    ? theme.colors.primary
                    : theme.colors.darkGrey
                }
              /> */}
            </span>
          }{' '}
          {/* <ReactTooltip
            id={`certificate-${item?.id}-detail`}
            place="bottom"
            effect="solid"
            content={
              item?.has_certificate ? 'Has Certificate' : 'No Certificate'
            }
            style={{
              width: '130px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          /> */}
        </>
      ),
      resize: true,
      width: '20%',
    },
    // {
    //   label: 'Status',
    //   renderCell: item => <></>,
    //   resize: true,
    //   width: '8%',
    // },
  ];

  return (
    <>
      <FullPageLoader loading={loading} />

      <Container>
        <div className="row mb-3">
          <>
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  name="nar_file"
                  label="Custom Nar file"
                  watch={watch}
                  control={control}
                  required
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={KDFM.UPLOAD_P12_FILE}
                  errors={errors}
                  fileLable="Custom Nar file"
                  validExtensionsArray={['.nar']}
                  acceptString={'.nar'}
                  errorText={'Nar'}
                />
              </ModalContainer>
            </div>
          </>
        </div>

        <FlexWrapper>
          <div className="" style={{ display: 'flex', gap: '1rem' }}>
            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleSave}
            >
              Upload
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={loading}
              onClick={handleSave}
            >
              Restart
            </Button>
          </div>
        </FlexWrapper>
        <div className="mt-2">
          <Table
            data={[]}
            columns={COLUMNS}
            // customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
            // tableWithFullHeight={true}
          />
        </div>
      </Container>
    </>
  );
};

ClusterCustomProcessor.propTypes = {
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
