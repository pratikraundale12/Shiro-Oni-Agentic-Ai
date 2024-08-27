import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon } from '../assets';
import defaultAvatarURL from '../assets/images/avatar.png';
import { SelectField } from '../shared';
import { UsersActions, UsersSelectors } from '../store';

export const UserSelect = ({ control, errors, name, label, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const userList = useSelector(UsersSelectors.getUsers);
  const AdminList = userList?.filter(item => item.role === 'admin');
  const handleChange = value => {
    setSearchText(value);
  };
  useEffect(() => {
    dispatch(
      UsersActions.fetchUsers({
        params: { ...(searchText && { search: searchText }) },
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
      options={AdminList.map(({ id, photo, username }) => ({
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
