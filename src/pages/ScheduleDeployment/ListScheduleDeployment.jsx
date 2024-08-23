import React, { useEffect, useRef, useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { HoldIcon, PencilIcon } from '../../assets';
import { STATUS_OPTIONS } from '../../constants';
import { GridActions } from '../../store';
import { AddScheduleDeploymentModal } from './AddScheduleDeploymentModel';
import { StatusText } from './StatusText';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ListScheduleDeployment = () => {
  const dispatch = useDispatch();
  const [refreshState, setRefreshSelect] = useState(false);
  const intervalRef = useRef(null);

  const getActionsMenu = () => (
    <div>
      <ActionTd>
        <IconButton onClick={() => {}}>
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton onClick={() => {}}>
          <HoldIcon />
        </IconButton>
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => <TextRender text={item.namespace_name || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Source Cluster',
      renderCell: item => (
        <TextRender text={item.source_cluster_name || 'N/A'} />
      ),
      width: '15%',
    },
    {
      label: 'Dest. Cluster',
      renderCell: item => (
        <TextRender text={item.destination_cluster_name || 'N/A'} />
      ),
      width: '15%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Approver',
      renderCell: item => <TextRender text={item.approver_name || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Status',
      renderCell: item => <StatusText text={item.deployment_status} />,
      width: '15%',
    },
    {
      label: 'Actions',
      width: '10%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  const handleRefresh = event => {
    setRefreshSelect(event.value);
  };

  useEffect(() => {
    if (refreshState !== false) {
      intervalRef.current = setInterval(
        () => dispatch(GridActions.fetchGrid({ module: 'namespaces' })),
        refreshState
      );
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [dispatch, refreshState]);

  return (
    <>
      <Grid
        module="scheduler"
        title="Deployment List"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Namespace, Cluster or Approver"
        handleRefresh={handleRefresh}
        addModal={AddScheduleDeploymentModal}
      />
    </>
  );
};
