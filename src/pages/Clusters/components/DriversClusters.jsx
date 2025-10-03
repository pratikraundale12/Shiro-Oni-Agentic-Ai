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
import { LoadingSelectors } from '../../../store';

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
export const DriversCluster = ({
  tags,
  hostToEdit,
  clusterData,
  clusterId,
  data,
}) => {
  const dispatch = useDispatch();
  const [fileInputKey, setFileInputKey] = useState(0);
  const schema = yup.object().shape({
    driver: yup.mixed().required('File is required'),
  });
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'uploadClusterDriver')
  );
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const handleUpload = formdata => {
    // let payload = { narFile: formdata?.nar_file, id: data?.id };
    const payloadFile = new FormData();
    payloadFile.append('driverFile', formdata?.driver);
    let payload = { payload: payloadFile, id: data?.id };
    dispatch(ClustersActions.uploadClusterDriver(payload));
    setFileInputKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!isEmpty(data?.id)) {
      dispatch(ClustersActions.fetchDriversList(data?.id));
    }
  }, [data?.id]);
  const handleRestart = () => {};
  return (
    <>
      <FullPageLoader loading={loading} />

      <Container>
        <div className="row mb-3">
          <>
            <div className="col-6">
              <ModalContainer>
                <PemUploadField
                  name="driver"
                  label="Driver file"
                  watch={watch}
                  control={control}
                  required
                  rightIcon={<UploadWrapper>Upload File</UploadWrapper>}
                  placeholder={'Upload driver file'}
                  errors={errors}
                  fileLable="Custom driver file"
                  key={fileInputKey}
                  validExtensionsArray={['.jar']}
                  acceptString={'.jar'}
                  errorText={'Jar'}
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
              onClick={handleSubmit(handleUpload)}
            >
              Upload
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

DriversCluster.propTypes = {
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
