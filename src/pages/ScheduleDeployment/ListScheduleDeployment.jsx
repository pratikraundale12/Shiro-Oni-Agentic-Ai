import React, { useEffect, useRef, useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { DeleteSmallIcon, PencilIcon } from '../../assets';
import { STATUS_OPTIONS } from '../../constants';
import { GridActions, NamespacesActions } from '../../store';
import { AddScheduleDeploymentModal } from './AddScheduleDeploymentModel';

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
  useEffect(() => {
    dispatch(NamespacesActions.resetDeployData());
  }, []);

  const getActionsMenu = item => (
    <div>
      {item}
      <ActionTd>
        <IconButton onClick={() => {}}>
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton onClick={() => {}}>
          <DeleteSmallIcon color="red" />
        </IconButton>
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => (
        <div
          className="d-flex"
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          {console.log(item, 'Namespace')}
        </div>
      ),
      width: '15%',
    },
    {
      label: 'Source Cluster',
      renderCell: item => (
        <div
          className="d-flex"
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          {console.log(item, 'Source Cluster')}
        </div>
      ),
      width: '15%',
    },
    {
      label: 'Dest. Cluster',
      renderCell: item => <TextRender text={item.flowName || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.bucketName || 'N/A'} />,
      width: '20%',
    },
    {
      label: 'Approver',
      width: '15%',
      renderCell: item => <TextRender text={item.version || 'N/A'} />,
    },
    {
      label: 'Status',
      width: '12%',
      renderCell: item => <TextRender text={item.version || 'N/A'} />,
    },
    {
      label: 'Actions',
      width: '8%',
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
        module="schedule_deploymet"
        title="Deployment List"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Namespace, Cluster or Approver"
        handleRefresh={handleRefresh}
        // buttonText="Schedule Deployment"
        addModal={AddScheduleDeploymentModal}
      />
    </>
  );
};
