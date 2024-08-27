import React from 'react';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const COLUMNS = [
    {
      label: KDFM.TIMESTAMP,
      renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
      width: '15%',
      sort: { sortKey: 'timestamp' },
    },
    {
      label: KDFM.EVENT,
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
      width: '10%',
    },
    {
      label: KDFM.ENTITY,
      renderCell: item => <TextRender text={item.entity || KDFM.NA} />,
      width: '10%',
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => (
        <TextRender text={item.message || KDFM.NA} capitalizeText={false} />
      ),
      width: '25%',
    },
    {
      label: KDFM.NAMESPACE,
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
      width: '10%',
      // sort: { sortKey: 'namespace' },
    },
    {
      label: KDFM.CLUSTER,
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
      width: '10%',
      // sort: { sortKey: 'cluster' },
    },
    {
      label: KDFM.STATUS,
      renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
      width: '10%',
    },
    {
      label: KDFM.UPDATE_BY,
      renderCell: item => <TextRender text={item.updated_by || KDFM.NA} />,
      width: '10%',
    },
  ];

  const sortFns = {
    namespace: data =>
      data.sort((a, b) => a.namespace.localeCompare(b.namespace)),
    cluster: data => data.sort((a, b) => a.cluster.localeCompare(b.cluster)),
    timestamp: data =>
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
  };

  return (
    <Grid
      module="activityHistory"
      title={KDFM.ACTIVITY_LIST}
      columns={COLUMNS}
      placeholder={KDFM.ACTIVITY_HISTORY_SEARCH_PLACEHOLDER}
      statusOptions={ACTIVITY_STATUS_OPTIONS}
      sortFns={sortFns}
    />
  );
};
