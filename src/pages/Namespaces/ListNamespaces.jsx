/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { TextRender, Grid, IconButton } from '../../components';
import { useGlobalContext } from '../../utils';
import { fetchGridData } from '../../store/index1';
// import AuditLog from './AuditLog';
import { Button } from '../../shared';
import { CopyIcon, OpenEyeIcon } from '../../assets';
import { REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';

export const ListNamespaces = () => {
  const dispatch = useDispatch();
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
        <button
          style={{
            color: '#C52B2B',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
          tabIndex="0"
          onClick={() => {
            dispatch(NamespacesActions.setFlowPath(item.flowId));
            dispatch(
              NamespacesActions.setSelectedNamespace({
                label: item.name,
                value: item.id,
              })
            );
          }}
        >
          {item.name}
        </button>
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
          <button
            onClick={() => handleCopyToClipboard(item.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '8px',
            }}
            aria-label="Copy Namespace ID"
          >
            <IconButton>
              <CopyIcon />
            </IconButton>
          </button>
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
            onClick={() => handleSelect(item)}
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

  function handleSelectNamespace(id) {
    fetchGridData({
      setState,
      module: 'namespaces',
      selectedSourceClusterId: state.selectedSourceClusterId,
      selectedNamespaceId: id,
    });

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
  const handleSelect = item => {
    dispatch(NamespacesActions.setFlowPath(item.flowId));
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: item.name,
        value: item.id,
      })
    );
    // setState(prev => ({
    //   ...prev,
    //   selectedNamespaceId: id,
    // }));

    // setState(prev => {
    //   const existingIds = new Set(prev.tempNamespacesData.map(item => item.id));
    //   const newData = state.gridData.namespaces.data.filter(
    //     item => !existingIds.has(item.id)
    //   );
    //   return {
    //     ...prev,
    //     selectedNamespaceId: id,
    //     tempNamespacesData: [...prev.tempNamespacesData, ...newData],
    //     currentFlowId: id,
    //   };
    // });

    history.push('/namespaces/deploy', {
      state: {
        id: item.id,
      },
    });
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

  return (
    <>
      <Grid
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        refreshOptions={REFRESH_OPTIONS}
        placeholder="Search Namespace, ID, Flow Name, Bucket Name"
        handleRefresh={handleRefresh}
      />
      {/* <Deploy /> */}
      {/* <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} /> */}
    </>
  );
};
