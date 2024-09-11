import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ActivityHistoryIcon } from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import CopyToClipboard from '../../shared/CopyToClipboard';
import { NamespacesActions } from '../../store';
import { useGlobalContext } from '../../utils';
import AuditLog from './AuditLog';

const StyledButton = styled.button`
  color: #ff7a00;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-right: 0.5rem;
`;

export const ListNamespaces = () => {
  const dispatch = useDispatch();
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const { setState } = useGlobalContext();

  useEffect(() => {
    dispatch(NamespacesActions.resetDeployData());
  }, []);

  const sortFns = {
    name: array => sortByNameWithVersionFilter(array),
  };
  const state = {
    sortKey: 'name',
    reverse: false,
  };

  function sortByNameWithVersionFilter(arr) {
    const objectsWithVersion = arr.filter(item => item.version !== undefined);
    const objectsWithoutVersion = arr.filter(
      item => item.version === undefined
    );
    const sortedWithVersion = objectsWithVersion.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedWithoutVersion = objectsWithoutVersion.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return [...sortedWithVersion, ...sortedWithoutVersion];
  }

  const COLUMNS = [
    {
      label: KDFM.NAMESPACE,
      renderCell: item => (
        <StyledButton
          key={item.flowId}
          tabIndex="0"
          onClick={() => {
            setState(prev => ({ ...prev, search: '' }));
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
      sort: { sortKey: 'name' },
    },
    {
      label: KDFM.NAMESPACE_ID,
      renderCell: item => (
        <Flex>
          <TextRender text={item.id} />
          <CopyToClipboard copyItem={item.id} />
        </Flex>
      ),
      width: '30%',
    },
    {
      label: KDFM.FLOW_NAME,
      renderCell: item => <TextRender text={item.flowName || KDFM.NA} />,
    },
    {
      label: KDFM.BUCKET_NAME,
      renderCell: item => <TextRender text={item.bucketName || KDFM.NA} />,
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => (
        <div className="d-flex gap-3">
          <button
            onClick={() => {
              setIsAuditLogOpen(true);
              setSelectedRowId(item?.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label={KDFM.OPEN_AUDIT_LOG}
          >
            <IconButton>
              <ActivityHistoryIcon width={16} height={16} />
            </IconButton>
          </button>
          <Button
            style={{ minWidth: '113px', maxWidth: '113px' }}
            onClick={() => handleSelect(item)}
            disabled={
              !item.flowId ||
              !item.version ||
              item.flowId === KDFM.NA ||
              item.version === KDFM.NA
            }
            size="sm"
          >
            {KDFM.DEPLOY}
          </Button>
        </div>
      ),
    },
  ];

  const handleSelect = item => {
    dispatch(NamespacesActions.setFlowPath(item.flowId));
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: item.name,
        value: item.id,
      })
    );

    history.push('/process-group/deploy', {
      state: {
        id: item.id,
      },
    });
  };

  return (
    <>
      <Grid
        isNamespace={true}
        module="namespaces"
        title={KDFM.NAMESPACE_LIST}
        columns={COLUMNS}
        refreshOptions={REFRESH_OPTIONS}
        placeholder={KDFM.SEARCH_NAMESPACE_FLOW_BUCKET_NAME}
        sortFns={sortFns}
        state={state}
        // handleIconClick={handleIconClick}
      />
      {/* <Deploy /> */}
      {isAuditLogOpen && (
        <AuditLog
          key={selectedRowId}
          rowId={selectedRowId}
          isOpen={isAuditLogOpen}
          closePopup={() => setIsAuditLogOpen(false)}
        />
      )}
    </>
  );
};
