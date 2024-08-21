import React from 'react';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const COLUMNS = [
    {
      label: KDFM.TIMESTAMP,
      renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
    },
    {
      label: KDFM.EVENT,
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
    },
    {
      label: KDFM.ENTITY,
      renderCell: item => <TextRender text={item.entity || KDFM.NA} />,
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => <TextRender text={item.message || KDFM.NA} />,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
    },
    {
      label: KDFM.UPDATE_BY,
      renderCell: item => <TextRender text={item.updated_by || KDFM.NA} />,
    },
  ];

  return (
    <>
      <Grid
        module="activityHistory"
        title={KDFM.ACTIVITY_LIST}
        columns={COLUMNS}
        placeholder={KDFM.ACTIVITY_HISTORY_SEARCH_PLACEHOLDER}
        statusOptions={ACTIVITY_STATUS_OPTIONS}
      />
    </>
  );
};
