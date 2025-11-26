/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Button, ModalWithIcon } from '../../../shared';
import { KDFM } from '../../../constants';
import { history } from '../../../helpers/history';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { FullPageLoader, IconButton, Table } from '../../../components';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PencilIcon,
  PlusCircleIcon,
} from '../../../assets';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const TableContainer = styled.div`
  height: calc(100% - 130px);
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const SetupClusterManageConfigWrapper = ({ activeTab }) => {
  const dispatch = useDispatch();
  const congigListData = useSelector(ClustersSelectors.getConfigNameList);
  const kubeConfigList = useSelector(
    ClustersSelectors.getlistConfigListKubernetes
  );
  //
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState({});
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getConfigList')
  );
  const lastVisit = useSelector(ClustersSelectors.getlastVisitedTab);
  const handleEditConfig = ({ configItem }) => {
    dispatch(ClustersActions.getSingleConfigData(configItem?.id));
    history.push('/clusters/new-config-details');
  };
  const handleEditKubeConfig = ({ configItem }) => {
    dispatch(ClustersActions.setkubeCofigToEdit(configItem));
    history.push('/clusters/add-new-config');
  };

  const createClusterVisKubernetes = useSelector(
    ClustersSelectors.getCreateClusterMethod
  );
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <>{item.config_name}</>,
      resize: true,
    },
    {
      label: 'Config Version',
      renderCell: item => <>{item.config_version}</>,
      resize: true,
    },
    {
      label: 'Comments',
      renderCell: item => <>{item.comments}</>,
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={() => {
              handleEditConfig({ configItem: item });
            }}
            className="pencil-icon-schedule-list"
            data-tooltip-id={'config-ansible-edit-option'}
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          <ReactTooltip
            id={`config-ansible-edit-option`}
            place="bottom"
            effect="solid"
            content={'Edit Config'}
            style={{
              width: '105px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
          {!item?.is_part_of_cluster && (
            <IconButton
              onClick={() => {
                setConfigToDelete(item);
                setIsDeleteModalOpen(true);
              }}
              className="pencil-icon-schedule-list"
              data-tooltip-id={'config-ansible-delete-option'}
            >
              <DeleteSmallIcon width={16} height={16} color="red" />
            </IconButton>
          )}
          <ReactTooltip
            id={`config-ansible-delete-option`}
            place="bottom"
            effect="solid"
            content={'Delete Config'}
            style={{
              width: '125px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
        </ActionTd>
      ),
      resize: true,
    },
  ];
  const KUBE_COLUMNS = [
    {
      label: 'Config Name',
      renderCell: item => <>{item.config_name}</>,
      resize: true,
      width: '50%',
    },
    {
      label: 'Config Version',
      renderCell: item => <>{item.config_version}</>,
      resize: true,
      width: '25%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={() => {
              handleEditKubeConfig({ configItem: item });
            }}
            className="pencil-icon-schedule-list"
            data-tooltip-id={'config-ansible-edit-option'}
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          <ReactTooltip
            id={`config-ansible-edit-option`}
            place="bottom"
            effect="solid"
            content={'Edit Config'}
            style={{
              width: '105px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
          {
            <IconButton
              onClick={() => {
                setConfigToDelete(item);
                setIsDeleteModalOpen(true);
              }}
              className="pencil-icon-schedule-list"
              data-tooltip-id={'config-ansible-delete-option'}
              disabled={item?.is_part_of_cluster}
            >
              <DeleteSmallIcon width={16} height={16} color="red" />
            </IconButton>
          }
          <ReactTooltip
            id={`config-ansible-delete-option`}
            place="bottom"
            effect="solid"
            content={'Delete Config'}
            style={{
              width: '125px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
        </ActionTd>
      ),
      resize: true,
      width: '25%',
    },
  ];
  useEffect(() => {
    if (createClusterVisKubernetes === 'VM') {
      dispatch(ClustersActions.getConfigList());
    } else {
      dispatch(ClustersActions.fetchConfigListForKubernetes());
    }

    dispatch(ClustersActions.setAllConfigPropertiesAndValue({}));
    dispatch(ClustersActions.setkubeCofigToEdit({}));
    //
    dispatch(ClustersActions.setKubernetesConfigFields({}));
    return () => {
      dispatch(ClustersActions.setLastVisitedTab('manage_config'));
    };
  }, [dispatch]);
  const handleAddConfig = () => {
    if (createClusterVisKubernetes === 'VM') {
      history.push('/clusters/new-config-details');
    } else {
      history.push('/clusters/add-new-config');
    }
  };
  //
  return (
    <Wrapper>
      <FullPageLoader loading={loading} />
      <Title title={'Add New Cluster'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <TableContainer>
          <div className="d-flex justify-content-end mt-3 mb-3">
            <div className="col-auto me-3">
              <Button
                size="md"
                onClick={() => {
                  handleAddConfig();
                }}
                className="w-auto px-3"
                style={{ minWidth: 'auto' }}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <PlusCircleIcon height={19} width={19} color={'#fff'} />
                  {createClusterVisKubernetes === 'VM'
                    ? KDFM.ADD_NEW_CONFIG
                    : KDFM.ADD_NIFI_CONFIG}
                </div>
              </Button>
            </div>
          </div>
          <div className="ms-3 me-3">
            <Table
              data={
                createClusterVisKubernetes === 'VM'
                  ? congigListData
                  : kubeConfigList
              }
              columns={
                createClusterVisKubernetes === 'VM' ? COLUMNS : KUBE_COLUMNS
              }
              customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
              tableWithFullHeight={true}
            />
          </div>
        </TableContainer>
        <ModalWithIcon
          title={'Delete Config'}
          primaryButtonText={'Delete'}
          secondaryButtonText={'Cancel'}
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onSubmit={() => {
            if (createClusterVisKubernetes === 'VM') {
              dispatch(
                ClustersActions.deleteConfig({ configId: configToDelete?.id })
              );
            } else {
              dispatch(
                ClustersActions.deleteKubeConfig({
                  id: configToDelete?.id,
                })
              );
            }

            setIsDeleteModalOpen(false);
          }}
          onRequestClose={() => {
            setIsDeleteModalOpen(false);
            setConfigToDelete({});
          }}
          primaryText={`Are you sure you want to delete config!`}
        />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              if (lastVisit === 'cluster') {
                history.push(`/clusters`);
              } else {
                dispatch(ClustersActions.setActiveTabClusterSetup(lastVisit));
              }
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('cluster_details')
              );
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
SetupClusterManageConfigWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterManageConfigWrapper;
