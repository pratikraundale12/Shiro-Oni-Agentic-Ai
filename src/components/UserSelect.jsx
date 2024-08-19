import React, { useEffect, useState } from 'react';
import { SelectField } from '../shared';
import { UserIcon } from '../assets';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { UsersActions, UsersSelectors } from '../store';

export const UserSelect = ({ control, errors }) => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const userList = useSelector(UsersSelectors.getUsers);
  const handleChange = value => {
    setSearchText(value);
  };
  useEffect(() => {
    dispatch(UsersActions.fetchUsers({ params: { search: searchText } }));
  }, [dispatch, searchText]);
  return (
    <SelectField
      label="Approver"
      name="namespace"
      control={control}
      icon={<UserIcon />}
      errors={errors}
      options={userList.map(({ id, username }) => ({
        value: id,
        label: username,
      }))}
      placeholder="Select atleast one approver"
      required
      onInputChange={handleChange}
    />
  );
};

UserSelect.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
};
