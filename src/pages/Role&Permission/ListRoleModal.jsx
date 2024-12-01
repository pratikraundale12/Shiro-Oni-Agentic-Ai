import React from 'react';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { IconButton, Table, TextRender } from '../../components';
import { DeleteSmallIcon, PencilIcon } from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { RolesActions, RolesSelectors } from '../../store';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;

  & .parameter-context-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;
const ListRoleModal = () => {
  const dispatch = useDispatch();
  const modalOpen = useSelector(RolesSelectors.getIsRoleListModalOpen);
  const roles = useSelector(RolesSelectors.getRoles);
  const closePopup = () => {
    dispatch(RolesActions.setIsRoleListModalOpen(false));
    dispatch(RolesActions.setRoleListSelectedItem({}));
  };
  const handleOpenAddModal = () => {
    dispatch(RolesActions.roleModal(true));
    closePopup();
  };

  const COLUMNS = [
    {
      label: 'Role',
      renderCell: item => (
        <TextRender key={item?.name} text={item?.name} capitalizeText={true} />
      ),
      width: '80%',
    },
    {
      label: 'Actions',
      width: '20%',
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {
            <IconButton
              onClick={() => {
                dispatch(RolesActions.setRoleListSelectedItem(item));
                dispatch(RolesActions.roleModal(true));
                dispatch(RolesActions.setIsRoleListModalOpen(false));
              }}
              type="button"
            >
              {<PencilIcon color="black" />}
            </IconButton>
          }
          {
            <IconButton
              type="button"
              onClick={() => {
                dispatch(RolesActions.setRoleListSelectedItem(item));
                dispatch(RolesActions.setIsDeleteConfirmationModelOpen(true));
                dispatch(RolesActions.setIsRoleListModalOpen(false));
              }}
            >
              <DeleteSmallIcon color="black" />
            </IconButton>
          }
        </div>
      ),
    },
  ];
  return (
    <>
      <Modal
        title={'Roles'}
        isOpen={modalOpen}
        onRequestClose={closePopup}
        size="md"
        secondaryButtonText={'Cancel'}
        primaryButtonText={'Add Role'}
        onSubmit={handleOpenAddModal}
      >
        <ModalBody className="modal-body">
          <Table
            data={roles || []}
            columns={COLUMNS}
            className={'parameter-context-table'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ListRoleModal;
