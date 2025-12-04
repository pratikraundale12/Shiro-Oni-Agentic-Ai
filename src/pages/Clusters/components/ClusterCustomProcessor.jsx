/*eslint-disable*/
import React, { useEffect, useState } from 'react';
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
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  InfoIcon,
  NotePadIcon,
  RefreshIcon,
} from '../../../assets';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../../store';
import { theme } from '../../../styles';
import { useGlobalContext } from '../../../utils';

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
export const ClusterCustomProcessor = ({ data }) => {
  const dispatch = useDispatch();
  const narList = useSelector(ClustersSelectors.getnarList);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [narSelected, setNarSelected] = useState({});
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'addNarFile')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'restartCluster')
  );

  const loading3 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchNarList')
  );
  const loading4 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deleteClusterNarFile')
  );
  const loggedInCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const loading5 = useSelector(NamespacesSelectors.getrestartDelayLoadingState);

  const [restartImmediatlyModal, setRestartImmediatlyModal] = useState(false);
  const schema = yup.object().shape({
    nar_file: yup.mixed().required('File is required'),
  });
  const { state } = useGlobalContext();

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleDeleteClick = item => {
    setNarSelected(item);
    setIsDeleteModalOpen(true);
  };
  const handleNarDeleteConfirm = () => {
    dispatch(
      ClustersActions.deleteClusterNarFile({
        id: narSelected?.clusterId,
        narId: narSelected?.id,
      })
    );
    setNarSelected({});
    setIsDeleteModalOpen(false);
  };

  const COLUMNS = [
    {
      label: 'File Name',
      renderCell: item => (
        <>
          {' '}
          {
            <NotePadIcon
              height="21"
              width="21"
              color={item?.addedViaDFM ? theme.colors.primary : '#444445'}
            />
          }{' '}
          &nbsp;
          {item?.name || 'N/A'}
        </>
      ),
      resize: true,
      width: '40%',
    },
    {
      label: 'File',
      renderCell: item => <>{item?.narPath}</>,
      resize: true,
      width: '50%',
    },

    {
      label: 'Actions',
      renderCell: item => (
        <>
          {
            <span
              data-tooltip-id={`delete nar`}
              onClick={() => handleDeleteClick(item)}
              style={{ cursor: 'pointer' }}
            >
              {item?.addedViaDFM && <DeleteSmallIcon color="red" />}
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
    payloadFile.append('narFile', formdata?.nar_file);
    let payload = { payload: payloadFile, id: data?.id };
    dispatch(ClustersActions.addNarFile(payload));
    setFileInputKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!isEmpty(data?.id)) {
      dispatch(ClustersActions.fetchNarList(data?.id));
    }
  }, [data?.id]);
  const handleRestart = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(false));
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
  const handleOpenModal = () => {
    setRestartImmediatlyModal(true);
  };
  const handleUploadWithNoRestart = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(false));
    handleSubmit(handleUpload)();
    setRestartImmediatlyModal(false);
  };
  const handleUploadWithRestart = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(true));
    handleSubmit(handleUpload)();
    setRestartImmediatlyModal(false);
  };

  //
  const handleDeleteWithNoRestart = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(false));
    handleNarDeleteConfirm();
    setIsDeleteModalOpen(false);
  };
  const handleDeleteWithRestart = () => {
    dispatch(ClustersActions.setrestartClusterAfterAction(true));
    handleNarDeleteConfirm();
    setIsDeleteModalOpen(false);
  };
  return (
    <>
      <FullPageLoader
        loading={loading || loading2 || loading3 || loading4 || loading5}
        restartText={loading2}
      />

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
                  placeholder={'Upload nar file'}
                  errors={errors}
                  fileLable="Custom Nar file"
                  validExtensionsArray={
                    Number(state?.nifi_version?.[0]) >= 2
                      ? ['.nar', '.py']
                      : ['.nar']
                  }
                  acceptString={
                    Number(state?.nifi_version?.[0]) >= 2 ? '.nar,.py' : '.nar'
                  }
                  errorText={
                    Number(state?.nifi_version?.[0]) >= 2 ? 'Nar or py' : 'Nar'
                  }
                  key={fileInputKey}
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
              onClick={handleSubmit(handleOpenModal)}
            >
              Upload
            </Button>
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
        <div className="ms-1 mt-2 d-flex justify-content-end">
          <div>
            <NotePadIcon height="21" width="21" color={theme.colors.primary} />{' '}
            : &nbsp;Uploaded by DFM &nbsp;&nbsp; <br />
            <NotePadIcon height="21" width="21" /> : &nbsp;Uploaded on NiFi
            &nbsp;&nbsp;
          </div>
        </div>
        <div className="mt-2">
          <Table data={narList || []} columns={COLUMNS} />
        </div>
        <ModalWithIcon
          title={`Delete Nar`}
          primaryButtonText={'Delete'}
          secondaryButtonText="Cancel"
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          primaryText={`Are you sure you want to delete?`}
          onSubmit={handleDeleteWithNoRestart}
          tertiaryButton="true"
          secondaryText="Restart will reflect the changes on NiFi immediatly."
          tertiaryButtonConfig={{
            tertiaryButtonTest: 'Delete and Restart',
            tertiaryButtonSubmit: handleDeleteWithRestart,
          }}
        />
        <ModalWithIcon
          title={
            watch('nar_file')?.name?.includes('.py')
              ? 'File Upload Confirmation'
              : `Restart Confirmation`
          }
          primaryButtonText={'Upload'}
          secondaryButtonText="Back"
          tertiaryButton={!watch('nar_file')?.name?.includes('.py')}
          tertiaryButtonConfig={{
            tertiaryButtonTest: 'Upload and Restart',
            tertiaryButtonSubmit: handleUploadWithRestart,
          }}
          icon={
            <RefreshIcon
              style={{ cursor: 'pointer' }}
              width={50}
              height={50}
              color={theme.colors.primary}
            />
          }
          isOpen={restartImmediatlyModal}
          onRequestClose={() => setRestartImmediatlyModal(false)}
          primaryText={
            watch('nar_file')?.name?.includes('.py')
              ? 'Do you want to upload file!'
              : `Do you want to retart the cluster after upload!`
          }
          secondaryText={
            watch('nar_file')?.name?.includes('.py')
              ? ''
              : 'Restart will reflect the changes on NiFi immediatly.'
          }
          onSubmit={handleUploadWithNoRestart}
        />
      </Container>
    </>
  );
};

ClusterCustomProcessor.propTypes = {
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
