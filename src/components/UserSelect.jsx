import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import { UserIcon } from '../assets';
import defaultAvatarURL from '../assets/images/avatar.png';
import { SelectField } from '../shared';
import {
  AuthenticationSelectors,
  RolesActions,
  RolesSelectors,
  UsersActions,
  UsersSelectors,
} from '../store';
import { useLocation } from 'react-router-dom';
import { SchedularSelectors } from '../store/schedular';

export const UserSelect = ({
  control,
  errors,
  name,
  label,
  placeholder,
  disabled,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [selected, setSelected] = useState([]);
  const RoleList = useSelector(RolesSelectors.getRoles);
  const userList = useSelector(UsersSelectors.getUsers);
  const AdminRole = RoleList?.find(item => item.name.toLowerCase() === 'admin');
  const [searchText, setSearchText] = useState('');
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const updatedArray = userList.filter(item => item.id !== currentUser.id);
  const schedularExcludedList = userList.filter(
    item => item.id !== selectedSchedule?.deployer_id
  );
  schedularExcludedList;
  const displayArray = location?.pathname?.includes('/summary')
    ? updatedArray
    : !isEmpty(selectedSchedule)
      ? schedularExcludedList
      : userList;

  const handleChange = value => {
    setSearchText(value);
  };

  useEffect(() => {
    if (!isEmpty(AdminRole))
      dispatch(
        UsersActions.fetchUsers({
          params: {
            ...(searchText && { search: searchText }),
            role_id: AdminRole?.role_id,
          },
        })
      );
  }, [dispatch, AdminRole]);

  useEffect(() => {
    if (isEmpty(AdminRole)) dispatch(RolesActions.fetchRoles());
  }, [dispatch, AdminRole]);
  return (
    <SelectField
      label={label}
      name={name}
      control={control}
      icon={<UserIcon />}
      errors={errors}
      options={[
        ...selected.map(item => ({
          id: item.value,
          username: item.label,
          photo: item.avatar,
        })),
        ...displayArray,
      ].map(({ id, photo, username }) => ({
        value: id,
        label: username,
        avatar: photo ? photo : defaultAvatarURL,
      }))}
      placeholder={placeholder}
      required
      onInputChange={handleChange}
      optionEntity="user"
      isMulti
      onChange={values => setSelected(values)}
      disabled={disabled}
    />
  );
};

UserSelect.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
