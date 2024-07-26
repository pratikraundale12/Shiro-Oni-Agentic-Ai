import React from 'react';
import styled from 'styled-components';

import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
  ActionRender,
} from '../../components';
import { AddUserModal } from './AddUserModal';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../utils';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

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
      width: 120,
      renderCell: item => <ActionRender item={item} />,
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.username.localeCompare(b.username)),
    EMAIL: array => array.sort((a, b) => a.email.localeCompare(b.email)),
    TYPE: array => array.sort((a, b) => a.type.localeCompare(b.type)),
    STATUS: array => array.sort((a, b) => a.is_active - b.is_active),
  };

  return (
    <Container>
      <Grid
        module="users"
        title="User List"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
        addModal={AddUserModal}
      />
    </Container>
  );
};
