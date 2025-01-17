import React, { useState } from 'react';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
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
  const COLUMNS = [
    {
      label: KDFM.EVENT,
      width: '10%',
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
    },
    {
      label: KDFM.ENTITY,
      width: '10%',
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
      label: KDFM.NAMESPACE,
      width: '10%',
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
      sort: { sortKey: 'namespace' },
    },
    {
      label: KDFM.FLOW_NAME,
      width: '10%',
      renderCell: item => <TextRender text={item.flow_name || KDFM.NA} />,
    },
    {
      label: KDFM.CLUSTER,
      width: '10%',
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
      sort: { sortKey: 'cluster' },
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => (
        <TextRender text={item.message || KDFM.NA} capitalizeText={false} />
      ),
      width: '12%',
    },
    {
      label: KDFM.VERSION,
      width: '8%',
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
    },
    {
      label: KDFM.STATUS,
      width: '8%',
      renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
    },
    {
      label: KDFM.TIMESTAMP,
      width: '12%',
      renderCell: item => (
        <TextRender text={convertDateTime(item.timestamp) || KDFM.NA} />
      ),
      sort: { sortKey: 'timestamp' },
    },
    {
      label: KDFM.CREATED_BY,
      width: '10%',
      renderCell: item => <TextRender text={item.created_by_name || KDFM.NA} />,
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
    />
  );
};
