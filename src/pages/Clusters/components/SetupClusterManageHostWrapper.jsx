/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Button, ModalWithIcon } from '../../../shared';
import { KDFM } from '../../../constants';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import {
  FullPageLoader,
  IconButton,
  StatusRender,
  Table,
} from '../../../components';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  NotePadIcon,
  PencilIcon,
  PlusCircleIcon,
} from '../../../assets';
import { AddHostIPModal } from './AddHostIPModal';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import { theme } from '../../../styles';

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
const TableContainer = styled.div`
  height: calc(100% - 130px);
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const SetupClusterManageHostWrapper = ({ activeTab }) => {
  const [hostToDelete, setHostToDelete] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hostToEdit, setHostToEdit] = useState({});
  const dispatch = useDispatch();
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchHostNodesList')
  );
  const lastVisit = useSelector(ClustersSelectors.getlastVisitedTab);
  const createClusterVisKubernetes = useSelector(
    ClustersSelectors.getCreateClusterMethod
  );
  const COLUMNS = [
    {
      label: 'Host Name',
      renderCell: item => (
        <div className="d-flex gap-2">{item?.host_name || 'N/A'}</div>
      ),

      resize: true,
      width: '20%',
    },
    {
      label: 'Host IP',
      renderCell: item => (
        <div className="d-flex gap-2">
          {item?.host_ip}
          <span data-tooltip-id={`copy-${item?.host_ip}-host-url`}>
            <CopyToClipboard copyItem={item?.host_ip} />
          </span>
          <ReactTooltip
            id={`copy-${item?.host_ip}-host-url`}
            place="bottom"
            effect="solid"
            content={'Copy URL'}
            style={{
              width: '100px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
        </div>
      ),

      resize: true,
      width: '34%',
    },
    {
      label: 'Certificate',
      renderCell: item => (
        <>
          {
            <span data-tooltip-id={`certificate-${item?.id}-host`}>
              <NotePadIcon
                height="21"
                width="21"
                color={
                  item?.has_certificate
                    ? theme.colors.primary
                    : theme.colors.darkGrey
                }
              />
            </span>
          }{' '}
          <ReactTooltip
            id={`certificate-${item?.id}-host`}
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
          />
        </>
      ),
      resize: true,
      width: '7%',
    },
    {
      label: 'Port No.',
      renderCell: item => <>{item?.port}</>,
      resize: true,
      width: '9%',
    },
    {
      label: 'Username',
      renderCell: item => (
        <>
          {' '}
          {}
          {item?.username}
        </>
      ),
      resize: true,
      width: '10%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender
          status={item?.status === 'Active' ? 'Active' : 'Inactive'}
          redColor="#FF0000"
        />
      ),
      resize: true,
      width: '10%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={() => {
              setHostToEdit(item);
              dispatch(ClustersActions.setIsAddHostIPModalOpen(true));
            }}
            className="pencil-icon-schedule-list"
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          {!item?.is_selected && (
            <IconButton
              onClick={() => {
                setIsDeleteModalOpen(true);
                setHostToDelete(item);
              }}
              className="pencil-icon-schedule-list"
            >
              <DeleteSmallIcon width={16} height={16} color="red" />
            </IconButton>
          )}
        </ActionTd>
      ),
      resize: true,
      width: '10%',
    },
  ];
  const COLUMNS_KUBERNETSTES_FLOW = [
    {
      label: 'Host Name',
      renderCell: item => (
        <div className="d-flex gap-2">{item?.host_name || 'N/A'}</div>
      ),

      resize: true,
      width: '20%',
    },
    {
      label: 'Host IP',
      renderCell: item => (
        <div className="d-flex gap-2">
          {item?.host_ip}
          <span data-tooltip-id={`copy-${item?.host_ip}-host-url`}>
            <CopyToClipboard copyItem={item?.host_ip} />
          </span>
          <ReactTooltip
            id={`copy-${item?.host_ip}-host-url`}
            place="bottom"
            effect="solid"
            content={'Copy URL'}
            style={{
              width: '100px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
        </div>
      ),

      resize: true,
      width: '38%',
    },
    {
      label: 'Port No.',
      renderCell: item => <>{item?.port}</>,
      resize: true,
      width: '10%',
    },
    {
      label: 'Username',
      renderCell: item => (
        <>
          {' '}
          {}
          {item?.username}
        </>
      ),
      resize: true,
      width: '12%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender
          status={item?.status === 'Active' ? 'Active' : 'Inactive'}
          redColor="#FF0000"
        />
      ),
      resize: true,
      width: '10%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={() => {
              setHostToEdit(item);
              dispatch(ClustersActions.setIsAddHostIPModalOpen(true));
            }}
            className="pencil-icon-schedule-list"
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          {!item?.is_selected && (
            <IconButton
              onClick={() => {
                setIsDeleteModalOpen(true);
                setHostToDelete(item);
              }}
              className="pencil-icon-schedule-list"
            >
              <DeleteSmallIcon width={16} height={16} color="red" />
            </IconButton>
          )}
        </ActionTd>
      ),
      resize: true,
      width: '10%',
    },
  ];
  useEffect(() => {
    if (createClusterVisKubernetes === 'VM') {
      dispatch(
        ClustersActions.fetchHostNodesList({
          selected: true,
          clusterId: null,
          update_node: false,
        })
      );
    } else {
      dispatch(ClustersActions.fetchMasterHostNodesList());
    }

    return () => {
      ClustersActions.setHostIpList([]);
      dispatch(ClustersActions.setLastVisitedTab('manage_host'));
    };
  }, [dispatch]);
  return (
    <Wrapper>
      <FullPageLoader loading={loading} />
      <Title title={'Add New Cluster'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <TableContainer>
          <div className="d-flex justify-content-between mt-3 mb-3">
            <div className="ms-3 mt-2">
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Legends</div>
              <NotePadIcon
                height="21"
                width="21"
                color={theme.colors.primary}
              />{' '}
              : Host with certificates &nbsp;&nbsp;
              <NotePadIcon
                height="21"
                width="21"
                color={theme.colors.darkGrey}
              />{' '}
              : Host with no certificates
            </div>
            <div className="col-auto me-3">
              <Button
                size="md"
                onClick={() =>
                  dispatch(ClustersActions.setIsAddHostIPModalOpen(true))
                }
                className="w-auto px-3"
                style={{ minWidth: 'auto' }}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <PlusCircleIcon height={19} width={19} color={'#fff'} />
                  Add New Host
                </div>
              </Button>
            </div>
          </div>
          <div className="ms-3 me-3">
            <Table
              data={listHostIpData || []}
              columns={
                createClusterVisKubernetes === 'VM'
                  ? COLUMNS
                  : COLUMNS_KUBERNETSTES_FLOW
              }
              customNoDataText="No Host IP Available"
              tableWithFullHeight={true}
            />
          </div>
        </TableContainer>
        <ModalWithIcon
          title={'Delete Host IP'}
          primaryButtonText={'Delete'}
          secondaryButtonText={'Cancel'}
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onSubmit={() => {
            dispatch(
              ClustersActions.deleteIndividualHost({ hostId: hostToDelete?.id })
            );
            setIsDeleteModalOpen(false);
          }}
          onRequestClose={() => {
            setIsDeleteModalOpen(false);
          }}
          primaryText={`Are you sure you want to delete Host IP`}
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
                ClustersActions.setActiveTabClusterSetup('manage_config')
              );
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <AddHostIPModal hostToEdit={hostToEdit} setHostToEdit={setHostToEdit} />
    </Wrapper>
  );
};
SetupClusterManageHostWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterManageHostWrapper;
