import React, { useState } from 'react';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const COLUMNS = [
    {
      label: KDFM.EVENT,
      renderCell: item => (
        <TextRender text={item.event || KDFM.NA} toolTip={false} />
      ),
    },
    {
      label: KDFM.ENTITY,
      renderCell: item => <TextRender text={item.entity || KDFM.NA} />,
    },
    {
      label: KDFM.NAMESPACE,
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
      sort: { sortKey: 'namespace' },
    },
    {
      label: KDFM.FLOW_NAME,
      renderCell: item => <TextRender text={item.flow_name || KDFM.NA} />,
    },
    {
      label: KDFM.CLUSTER,
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
      sort: { sortKey: 'cluster' },
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => (
        <TextRender text={item.message || KDFM.NA} capitalizeText={false} />
      ),
      width: '20%',
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
    },
    {
      label: KDFM.TIMESTAMP,
      renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
      sort: { sortKey: 'timestamp' },
    },
    {
      label: KDFM.CREATED_BY,
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
