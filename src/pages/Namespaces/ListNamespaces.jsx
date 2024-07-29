import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextRender, Grid } from '../../components';
import { fetchGridData, REFRESH_OPTIONS, useGlobalContext } from '../../utils';
import AuditLog from './AuditLog';
import Deploy from './Deploy';
import { Button } from '../../shared';
import { OpenEyeIcon } from '../../assets';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListNamespaces = () => {
  const { state, setState } = useGlobalContext();
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const navigate = useNavigate();

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <button onClick={() => handleSelectNamespace(item.id)}>
          {item.name}
        </button>
      ),
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Namespace ID',
      renderCell: item => <TextRender text={item.id} />,
    },
    {
      label: 'Flow Name',
      renderCell: item => <TextRender text={item.flowName} />,
    },
    {
      label: 'Bucket Name',
      renderCell: item => <TextRender text={item.bucketName} />,
    },
    {
      label: 'Version',
      width: 120,
      renderCell: item => <TextRender text={item.version} />,
    },
    {
      width: 120,
      renderCell: () => (
        <button
          onClick={handleOpenAuditLog}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
          aria-label="Open Audit Log"
        >
          <OpenEyeIcon />
        </button>
      ),
    },
    {
      label: 'Actions',
      width: 120,
      renderCell: item => (
        <Button onClick={() => handleSelect(item)}>Select</Button>
      ),
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  };

  const clusterOptions = state.clusterList.map(item => ({
    label: item.name,
    value: item.id,
  }));

  function handleSelectNamespace(id) {
    setState(prev => ({ ...prev, selectedNamespaceId: id }));
    fetchGridData({
      setState,
      module: 'namespaces',
      selectedSourceClusterId: state.selectedSourceClusterId,
      selectedNamespaceId: id,
    });
  }

  const handleSelect = namespace => {
    setSelectedNamespace(namespace);
    navigate('/namespaces/deploy');
  };

  const handleOpenAuditLog = () => {
    setIsAuditLogOpen(true);
  };

  const handleCloseAuditLog = () => {
    setIsAuditLogOpen(false);
  };

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
  }, [setState]);

  return (
    <Container>
      <Grid
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        refreshOptions={REFRESH_OPTIONS}
        clusterOptions={clusterOptions}
      />
      {selectedNamespace && <Deploy selectedNamespace={selectedNamespace} />}
      <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} />
    </Container>
  );
};
