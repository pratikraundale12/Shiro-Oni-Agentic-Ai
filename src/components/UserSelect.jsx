import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon } from '../assets';
import defaultAvatarURL from '../assets/images/avatar.png';
import { SelectField } from '../shared';
import {
  RolesActions,
  RolesSelectors,
  UsersActions,
  UsersSelectors,
} from '../store';

export const UserSelect = ({ control, errors, name, label, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const RoleList = useSelector(RolesSelectors.getRoles);
  const userList = useSelector(UsersSelectors.getUsers);
  const AdminRole = RoleList?.find(item => item.name.toLowerCase() === 'admin');

  const handleChange = value => {
    setSearchText(value);
  };

  useEffect(() => {
    dispatch(
      UsersActions.fetchUsers({
        params: {
          ...(searchText && { search: searchText }),
          role_id: AdminRole?.role_id,
        },
      })
    );
  }, [dispatch, searchText, AdminRole]);

  useEffect(() => {
    dispatch(RolesActions.fetchRoles());
  }, [dispatch]);

  return (
    <SelectField
      label={label}
      name={name}
      control={control}
      icon={<UserIcon />}
      errors={errors}
      options={userList.map(({ id, photo, username }) => ({
        value: id,
        label: username,
        avatar: photo ? photo : defaultAvatarURL,
      }))}
      placeholder={placeholder}
      required
      onInputChange={handleChange}
      optionEntity="user"
      isMulti
    />
  );
};

UserSelect.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};
