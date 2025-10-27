/*eslint-disable*/
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, ModalWithIcon } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader, Table } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { DeleteDustbinIcon, DeleteSmallIcon } from '../../../assets';
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

export const DriversCluster = ({ data }) => {
  const dispatch = useDispatch();
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState({});
  const schema = yup.object().shape({
    driver: yup.mixed().required('File is required'),
  });
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'uploadClusterDriver')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'restartCluster')
  );
  const loading3 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deleteClusterDriverFile')
  );
  const loading4 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDriversList')
  );

  const driverList = useSelector(ClustersSelectors.getDriversList);

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleDeleteClick = item => {
    setSelectedDriver(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(
      ClustersActions.deleteClusterDriverFile({
        id: selectedDriver?.clusterId,
        driverId: selectedDriver?.id,
      })
    );
    setSelectedDriver({});
    setIsDeleteModalOpen(false);
  };
  const COLUMNS = [
    {
      label: 'File Name',
      renderCell: item => <>{item?.name || 'N/A'}</>,
      resize: true,
      width: '40%',
    },
    {
      label: 'File Path',
      renderCell: item => <>{item?.jarPath}</>,
      resize: true,
      width: '50%',
    },

    {
      label: 'Actions',
      renderCell: item => (
        <>
          {
            <span
              data-tooltip-id={`delete-driver`}
              onClick={() => handleDeleteClick(item)}
              style={{ cursor: 'pointer' }}
            >
              {<DeleteSmallIcon color="red" />}
            </span>
          }{' '}
        </>
      ),
      resize: true,
      width: '10%',
    },
  ];

  const handleUpload = formdata => {
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
  const handleRestart = () => {
    dispatch(
      ClustersActions.restartCluster({
        id: data?.id,
        payload: {},
      })
    );
  };
  return (
    <>
      <FullPageLoader loading={loading || loading2 || loading3 || loading4} />

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
            <Button type="button" variant="primary" onClick={handleRestart}>
              Restart
            </Button>
          </div>
        </FlexWrapper>
        <div className="mt-2">
          <Table data={driverList || []} columns={COLUMNS} />
        </div>
        <ModalWithIcon
          title={`Delete Driver`}
          primaryButtonText={'Delete'}
          secondaryButtonText="Cancel"
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          primaryText={`Are you sure you want to delete?`}
          onSubmit={handleDeleteConfirm}
        />
      </Container>
    </>
  );
};

DriversCluster.propTypes = {
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
