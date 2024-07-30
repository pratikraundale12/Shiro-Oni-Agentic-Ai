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
const handleKeyPress = event => {
  if (event.key === 'Enter' || event.key === ' ') {
    // handleNameClick(name);
  }
};
export const ListNamespaces = () => {
  const { state, setState } = useGlobalContext();
  // const [selectedNamespace, setSelectedNamespace] = useState(null);

  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const navigate = useNavigate();

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <div
          style={{ color: 'red', cursor: 'pointer' }}
          role="button"
          tabIndex="0"
          onClick={() => handleSelectNamespace(item.id)}
          onKeyPress={event => handleKeyPress(event, item.name)}
        >
          {item.name}
        </div>
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
        <Button onClick={() => handleSelect(item.id)}>Select</Button>
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
    const b = state.gridData.namespaces.data.find(a => a.id === id);

    setState(prev => ({
      ...prev,
      selectedNamespaceId: id,

      selectedPaths: [...prev.selectedPaths, b],
    }));
    fetchGridData({
      setState,
      module: 'namespaces',
      selectedSourceClusterId: state.selectedSourceClusterId,
      selectedNamespaceId: id,
    });
  }
  console.log({ state });

  const handleSelect = id => {
    // setSelectedNamespace();
    // console.log({ id });
    const b = state.gridData.namespaces.data.find(a => a.id === id);

    setState(prev => ({
      ...prev,
      selectedNamespaceId: id,

      selectedPaths: [...prev.selectedPaths, b],
    }));
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
      <Deploy />
      <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} />
    </Container>
  );
};
