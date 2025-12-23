/*eslint-disable*/
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Modal } from '../../../shared';
import PropTypes from 'prop-types';
import { ClustersActions, ClustersSelectors } from '../../../store/clusters';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FullPageLoader, Table } from '../../../components';
import PemUploadField from '../PEMUploadFile';
import { DeleteDustbinIcon, DeleteSmallIcon, InfoIcon } from '../../../assets';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../../store';
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
  const loggedInCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleDeleteClick = item => {
    setSelectedDriver(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(false));
    dispatch(
      ClustersActions.deleteClusterDriverFile({
        id: selectedDriver?.clusterId,
        driverId: selectedDriver?.id,
        restart: false,
      })
    );
    setSelectedDriver({});
    setIsDeleteModalOpen(false);
  };
  const handleDeleteandRestartConfirm = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(true));
    dispatch(
      ClustersActions.deleteClusterDriverFile({
        id: selectedDriver?.clusterId,
        driverId: selectedDriver?.id,
        restart: true,
      })
    );
    setSelectedDriver({});
    setIsDeleteModalOpen(false);
  };

  const handleRestart = () => {
    dispatch(
      ClustersActions.restartCluster({
        id: data?.id,
        payload: {},
      })
    );
    if (loggedInCluster?.value == data?.id) {
      dispatch(
        NamespacesActions.setSelectedCluster({
          label: '',
          value: '',
        })
      );
      localStorage.removeItem('selected_cluster');
    }
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
    reset();
  };

  useEffect(() => {
    if (!isEmpty(data?.id)) {
      dispatch(ClustersActions.fetchDriversList(data?.id));
    }
  }, [data?.id]);

  return (
    <>
      <FullPageLoader
        loading={loading || loading2 || loading3 || loading4}
        restartText={loading2}
      />

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
            </Button>{' '}
            <Button type="button" variant="primary" onClick={handleRestart}>
              Restart
            </Button>
          </div>
          <div
            className="col-10 d-flex align-items-center ms-2"
            style={{
              fontWeight: '500',
              fontSize: '16px',
              color: theme.colors.primary,
            }}
          >
            <InfoIcon color={theme.colors.primary} /> &nbsp; The cluster restart
            will take approximately 5 minutes.
          </div>
        </FlexWrapper>
        <div className="mt-2">
          <Table data={driverList || []} columns={COLUMNS} />
        </div>
        <Modal
          title={`Delete Driver`}
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          size="sm"
          loading={loading}
          secondaryButtonText="Back"
          primaryButtonText={'Delete'}
          onSubmit={handleDeleteConfirm}
          footerAlign="center"
          tertiaryButton={true}
          tertiaryButtonConfig={{
            tertiaryButtonTest: 'Delete and Retsart',
            tertiaryButtonSubmit: handleDeleteandRestartConfirm,
          }}
        >
          <div className="d-flex justify-content-center ">
            <DeleteDustbinIcon />
          </div>
          <div
            className="d-flex justify-content-center mt-2"
            style={{ fontWeight: '700', fontSize: '20px' }}
          >
            Are you sure you want to delete?
          </div>
        </Modal>
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
