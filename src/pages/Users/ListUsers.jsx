import { React, useState } from 'react';
import styled from 'styled-components';
// import { Grid } from '../../components/Grid';
import { Model } from '../../shared';
import DeleteModalContent from '../../shared/Modal/DeleteModelContent';
import ModelCreateUser from '../../components/UserManagement/modelCreateUser';
import { DeleteSmallIcon, PencilIcon } from '../../assets';

import {
  Grid,
  TextRender,
  StatusRender,
  ProfileRender,
} from '../../components';
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addUserModel, setAddUserModel] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [deleteUserId, setDeleteUserId] = useState(null);

  const openModal = id => {
    setDeleteUserId(id);
    setModalIsOpen(true);
  };
  const openAddUserModal = () => {
    setAddUserModel(true);
  };
  const closeDeleteModel = () => {
    setModalIsOpen(false);
  };

  const deleteUser = async event => {
    event.preventDefault();
    const [response, error] = await deleteUserApi(deleteUserId);
    if (response) {
      toast.success('User Deleted Sucessfully');
    } else if (error) {
      toast.error('Error Occured');
    }
    setDeleteUserId(null);
    closeDeleteModel(false);
  };

  const editUser = async item => {
    const [response, error] = await getSingleUserData(item?.id);
    if (response) {
      console.log(response.data);
      setEditUserData(response?.data);
      openAddUserModal();
    } else if (error) {
      toast.error('Error Occured');
    }
  };
  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconWrapper onClick={() => editUser(item)}>
          <PencilIcon color="white" />
        </IconWrapper>
        <IconWrapper onClick={() => openModal(item?.id)}>
          <DeleteSmallIcon color="white" />
        </IconWrapper>
      </ActionTd>
    </div>
  );

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
    <>
      <Model
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        size="sm"
        leftButtonText="Cancel"
        rightButtonText="Delete"
        title="Delete User"
        closeModal={closeDeleteModel}
        rightButtonAction={deleteUser}
      >
        <DeleteModalContent />
      </Model>
      <ModelCreateUser
        addUserModel={addUserModel}
        setAddUserModel={setAddUserModel}
        editUserData={editUserData}
      />
      <Container>
        <Grid
          title="User List"
          module="users"
          buttonText="Add New User"
          columns={COLUMNS}
          sortFns={SORT_FNS}
          statusOptions={STATUS_OPTIONS}
          refreshOptions={REFRESH_OPTIONS}
          buttonAction={openAddUserModal}
        />
      </Container>{' '}
    </>
  );
};
