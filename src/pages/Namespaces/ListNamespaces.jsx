import React, { useEffect } from 'react';

import { TextRender, Grid } from '../../components';
import { fetchGridData, REFRESH_OPTIONS, useGlobalContext } from '../../utils';
import { Button } from '../../shared';
import { OpenEyeIcon } from '../../assets';
import { useNavigate } from 'react-router-dom';
// import Deploy from './Deploy';

export const ListNamespaces = () => {
  const navigate = useNavigate();
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
          }}
          tabIndex="0"
          onClick={() => handleSelectNamespace(item.id)}
        >
          {item.name}
        </button>
      ),
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
      // width: '10%',
      renderCell: item => <TextRender text={item.version || 'N/A'} />,
    },
    // {
    //   width: '10%',
    //   renderCell: () => (
    //     <button
    //       // onClick={handleOpenAuditLog}
    //       style={{
    //         background: 'none',
    //         border: 'none',
    //         padding: 0,
    //         cursor: 'pointer',
    //       }}
    //       aria-label="Open Audit Log"
    //     >
    //       <OpenEyeIcon />
    //     </button>
    //   ),
    // },
    {
      label: 'Actions',
      // width: '10%',
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
            <OpenEyeIcon />
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
  }, [setState]);

  const onBreadcrumbClick = e => {
    handleSelectNamespace(e.id);
  };

  return (
    <>
      <Grid
        module="namespaces"
        title="Namespaces List"
        columns={COLUMNS}
        refreshOptions={REFRESH_OPTIONS}
        clusterOptions={clusterOptions}
        onBreadcrumbClick={onBreadcrumbClick}
        placeholder="Search Namespace, ID, Flow Name, Bucket Name"
      />
      {/* <Deploy /> */}
      {/* <AuditLog isOpen={isAuditLogOpen} closePopup={handleCloseAuditLog} /> */}
    </>
  );
};
