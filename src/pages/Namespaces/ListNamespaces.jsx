import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TextRender, Grid } from '../../components';
import { fetchGridData, REFRESH_OPTIONS, useGlobalContext } from '../../utils';
// import AuditLog from './AuditLog';
// import Deploy from './Deploy';
import { Button } from '../../shared';
import { OpenEyeIcon } from '../../assets';
import { useNavigate } from 'react-router-dom';
import Deploy from './Deploy';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListNamespaces = () => {
  const { state, setState } = useGlobalContext();
  // const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      selectedPaths: [],
      selectedClusterId: null,
      selectedVersion: null,
      deployNamespaceId: null,
      deployData: {
        flowId: null,
        bucketId: null,
        bucketName: null,
        registryId: null,
        version: null,
      },
      upgradeData: {},
      updatedCount: null,
    }));
  }, []);
  const navigate = useNavigate();

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <button
          style={{
            color: '#C52B2B',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
          tabIndex="0"
          onClick={() => handleSelectNamespace(item.id)}
        >
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
      renderCell: item => <TextRender text={item.flowName || 'N/A'} />,
    },
    {
      label: 'Bucket Name',
      renderCell: item => <TextRender text={item.bucketName || 'N/A'} />,
    },
    {
      label: 'Version',
      width: '10%',
      renderCell: item => <TextRender text={item.version || 'N/A'} />,
    },
    {
      width: '10%',
      renderCell: () => (
        <button
          // onClick={handleOpenAuditLog}
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
      width: '10%',
      renderCell: item => (
        <Button
          onClick={() => handleSelect(item.id)}
          disabled={
            !item.flowId ||
            !item.version ||
            item.flowId === 'N/A' ||
            item.version === 'N/A'
          }
        >
          Select
        </Button>
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

  const handleSelect = id => {
    console.log({ state });
    const b = state.gridData.namespaces.data.find(a => a.id === id);
    if (state.selectedPaths.length === 0) {
      setState(prev => ({
        ...prev,
        selectedNamespaceId: id,

        selectedPaths: [b],
      }));
    } else {
      setState(prev => ({
        ...prev,
        selectedNamespaceId: id,

        selectedPaths: [...prev.selectedPaths, b],
      }));
    }
    console.log(b);

    navigate('/namespaces/deploy');
  };

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
  }, [setState]);

  const onBreadcrumbClick = e => {
    console.log(e);
    handleSelectNamespace(e.id);
  };

  return (
    <Container>
      <Grid
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        refreshOptions={REFRESH_OPTIONS}
        clusterOptions={clusterOptions}
        onBreadcrumbClick={onBreadcrumbClick}
      />
      <Deploy />
      {/* <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} /> */}
    </Container>
  );
};
