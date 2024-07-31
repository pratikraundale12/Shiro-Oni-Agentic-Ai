import React from 'react';
import styled from 'styled-components';
import { Grid, StatusRender, TextRender } from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS, useGlobalContext } from '../../utils';
import { OpenEyeIcon } from '../../assets';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;

  > div > div:nth-child(5) {
    height: 65%;
  }
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
        <OpenEyeIcon />
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: 'Address',
      renderCell: item => <TextRender text={item.address} />,
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Node Id',
      renderCell: item => <TextRender text={item.nodeId} />,
    },
    {
      label: 'Heartbeat',
      renderCell: item => <TextRender text={item.heartbeat} />,
    },
    {
      label: 'Status',
      renderCell: item => <StatusRender status={item.status} />,
    },
    {
      label: 'Event Log',
      width: '10%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  return (
    <>
      <Container>
        <Grid
          module="nodeList"
          title="Clusters Summary"
          columns={COLUMNS}
          sortFns={SORT_FNS}
          statusOptions={STATUS_OPTIONS}
          refreshOptions={REFRESH_OPTIONS}
        />
      </Container>
    </>
  );
};
