import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon } from '../assets';
import { SelectField } from '../shared';
import {
  RolesActions,
  RolesSelectors,
  UsersActions,
  UsersSelectors,
} from '../store';
import { SchedularSelectors } from '../store/schedular';
import { SettingsSelectors } from '../store/settings';

export const UserSelect = ({
  control,
  errors,
  name,
  label,
  placeholder,
  disabled,
}) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const settingData = useSelector(SettingsSelectors.getSettings);
  const approverGroups = settingData?.approver_groups || [];
  const approverOptions = approverGroups.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const RoleList = useSelector(RolesSelectors.getRoles);
  const userList = useSelector(UsersSelectors.getUsers);
  const AdminRole = RoleList?.find(item => item.name.toLowerCase() === 'admin');
  const [searchText, setSearchText] = useState('');
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const schedularExcludedList = userList.filter(
    item => item.id !== selectedSchedule?.deployer_id
  );
  schedularExcludedList;

  const handleChange = value => {
    setSearchText(value);
  };
  console.log(selected);
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
      options={approverOptions}
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
