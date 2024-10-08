import React, { useEffect } from 'react';

import { Table } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { NamespacesActions, NamespacesSelectors } from '../../store';

export const ListControllerService = () => {
  const dispatch = useDispatch();
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.name,
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => item?.type,
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => item?.bundle?.group,
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => item?.state,
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: () => 'hello',
      width: '15%',
    },
    {
      label: 'Actions',
      renderCell: () => 'hello',
      width: '10%',
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, []);

  return (
    <>
      <Table data={listData || []} columns={COLUMNS} />
    </>
  );
};
