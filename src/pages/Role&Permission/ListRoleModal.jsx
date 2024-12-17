import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  DisabledUserIcon,
  NewLockIcon,
  PencilIcon,
  SmallSearchIcon,
} from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { Modal } from '../../shared';
import {
  AuthenticationSelectors,
  RolesActions,
  RolesSelectors,
} from '../../store';
import { theme } from '../../styles';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;

  & .parameter-context-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;
const SearchContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
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
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const [search, setSearch] = useState('');

  const filteredRoles = roles?.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  const COLUMNS = [
    {
      label: 'Role',
      renderCell: item => (
        <TextRender key={item?.name} text={item?.name} capitalizeText={true} />
      ),
      width: '40%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <TextRender
          text={item?.is_active ? 'Active' : 'Inactive'}
          capitalizeText={true}
        />
      ),
      width: '40%',
    },
    {
      label: 'Actions',
      width: '20%',
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'start', gap: 4 }}>
          {userPermissions.includes('edit_permission') && (
            <IconButton
              onClick={() => {
                dispatch(RolesActions.setRoleListSelectedItem(item));
                dispatch(RolesActions.roleModal(true));
                dispatch(RolesActions.setIsRoleListModalOpen(false));
              }}
              type="button"
            >
              <PencilIcon color="black" />
            </IconButton>
          )}

          {item?.is_active ? (
            <>
              {userPermissions.includes('edit_permission') && (
                <IconButton
                  type="button"
                  onClick={() => {
                    dispatch(RolesActions.setRoleListSelectedItem(item));
                    dispatch(
                      RolesActions.setIsDeleteConfirmationModelOpen(true)
                    );
                    dispatch(RolesActions.setIsRoleListModalOpen(false));
                  }}
                >
                  <NewLockIcon />
                </IconButton>
              )}
            </>
          ) : (
            <IconButton>
              <DisabledUserIcon color="black" />
            </IconButton>
          )}
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
        {...(userPermissions.includes('add_permission')
          ? {
              primaryButtonText: 'Add Role',
              onSubmit: handleOpenAddModal,
            }
          : { hideFooter: true })}
        contentStyles={{ minWidth: '40%' }}
      >
        <SearchContainer>
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="search"
            value={search}
            placeholder="Search DFM access"
            onChange={e => {
              const value = e.target.value;
              if (value.length <= 100) {
                setSearch(value);
              }
            }}
          />
        </SearchContainer>
        <ModalBody className="modal-body">
          <Table
            data={filteredRoles || []}
            columns={COLUMNS}
            className={'parameter-context-table'}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ListRoleModal;
