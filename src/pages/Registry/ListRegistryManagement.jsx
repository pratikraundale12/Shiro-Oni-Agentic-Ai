/*eslint-disable*/
import { React, useEffect, useState } from 'react';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  LicenseIcon,
  PencilIcon,
  SortDownIcon,
  SortUpIcon,
} from '../../assets';
import {
  Grid,
  IconButton,
  StatusRender,
  TextRender,
  UrlRender,
} from '../../components';
import { KDFM, STATUS_OPTIONS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { AddRegistryModal } from './AddRegistryModal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CheckboxField, Modal } from '../../shared';
import {
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';
import { CreateRegistryNavigationModal } from './CreateRegistryNavigavtionalModal';
import { ClusterProcessDisplayModal } from '../Clusters/components/ClusterProcessDisplayModal';
import RegistryCertificateDownloadTab from '../Clusters/components/ClusterRegistryCert';
import AnimatedProgressBar from '../../shared/AnimatedProgressBar';
import styled from 'styled-components';
const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;
const IconWrapper = styled.div`
  text-align: center;
`;
const ListRegistryManagementPage = () => {
  const dispatch = useDispatch();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const [selectedItem, setSelectedItem] = useState({});
  const isDeleteModalOpen = useSelector(RegistrySelectors.getIsDeleteModalOpen);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('');
  const isModalCreateRegistryOpen = useSelector(
    RegistrySelectors.getisCreateRegistryModalOpen
  );
  const registryCertDownloadOpen = useSelector(
    ClustersSelectors.getIsDownloadRegistryCertOpen
  );
  const [selectedCluster, setSelectedCluster] = useState({});
  const [unInstallNiFi, setUninstallNiFi] = useState(true);

  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`;
      }
      return column;
    });
  };
  const handleOpenProgressModal = item => {
    setIsProcessModalOpen(true);
    dispatch(ClustersActions.setProgressTrackingModalOpen(true));
    setSelectedCluster(item);
  };

  const COLUMNS = [
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('first_name')}
            style={{ background: 'none' }}
          >
            {KDFM.NAME}{' '}
            {sortingState === 'first_name' ? (
              <SortUpIcon />
            ) : sortingState === '-first_name' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      width: '30%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={`${item?.name || ''}`}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },

    {
      label: 'Registry URL',
      width: '40%',
      resize: true,
      renderCell: item => (
        <UrlRender
          tooltipId={'registry-url-tooltip'}
          copy_btn_tooltip={'Copy Registry URL'}
          url={item?.registry_url || ''}
        />
      ),
    },
    {
      label: <>{KDFM.STATUS}</>,
      width: '10%',
      resize: true,
      renderCell: item => (
        <>
          {item?.process_initiated ? (
            <div onClick={() => handleOpenProgressModal(item)}>
              <AnimatedProgressBar id={item?.id} />
            </div>
          ) : (
            <StatusRender status={item?.is_active ? 'Active' : 'Inactive'} />
          )}
        </>
      ),
    },

    {
      label: <>Actions</>,
      width: '20%',
      resize: true,
      renderCell: item => (
        <div className="d-flex align-self-end gap-2">
          {userPermissions.includes('edit_registry') &&
            item?.state !== 'DRAFT' &&
            item?.state !== 'FAILED' && (
              <button
                onClick={event => {
                  dispatch(RegistryActions.setRegistrySelectedData(item));
                  dispatch(RegistryActions.setIsAddRegistryModalOpen(true));
                  setSelectedItem(item);
                  event.currentTarget.blur();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
                data-tooltip-id={`tooltip-group-edit-registry`}
              >
                <IconButton>
                  <PencilIcon width={14} height={14} />
                </IconButton>
              </button>
            )}
          <ReactTooltip
            id={`tooltip-group-edit-registry`}
            place="left"
            content={'Edit Registry'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          {userPermissions.includes('delete_registry') && (
            <button
              onClick={event => {
                setSelectedItem(item);
                dispatch(RegistryActions.setIsDeleteModalOpen(true));
                event.currentTarget.blur();
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              data-tooltip-id={`tooltip-group-delete-registry`}
            >
              <IconButton>
                <DeleteSmallIcon width={14} height={14} color="red" />
              </IconButton>
            </button>
          )}
          <ReactTooltip
            id={`tooltip-group-delete-registry`}
            place="left"
            content={'Delete Registry'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          {item?.is_kube_registry &&
            item?.is_registry_authenticated &&
            item?.state !== 'DRAFT' &&
            item?.state !== 'FAILED' && (
              <>
                <button
                  onClick={() => {
                    // dispatch(RegistryActions.setRegistrySelectedData(item));
                    // dispatch(RegistryActions.setIsAddRegistryModalOpen(true));
                    setSelectedItem(item);
                    dispatch(
                      ClustersActions.setIsDownloadRegistryCertOpen(true)
                    );
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                  data-tooltip-id={`tooltip-group-certificate-registry`}
                >
                  <IconButton>
                    <LicenseIcon width={16} height={16} />
                  </IconButton>
                </button>
                <Modal
                  title="Registry Details"
                  primaryButtonText={'Back'}
                  isOpen={registryCertDownloadOpen}
                  onRequestClose={() =>
                    dispatch(
                      ClustersActions.setIsDownloadRegistryCertOpen(false)
                    )
                  }
                  onSubmit={() =>
                    dispatch(
                      ClustersActions.setIsDownloadRegistryCertOpen(false)
                    )
                  }
                  contentStyles={{ minWidth: '50%' }}
                >
                  <RegistryCertificateDownloadTab
                    clusterId={selectedItem?.id}
                  />
                </Modal>
              </>
            )}
          <ReactTooltip
            id={`tooltip-group-certificate-registry`}
            place="left"
            content={'Download Registry Certificate'}
            style={{
              width: '230px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </div>
      ),
    },
  ];
  const handleDeleteModalClose = () => {
    dispatch(RegistryActions.setIsDeleteModalOpen(false));
  };
  const handleDeleteSubmit = () => {
    dispatch(
      RegistryActions.deleteRegistry({
        registryId: selectedItem?.id,
        type:
          selectedItem?.is_kube_registry && unInstallNiFi
            ? 'nifi_uninstall'
            : 'db_only',
      })
    );
  };
  useEffect(() => {
    dispatch(ClustersActions.setAzureTestPassed(false));
  }, [dispatch]);
  return (
    <>
      <AddRegistryModal />

      <Modal
        title="Delete Registry"
        isOpen={isDeleteModalOpen}
        onRequestClose={handleDeleteModalClose}
        size="sm"
        secondaryButtonText="Back"
        primaryButtonText="Delete"
        onSubmit={handleDeleteSubmit}
        contentStyles={{ minWidth: '45%' }}
      >
        <IconWrapper>
          <DeleteDustbinIcon />
        </IconWrapper>{' '}
        <PrimaryText>Are you sure you want to delete registry?</PrimaryText>
        {selectedItem?.is_kube_registry && (
          <div className="d-flex justify-content-center">
            <CheckboxField
              name="check"
              label="Do you also want to uninstall NiFi via helm?"
              checked={unInstallNiFi}
              onChange={e => setUninstallNiFi(e.target.checked)}
            />
          </div>
        )}
      </Modal>
      <Grid
        module="registry"
        title={'Registry List'}
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder={KDFM.SEARCH_USER_PLACEHOLDER}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
      />
      <ClusterProcessDisplayModal
        isProcessModalOpen={isProcessModalOpen}
        setIsProcessModalOpen={setIsProcessModalOpen}
        setSelectedCluster={setSelectedCluster}
        selectedCluster={selectedCluster}
      />
      {isModalCreateRegistryOpen && <CreateRegistryNavigationModal />}
    </>
  );
};
export default ListRegistryManagementPage;
