import { React, useState } from 'react';
import styled from 'styled-components';
// import { Grid } from '../../components/Grid';
import { Model } from '../../shared';
import DeleteModalContent from '../../shared/Modal/DeleteModelContent';

import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
  ActionRender,
} from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../utils';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

export const ListUsers = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addUserModel, setAddUserModel] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };
  const openAddUserModal = () => {
    setAddUserModel(true);
  };
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
    <>
      <Model
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        size="sm"
        leftButtonText="Cancel"
        rightButtonText="Delete"
      >
        <DeleteModalContent />
      </Model>
      <Model
        setModalIsOpen={setAddUserModel}
        modalIsOpen={addUserModel}
        size="lg"
        leftButtonText="Cancel"
        rightButtonText="Add"
      >
        ADD
      </Model>
      <button onClick={openModal}>hello</button>
      <button onClick={openAddUserModal}>ADD User</button>
      <Container>
        <Grid
          title="User List"
          module="users"
          buttonText="Add New User"
          columns={COLUMNS}
          sortFns={SORT_FNS}
          statusOptions={STATUS_OPTIONS}
          refreshOptions={REFRESH_OPTIONS}
        />
      </Container>{' '}
    </>
  );
};
