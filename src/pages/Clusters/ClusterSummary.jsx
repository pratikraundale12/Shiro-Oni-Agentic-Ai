import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid, StatusRender, Table, TextRender } from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS, useGlobalContext } from '../../utils';
import { OpenEyeIcon } from '../../assets';
import { Modal } from '../../shared';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

const FirstContainer = styled.div`
  width: 50%;
  height: fit-content;
  display: flex;
  gap: 40px;
`;

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ClusterSummary = () => {
  const { state, setState } = useGlobalContext();

  const data = state.gridData?.nodeList;
  const registry = state.gridData?.nodeList?.registry;
  const [events, setEvents] = useState([]);
  const [address, setAddress] = useState('');
  const [nodeId, setNodeId] = useState('');

  const getActionsMenu = item => (
    <div>
      <ActionTd
        onClick={() => {
          setState({
            ...state,
            eventModal: true,
          });
          setEvents(item.events);
          setAddress(item.address);
          setNodeId(item.nodeId);
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
      width: 120,
      renderCell: item => getActionsMenu(item),
    },
  ];

  const CLUSTERCOLUMNS = [
    {
      label: 'Cluster Name',
      renderCell: item => <TextRender text={item.name} />,
    },
    {
      label: 'Cluster URL',
      renderCell: item => <TextRender text={item.nifi_url} />,
    },
  ];

  const REGISTRYCOLUMNS = [
    {
      label: 'Registry Name',
      renderCell: item => <TextRender text={item.name} />,
    },
    {
      label: 'Registry URL',
      renderCell: item => <TextRender text={item.registry_url} />,
    },
  ];

  const EVENTCOLUMNS = [
    {
      label: 'Address',
      renderCell: () => <TextRender text={address} />,
    },
    {
      label: 'Node ID',
      renderCell: () => <TextRender text={nodeId} />,
    },
    {
      label: 'Node Events',
      renderCell: item => (
        <TextRender text={`${item.timestamp}: ${item.message}`} />
      ),
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  return (
    <>
      <FirstContainer>
        <Table data={[data || {}]} columns={CLUSTERCOLUMNS} />
        <Table data={[registry || {}]} columns={REGISTRYCOLUMNS} />
      </FirstContainer>
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
      <Modal
        title="Add Certificate"
        isOpen={state.eventModal}
        onRequestClose={() => setState({ ...state, eventModal: false })}
        size="lg"
        primaryButtonText="Continue"
      >
        <Table data={events || []} columns={EVENTCOLUMNS} />
      </Modal>
    </>
  );
};
