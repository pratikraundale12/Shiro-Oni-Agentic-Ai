import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Grid, StatusRender, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';

export const ActvityHistory = () => {
  const COLUMNS = [
    {
      label: KDFM.TIMESTAMP,
      renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
      width: '10%',
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
        <div>
          <TextRender
            data-tooltip-id={item.message}
            text={item.message || KDFM.NA}
            style={{ display: 'inline-block' }}
          />
          <ReactTooltip
            id={item.message}
            content={item.message}
            place="bottom"
          />
        </div>
      ),
      width: '50%',
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

  return (
    <Grid
      module="activityHistory"
      title={KDFM.ACTIVITY_LIST}
      columns={COLUMNS}
      placeholder={KDFM.ACTIVITY_HISTORY_SEARCH_PLACEHOLDER}
      statusOptions={ACTIVITY_STATUS_OPTIONS}
    />
  );
};
