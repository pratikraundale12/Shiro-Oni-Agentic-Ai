/*eslint-disable*/
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { FullPageLoader, Table } from '../../../components';
import { useGlobalContext } from '../../../utils';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BookIcon, NotePadIcon } from '../../../assets';
import { theme } from '../../../styles';
import KubeClusterHealthMetrics from './KubeClusterHealthMetrics';
import { isEmpty } from 'lodash';
const ActiveTd = styled.div`
  font-weight: var(--fw-500);
  line-height: 19.36px;
  letter-spacing: -0.005em;
  padding-left: 20px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0px;
    top: 7px;
    height: 7px;
    width: 7px;
    border-radius: 100%;
  }
`;

const GreenActiveness = styled(ActiveTd)`
  color: ${props => props.theme.colors.success};
  text-transform: capitalize;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &::after {
    background-color: ${props => props.theme.colors.success};
  }
`;
const RedInactive = styled(ActiveTd)`
  color: ${props => props.redColor || '#808080'};
  text-transform: capitalize;
  &::after {
    background-color: ${props => props.redColor || '#808080'};
  }
`;
const NavButton = styled.button`
  border: 0;
  background: none;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontNato};
  color: ${props =>
    props.active ? props.theme.colors.primary : props.theme.colors.darkGrey2};
  cursor: ${({ disabled }) =>
    disabled ? 'not-allowed !important' : 'pointer !important'};
  opacity: ${({ disabled }) => (disabled ? '0.5 !important' : '1')};
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active &&
    `border-bottom: 1px solid ${props.theme.colors.primaryActive};`}
`;
const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
`;
const renderStatus = status => {
  const successStatuses = ['Running', 'Completed'];
  const errorStatuses = [
    'CrashLoopBackOff',
    'Error',
    'Terminating',
    'Evicted',
    'Unknown',
    'ImagePullBackOff',
    'ErrImagePull',
  ];

  if (successStatuses.includes(status)) {
    return <GreenActiveness>{status}</GreenActiveness>;
  }

  if (errorStatuses.includes(status)) {
    return <RedInactive redColor="#FF0000">{status}</RedInactive>;
  }

  return <RedInactive redColor={theme.colors.primary}>{status}</RedInactive>;
};
const KubeClusterPodsAndMetrics = () => {
  const [activeTab, setActiveTab] = useState('status');
  const dispatch = useDispatch();
  const podsList = useSelector(ClustersSelectors.getKubePods);
  const { state } = useGlobalContext();

  const COLUMNS = [
    {
      label: 'Pod Name',
      renderCell: item => item?.name,
      width: '16%',
      resize: true,
    },
    {
      label: 'Ready',
      renderCell: item => item?.ready,
      width: '6%',
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => <>{renderStatus(item?.status)}</>,
      width: '10%',
      resize: true,
    },
    {
      label: 'CPU Usage',
      renderCell: item => item?.cpu_usage,
      width: '10%',
      resize: true,
    },
    {
      label: 'Memory Usage',
      renderCell: item => item?.memory_usage,
      width: '10%',
      resize: true,
    },
    {
      label: 'Restarts',
      renderCell: item => item?.restarts,
      width: '9%',
      resize: true,
    },
    {
      label: 'Age',
      renderCell: item => item?.age,
      width: '7%',
      resize: true,
    },

    {
      label: 'node',
      renderCell: item => item?.node,
      width: '10%',
      resize: true,
    },
    {
      label: 'namespace',
      renderCell: item => item?.namespace,
      width: '10%',
      resize: true,
    },
    {
      label: 'image',
      renderCell: item => item?.image,
      width: '12%',
      resize: true,
    },
  ];

  useEffect(() => {
    if (activeTab !== 'status') return;
    if (!state?.nodeClusterId) return;
    dispatch(ClustersActions.fetchKubePodStatus(state.nodeClusterId));
    const interval = setInterval(() => {
      dispatch(ClustersActions.fetchKubePodStatus(state.nodeClusterId));
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, state?.nodeClusterId, dispatch]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchKubePodStatus')
  );
  return (
    <>
      <FullPageLoader loading={loading && isEmpty(podsList)} />{' '}
      <NavTabs id="nav-tab" role="tablist" className="mb-4">
        <NavButton
          active={activeTab === 'status'}
          onClick={() => {
            setActiveTab('status');
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <NotePadIcon
              color={activeTab === 'status' ? '#FF7A00' : '#444445'}
              width={22}
              height={22}
            />
            Pods
          </div>
        </NavButton>{' '}
        <NavButton
          active={activeTab === 'healthMetices'}
          onClick={() => {
            setActiveTab('healthMetices');
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <BookIcon
              color={activeTab === 'healthMetices' ? '#FF7A00' : '#444445'}
              width={22}
              height={22}
            />
            Health Metrics
          </div>
        </NavButton>
      </NavTabs>
      {activeTab === 'status' && (
        <div
          style={{
            overflow: 'auto',
            maxHeight: 'calc(100vh - 250px)',
            minHeight: 'calc(100vh - 600px)',
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          <Table
            showPagination={true}
            data={podsList}
            columns={COLUMNS}
            tableWithFullHeight={false}
          />
        </div>
      )}
      {activeTab === 'healthMetices' && (
        <KubeClusterHealthMetrics
          activeTab={activeTab}
          podsList={podsList}
          clusterId={state?.nodeClusterId}
        />
      )}
    </>
  );
};
export default KubeClusterPodsAndMetrics;
