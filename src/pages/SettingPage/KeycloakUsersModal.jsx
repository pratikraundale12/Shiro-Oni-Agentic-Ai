import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsActions, SettingsSelectors } from '../../store/settings';
import { InputField, Modal } from '../../shared';
import { StatusRender, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { useForm } from 'react-hook-form';
import { RolesSelectors } from '../../store';
import RegistryMultiSelect from './Multiselect';
import { isEmpty } from 'lodash';
import { SmallSearchIcon } from '../../assets';

const KeycloakUsersModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    SettingsSelectors.getkeycloakUserListModalOpen
  );
  const userList = useSelector(SettingsSelectors?.getKeycloakUserFetched);
  const roles = useSelector(RolesSelectors.getRoles);
  const [rolesUpdated, setRolesUpdated] = useState([]);
  const [searchText, setSearchText] = useState('');
  const filteredUsers = useMemo(() => {
    return userList?.filter(
      user =>
        user?.first_name?.toLowerCase().includes(searchText?.toLowerCase()) ||
        user?.last_name?.toLowerCase().includes(searchText?.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchText?.toLowerCase())
    );
  }, [searchText, userList]);

  const ROLES_OPTIONS = useMemo(() => {
    return roles?.map(ele => ({
      label: ele?.name,
      value: ele?.role_id,
    }));
  }, [roles]);

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!isEmpty(userList) && !isEmpty(ROLES_OPTIONS)) {
      const newDefaultValues = {};

      userList.forEach(user => {
        const userRoleIds = (user.role || []).map(r => r.role_id);
        const matchedRoles = ROLES_OPTIONS.filter(opt =>
          userRoleIds.includes(opt.value)
        );
        newDefaultValues[`${user.id}`] = matchedRoles;
      });
      reset(newDefaultValues);
    }
  }, [userList, ROLES_OPTIONS, reset]);

  const COLUMNS = [
    {
      label: <>{KDFM.NAME} </>,
      width: '20%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={`${item?.first_name || ''} ${item?.middle_name || ''} ${item?.last_name || ''}`}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },
    {
      label: <>{KDFM.USERNAME} </>,
      width: '20%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={item.username || ''}
          capitalizeText={false}
          toolTip={false}
        />
      ),
    },
    {
      label: KDFM.EMAIL,
      width: '20%',
      resize: true,
      renderCell: item => (
        <TextRender text={item?.email} capitalizeText={false} toolTip={false} />
      ),
    },

    {
      label: <>{KDFM.STATUS} </>,
      width: '10%',
      resize: true,
      renderCell: item => (
        <StatusRender status={item?.is_active ? 'Active' : 'Inactive'} />
      ),
    },
    {
      label: KDFM.ROLE,
      width: '30%',
      resize: true,
      renderCell: item => (
        <>
          <RegistryMultiSelect
            enableCheckboxes
            control={control}
            name={`${item?.id}`}
            placeholder={'Select Role'}
            options={ROLES_OPTIONS || []}
            customOnChange={(hookFormOnChange, selected, meta) => {
              const selectedIds = selected?.map(ele => ele?.value);
              setRolesUpdated(prev => {
                const existingIndex = prev.findIndex(
                  item => item.user_id === meta?.name
                );

                if (existingIndex !== -1) {
                  const updated = [...prev];
                  updated[existingIndex] = {
                    user_id: meta?.name,
                    role_ids: selectedIds,
                  };
                  return updated;
                }
                return [
                  ...prev,
                  { user_id: meta?.name, role_ids: selectedIds },
                ];
              });
              hookFormOnChange(selected);
            }}
          />
        </>
      ),
    },
  ];

  const onSubmit = () => {
    dispatch(SettingsActions.assignKeycloakRolesToUsers(rolesUpdated));
  };

  return (
    <>
      <Modal
        size="lg"
        title={'Keycloak Users'}
        isOpen={isModalOpen}
        onRequestClose={() =>
          dispatch(SettingsActions.setkeycloakUserListModalOpen(false))
        }
        secondaryButtonText="Cancel"
        primaryButtonText="Submit"
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '65%', minHeight: '90%', maxHeight: '90%' }}
        primaryButtonDisabled={isEmpty(rolesUpdated)}
      >
        <div>
          <InputField
            type="text"
            placeholder="Search by name, username"
            icon={<SmallSearchIcon />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <Table
          data={filteredUsers || []}
          columns={COLUMNS}
          className="variables-table"
          showPagination={true}
        />
      </Modal>
    </>
  );
};
export default KeycloakUsersModal;
