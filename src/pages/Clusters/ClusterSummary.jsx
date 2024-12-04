import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { ActivityHistoryIcon } from '../../assets';
import { Grid, IconButton, StatusRender, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { useGlobalContext } from '../../utils';

const Container = styled.div`
  height: 100%;
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
        placeholder={KDFM.SEARCH_NODES}
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
      />
    </Container>
  );
};
