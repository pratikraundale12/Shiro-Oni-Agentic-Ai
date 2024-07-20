import React from 'react';
import { Grid } from '../../components/Table/Grid';
// import {Grid} from '../../components/Grid'
import {
  TextRender,
  StatusRender,
  ProfileRender,
  ActionRender,
} from '../../components/Table/tableCellRender';

export const ListUsers = () => {
  const COLUMNS = [
    {
      label: 'Profile',
      renderCell: item => <ProfileRender item={item} />,
      sort: { sortKey: 'PORFILE' },
    },

    {
      label: 'Name',
      renderCell: item => <TextRender text={item.username} />,
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Email',
      renderCell: item => <TextRender text={item.email} />,
      sort: { sortKey: 'EMAIL' },
    },
    {
      label: 'Role',
      renderCell: item => <TextRender text={item.type} />,
      sort: { sortKey: 'TYPE' },
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender status={item.is_active ? 'Active' : 'Inactive'} />
      ),
      sort: { sortKey: 'STATUS' },
    },
    {
      label: 'Actions',
      renderCell: item => <ActionRender item={item} />,
      sort: { sortKey: 'ACTIONS' },
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.username.localeCompare(b.username)),
    EMAIL: array => array.sort((a, b) => a.email.localeCompare(b.email)),
    TYPE: array => array.sort((a, b) => a.type.localeCompare(b.type)),
    STATUS: array => array.sort((a, b) => a.is_active - b.is_active),
  };

  return <Grid module="users" columns={COLUMNS} sortFns={SORT_FNS} />;
};
