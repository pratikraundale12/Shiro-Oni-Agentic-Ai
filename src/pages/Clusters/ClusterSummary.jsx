import React from 'react';
import styled from 'styled-components';
import { ActivityHistoryIcon } from '../../assets';
import { Grid, IconButton, StatusRender, TextRender } from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { useGlobalContext } from '../../utils';

const Container = styled.div`
  height: 86%;
`;

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ClusterSummary = () => {
  const { state, setState } = useGlobalContext();

  const getActionsMenu = item => (
    <div>
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
    </div>
  );

  const COLUMNS = [
    {
      label: 'Address',
      renderCell: item => <TextRender text={item.address} />,
      width: '20%',
    },
    {
      label: 'Node Id',
      renderCell: item => <TextRender text={item.nodeId} />,
      width: '20%',
    },
    {
      label: 'Heartbeat',
      renderCell: item => <TextRender text={item.heartbeat} />,
      width: '20%',
    },
    {
      label: 'Status',
      renderCell: item => <StatusRender status={item.status} />,
      width: '20%',
    },
    {
      label: 'Event Log',
      renderCell: item => getActionsMenu(item),
      width: '20%',
    },
  ];

  return (
    <Container>
      <Grid
        module="nodes"
        title="Clusters Summary"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
      />
    </Container>
  );
};
