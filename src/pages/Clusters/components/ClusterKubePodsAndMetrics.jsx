/*eslint-disable*/
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { FullPageLoader, Table } from '../../../components';
import { useGlobalContext } from '../../../utils';
import { useEffect } from 'react';
import styled from 'styled-components';
import { NotePadIcon } from '../../../assets';
import { theme } from '../../../styles';
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
      renderCell: item => item?.cpu_millicores,
      width: '10%',
      resize: true,
    },
    {
      label: 'Memory Usage',
      renderCell: item => item?.memory_bytes,
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
    if (state?.nodeClusterId) {
      dispatch(ClustersActions.fetchKubePodStatus(state?.nodeClusterId));
    }
  }, [dispatch, state?.nodeClusterId]);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchKubePodStatus')
  );
  return (
    <>
      <FullPageLoader loading={loading} />{' '}
      <NavTabs id="nav-tab" role="tablist" className="mb-4">
        <NavButton
          active={true}
          // onClick={() => {
          //   setActiveTab('summary');
          // }}
        >
          <div className="d-flex align-items-center gap-2">
            <NotePadIcon color={'#FF7A00'} width={22} height={22} />
            Pods Status
          </div>
        </NavButton>
      </NavTabs>
      <Table
        showPagination={true}
        data={podsList}
        columns={COLUMNS}
        tableWithFullHeight={false}
      />{' '}
    </>
  );
};
export default KubeClusterPodsAndMetrics;
