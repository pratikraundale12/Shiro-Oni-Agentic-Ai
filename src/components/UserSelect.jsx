import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon } from '../assets';
import defaultAvatarURL from '../assets/images/avatar.png';
import { SelectField } from '../shared';
import { RolesSelectors, UsersActions, UsersSelectors } from '../store';

export const UserSelect = ({ control, errors, name, label, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const RoleList = useSelector(RolesSelectors.getRoles);
  const userList = useSelector(UsersSelectors.getUsers);
  const AdminList = RoleList?.filter(
    item => item.name.toLowerCase() === 'admin'
  );
  const handleChange = value => {
    setSearchText(value);
  };
  useEffect(() => {
    dispatch(
      UsersActions.fetchUsers({
        params: { ...(searchText && { search: searchText }) },
        admin_role_id: AdminList[0]?.role_id,
      })
    );
  }, [dispatch, searchText]);
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
