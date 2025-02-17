import React, { useState } from 'react';
import { SortDownIcon, SortUpIcon } from '../../assets';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('');
  const toggleSorting = column => {
    setSortingState(prevState =>
      prevState === column ? `-${column}` : column
    );
  };
  const convertDateTime = dateString => {
    if (!dateString) return 'No date provided';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getSortIcon = (sortingState, type) => {
    return sortingState === type ? <SortUpIcon /> : <SortDownIcon />;
  };
  const COLUMNS = [
    {
      label: (
        <button
          onClick={() => toggleSorting('event')}
          style={{ background: 'none' }}
        >
          {KDFM.EVENT}
          {getSortIcon(sortingState, 'event')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('entity')}
          style={{ background: 'none' }}
        >
          {KDFM.ENTITY}
          {getSortIcon(sortingState, 'entity')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={
            item?.entity === 'Ldap'
              ? item?.entity?.toUpperCase()
              : item?.entity || KDFM.NA
          }
        />
      ),
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('namespace')}
          style={{ background: 'none' }}
        >
          {KDFM.NAMESPACE}
          {getSortIcon(sortingState, 'namespace')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
      sort: { sortKey: 'namespace' },
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('flow_name')}
          style={{ background: 'none' }}
        >
          {KDFM.FLOW_NAME} {getSortIcon(sortingState, 'flow_name')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => <TextRender text={item.flow_name || KDFM.NA} />,
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('cluster')}
          style={{ background: 'none' }}
        >
          {KDFM.CLUSTER} {getSortIcon(sortingState, 'cluster')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
      sort: { sortKey: 'cluster' },
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => (
        <TextRender text={item.message || KDFM.NA} capitalizeText={false} />
      ),
      width: '12%',
      resize: true,
    },
    {
      label: KDFM.VERSION,
      width: '8%',
      resize: true,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('status')}
          style={{ background: 'none' }}
        >
          {KDFM.STATUS} {getSortIcon(sortingState, 'status')}
        </button>
      ),
      width: '8%',
      resize: true,
      renderCell: item => (
        <StatusRender status={item.status || KDFM.NA} redColor="#FF0000" />
      ),
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('timestamp')}
          style={{ background: 'none' }}
        >
          {KDFM.TIMESTAMP} {getSortIcon(sortingState, 'timestamp')}
        </button>
      ),
      width: '12%',
      resize: true,
      renderCell: item => (
        <TextRender text={convertDateTime(item.timestamp) || KDFM.NA} />
      ),
      sort: { sortKey: 'timestamp' },
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('created_by_name')}
          style={{ background: 'none' }}
        >
          {KDFM.CREATED_BY} {getSortIcon(sortingState, 'created_by_name')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={item.created_by_name || KDFM.NA}
          withEllipses={true}
        />
      ),
    },
  ];

  const sortFns = {
    namespace: data =>
      data.sort((a, b) =>
        (a?.namespace || '').localeCompare(b?.namespace || '')
      ),
    cluster: data =>
      data.sort((a, b) => (a?.cluster || '').localeCompare(b?.cluster || '')),
    timestamp: data =>
      data.sort(
        (a, b) => new Date(a?.timestamp || 0) - new Date(b?.timestamp || 0)
      ),
  };

  return (
    <Grid
      module="activityHistory"
      title={KDFM.ACTIVITY_LIST}
      columns={COLUMNS}
      placeholder={KDFM.ACTIVITY_HISTORY_SEARCH_PLACEHOLDER}
      statusOptions={ACTIVITY_STATUS_OPTIONS}
      sortFns={sortFns}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      sortingState={sortingState}
      setSortingState={setSortingState}
      itemsPerPage={20}
    />
  );
};
