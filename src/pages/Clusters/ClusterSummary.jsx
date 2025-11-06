/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { ActivityHistoryIcon } from '../../assets';
import { Grid, IconButton, StatusRender, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import { useGlobalContext } from '../../utils';
import ClusterSummaryNavigationTab from './components/ClusterSummaryNavigationTab';
import ClusterStatusTab from './components/ClusterStatusTab';
import { dispatch } from 'd3';
import { useDispatch } from 'react-redux';
import { ClustersActions } from '../../store';
import { useParams } from 'react-router-dom';
import RegistryCertificateDownloadTab from './components/ClusterRegistryCert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;
const StyledLink = styled.a`
  width: 8rem;
  color: ${props => props.theme.colors.primary};
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 14px 15px;
  text-decoration: none !important;
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.md};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;
export const ClusterSummary = () => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('summary');
  const { id: clusterId } = useParams();

  const getActionsMenu = item => (
    <div data-tooltip-id={`${item?.nodeId}1`}>
      <ActionTd
        onClick={() => {
          setState({
            ...state,
            eventModal: true,
            selectedNode: item,
          });
        }}
      >
        <IconButton>
          <ActivityHistoryIcon width={16} height={16} />
        </IconButton>
      </ActionTd>
      <ReactTooltip
        id={`${item?.nodeId}1`}
        place="left"
        content={'Node details'}
        style={{
          width: '130px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      />
    </div>
  );

  const COLUMNS = [
    {
      label: 'Address',
      renderCell: item => <TextRender text={item.address} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Node Id',
      renderCell: item => <TextRender text={item.nodeId} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Heartbeat',
      renderCell: item => <TextRender text={item.heartbeat} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => <StatusRender status={item.status} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Event Log',
      renderCell: item => getActionsMenu(item),
      width: '20%',
      resize: true,
    },
  ];

  const handleBackAction = () => {
    history.push('/clusters');
  };
  useEffect(() => {
    dispatch(ClustersActions.fetchClusterRegistryNodes(clusterId));
  }, [dispatch]);

  return (
    <Container>
      <ClusterSummaryNavigationTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        createdByAnsible={state?.created_by_ansible}
      />
      {activeTab === 'summary' && (
        <Grid
          module="nodes"
          // title="Clusters Summary"
          placeholder={KDFM.SEARCH_NODES}
          columns={COLUMNS}
          refreshOptions={REFRESH_OPTIONS}
          createdByAnsible={state?.created_by_ansible}
        />
      )}
      {activeTab === 'registry_cert' && (
        <div style={{ height: '100%' }}>
          <RegistryCertificateDownloadTab clusterId={clusterId} />
        </div>
      )}
      {activeTab === 'status' && (
        <div style={{ height: '100%' }}>
          <ClusterStatusTab />
        </div>
      )}
      <div style={{ width: '74px', marginTop: 'auto', paddingTop: '10px' }}>
        <Button variant="secondary" type="button" onClick={handleBackAction}>
          {KDFM.BACK}
        </Button>
      </div>
    </Container>
  );
};
