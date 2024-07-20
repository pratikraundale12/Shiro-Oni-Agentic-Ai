import { React, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '../../components/Grid';
import { Model } from '../../shared';
import DeleteModalContent from '../../shared/Modal/DeleteModelContent';

const Container = styled.div`
  padding: 1.4rem;
`;

export const ListUsers = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item.first_name,
      sort: { sortKey: 'NAME' },
    },
    {
      label: 'Email',
      renderCell: item => item.email,
      sort: { sortKey: 'EMAIL' },
    },
    { label: 'Role', renderCell: item => item.type, sort: { sortKey: 'TYPE' } },
    {
      label: 'Status',
      renderCell: item => (item.is_active ? 'Active' : 'Inactive'),
      sort: { sortKey: 'STATUS' },
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
    AGE: array => array.sort((a, b) => a.name - b.name),
  };

  return (
    <>
      <Model
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        size="sm"
      >
        <DeleteModalContent />
      </Model>
      <Container>
        <Grid module="users" columns={COLUMNS} sortFns={SORT_FNS} />
        <button onClick={openModal}>hello</button>
      </Container>{' '}
    </>
  );
};
