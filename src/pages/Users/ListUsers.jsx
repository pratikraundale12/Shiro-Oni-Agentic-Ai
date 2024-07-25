import { React } from 'react';
import styled from 'styled-components';

import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
} from '../../components';
import { AddUserModal } from './AddUserModal';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../utils';
import { deleteUserApi, getSingleUserData } from '../../utils/services';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
      renderCell: item => getActionsMenu(item),
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
