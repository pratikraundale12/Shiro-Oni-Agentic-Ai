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
import { CircleExclamationMarkIcon, SmallSearchIcon } from '../../assets';
import { theme } from '../../styles';

const KeycloakUsersModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    SettingsSelectors.getkeycloakUserListModalOpen
  );
  const userListData = useSelector(SettingsSelectors?.getKeycloakUserFetched);
  const userList = useMemo(
    () =>
      userListData?.map(item => ({
        ...item,
        email: item.email.replace(/\./g, '_dot_'),
        emailDisplay: item.email,
      })) || [],
    [userListData]
  );
  const roles = useSelector(RolesSelectors.getRoles);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
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
        newDefaultValues[`${user.email}`] = matchedRoles;
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
        <TextRender
          text={item?.emailDisplay}
          capitalizeText={false}
          toolTip={false}
        />
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
            name={`${item?.email}`}
            placeholder={'Select Role'}
            options={ROLES_OPTIONS || []}
            customOnChange={(hookFormOnChange, selected) => {
              hookFormOnChange(selected);
            }}
          />
        </>
      ),
    },
  ];

  const onSubmit = data => {
    const structuredPayload = Object.entries(data).map(([email, roles]) => ({
      email,
      role_ids: roles.map(role => role.value),
    }));
    const updatedEmailPayload = structuredPayload?.map(item => ({
      ...item,
      email: item.email.replace(/_dot_/g, '.'),
    }));

    const mergedArray = updatedEmailPayload.map(item => {
      const match = userListData.find(user => user.email === item.email);
      return match
        ? {
            ...item,
            username: match.username,
            first_name: match.first_name,
            last_name: match.last_name,
          }
        : item;
    });

    dispatch(SettingsActions.assignKeycloakRolesToUsers(mergedArray));
  };

  return (
    <>
      <Modal
        size="lg"
        title={'Keycloak Users'}
        isOpen={isModalOpen}
        onRequestClose={e => {
          e.preventDefault();
          setIsWarningModalOpen(true);
        }}
        primaryButtonText="Submit"
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '65%', minHeight: '90%', maxHeight: '90%' }}
        clickOutsideToClose={false}
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
      <Modal
        size="lg"
        title={'Warning'}
        isOpen={isWarningModalOpen}
        onRequestClose={() => {
          setIsWarningModalOpen(false);
        }}
        secondaryButtonText="Cancel"
        primaryButtonText="Close"
        onSubmit={() => {
          dispatch(SettingsActions.setkeycloakUserListModalOpen(false));
          setIsWarningModalOpen(false);
        }}
        footerAlign="start"
        contentStyles={{ minWidth: '25%' }}
        clickOutsideToClose={false}
      >
        <div style={{ fontSize: '18px', fontWeight: '500' }}>
          <CircleExclamationMarkIcon
            color={theme.colors.primary}
            width={22}
            height={22}
          />{' '}
          Closing this screen will result in loss of fetched data.
        </div>
      </Modal>
    </>
  );
};
export default KeycloakUsersModal;
