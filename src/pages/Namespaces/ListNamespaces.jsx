import React, { useEffect, useRef, useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
// import AuditLog from './AuditLog';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { OpenEyeIcon } from '../../assets';
import { REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import CopyToClipboard from '../../shared/CopyToClipboard';
import { GridActions, NamespacesActions } from '../../store';
// import Deploy from './Deploy';

const StyledButton = styled.button`
  color: #ff7a00;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

export const ListNamespaces = () => {
  const dispatch = useDispatch();
  const [refreshState, setRefreshSelect] = useState(false);
  const intervalRef = useRef(null);
  // const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  useEffect(() => {
    dispatch(NamespacesActions.resetDeployData());
  }, []);

  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => (
        <StyledButton
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
          <CopyToClipboard copyItem={item.id} />
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

  // function handleSelectNamespace(id) {
  //   fetchGridData({
  //     setState,
  //     module: 'namespaces',
  //     selectedSourceClusterId: state.selectedSourceClusterId,
  //     selectedNamespaceId: id,
  //   });

  //   // setOffset(0);
  //   setState(prev => {
  //     const existingIds = new Set(prev.tempNamespacesData.map(item => item.id));
  //     const newData = state.gridData.namespaces.data.filter(
  //       item => !existingIds.has(item.id)
  //     );

  //     return {
  //       ...prev,
  //       selectedNamespaceId: id,
  //       tempNamespacesData: [...prev.tempNamespacesData, ...newData],
  //     };
  //   });
  // }
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

  // useEffect(() => {
  //   fetchGridData({
  //     setState,
  //     module: 'clusters',
  //   });
  //   setOffset(0);
  // }, [setState]);
  // const [offset, setOffset] = useState(0);

  const handleRefresh = event => {
    setRefreshSelect(event.value);
  };

  useEffect(() => {
    if (refreshState !== false) {
      intervalRef.current = setInterval(
        () => dispatch(GridActions.fetchGrid({ module: 'namespaces' })),
        refreshState
      );
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [dispatch, refreshState]);

  // const LIMIT = 10;
  return (
    <>
      <Grid
        // isNamespace={true}
        // LIMIT={LIMIT}
        // offset={offset}
        // setOffset={setOffset}
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
