import React, { useEffect, useRef, useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
import { fetchGridData } from '../../store';
import { REFRESH_OPTIONS, useGlobalContext } from '../../utils';
// import AuditLog from './AuditLog';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CopyIcon, OpenEyeIcon } from '../../assets';
import { Button } from '../../shared';
// import Deploy from './Deploy';
const StyledButton = styled.button`
  color: #ff7a00;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
`;
const StyledDiv = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
`;

export const ListNamespaces = () => {
  const navigate = useNavigate();
  const { state, setState } = useGlobalContext();
  const [refreshState, setRefreshSelect] = useState(false);
  const intervalRef = useRef(null);
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

  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => (
        <StyledButton
          tabIndex="0"
          onClick={() => handleSelectNamespace(item.id)}
        >
          {item.name}
        </StyledButton>
      ),
      width: '18%',
    },
    {
      label: 'Namespace ID',
      renderCell: item => (
        <div
          className="d-flex"
          style={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ width: 'max-content' }}>
            <TextRender text={item.id} />
          </div>
          <StyledDiv
            onClick={() => handleCopyToClipboard(item.id)}
            aria-label="Copy Namespace ID"
          >
            <IconButton>
              <CopyIcon />
            </IconButton>
          </StyledDiv>
        </div>
      ),
      width: '26%',
    },
    {
      label: 'Flow Name',
      renderCell: item => <TextRender text={item.flowName || 'N/A'} />,
      width: '18%',
    },
    {
      label: 'Bucket Name',
      renderCell: item => <TextRender text={item.bucketName || 'N/A'} />,
      width: '18%',
    },
    {
      label: 'Version',
      width: '8%',
      renderCell: item => <TextRender text={item.version || 'N/A'} />,
    },
    {
      label: 'Actions',
      width: '12%',
      renderCell: item => (
        <div className="d-flex" style={{ gap: 8 }}>
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
            <IconButton>
              <OpenEyeIcon />
            </IconButton>
          </button>
          <Button
            onClick={() => handleSelect(item.id)}
            disabled={
              !item.flowId ||
              !item.version ||
              item.flowId === 'N/A' ||
              item.version === 'N/A'
            }
            size="sm"
          >
            Select
          </Button>
        </div>
      ),
    },
  ];

  const handleCopyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clusterOptions = state.clusterList.map(item => ({
    label: item.name,
    value: item.id,
  }));

  function handleSelectNamespace(id) {
    fetchGridData({
      setState,
      module: 'namespaces',
      selectedSourceClusterId: state.selectedSourceClusterId,
      selectedNamespaceId: id,
    });

    setOffset(0);
    setState(prev => {
      const existingIds = new Set(prev.tempNamespacesData.map(item => item.id));
      const newData = state.gridData.namespaces.data.filter(
        item => !existingIds.has(item.id)
      );

      return {
        ...prev,
        selectedNamespaceId: id,
        tempNamespacesData: [...prev.tempNamespacesData, ...newData],
      };
    });
  }
  const handleSelect = id => {
    setState(prev => ({
      ...prev,
      selectedNamespaceId: id,
    }));

    setState(prev => {
      const existingIds = new Set(prev.tempNamespacesData.map(item => item.id));
      const newData = state.gridData.namespaces.data.filter(
        item => !existingIds.has(item.id)
      );
      return {
        ...prev,
        selectedNamespaceId: id,
        tempNamespacesData: [...prev.tempNamespacesData, ...newData],
        currentFlowId: id,
      };
    });

    navigate('/namespaces/deploy', {
      state: {
        id,
      },
    });
  };

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
    setOffset(0);
  }, [setState]);
  const [offset, setOffset] = useState(0);
  useEffect(() => {});
  const onBreadcrumbClick = e => {
    handleSelectNamespace(e.id);
  };
  const handleRefreshFunctionality = () => {
    fetchGridData({
      setState,
      module: 'namespaces',
      selectedSourceClusterId: state.selectedSourceClusterId,
    });
  };

  const handleRefresh = event => {
    setRefreshSelect(event.value);
  };

  useEffect(() => {
    if (refreshState !== false) {
      intervalRef.current = setInterval(
        handleRefreshFunctionality,
        refreshState
      );
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [refreshState]);

  const LIMIT = 10;
  return (
    <>
      <Grid
        isNamespace={true}
        LIMIT={LIMIT}
        offset={offset}
        setOffset={setOffset}
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        refreshOptions={REFRESH_OPTIONS}
        clusterOptions={clusterOptions}
        onBreadcrumbClick={onBreadcrumbClick}
        placeholder="Search Namespace, ID, Flow Name"
        handleRefresh={handleRefresh}
      />
      {/* <Deploy /> */}
      {/* <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} /> */}
    </>
  );
};
