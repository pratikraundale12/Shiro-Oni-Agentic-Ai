import React, { useState, useEffect, useRef } from 'react';
import { SelectField } from '../../../shared';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AddNewRoleModal from '../../../shared/AddNewRoleModal';
import { useDispatch } from 'react-redux';
import { RolesActions } from '../../../store';

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;

  .react-select__control {
    border-radius: 8px;
  }

  .react-select__value-container {
    padding: 2px;
  }

  .react-select__multi-value {
    background-color: ${props => props.theme.colors.lightGrey};
    border-radius: 6px;
  }
`;

const SelectCellRender = ({ onChange, roles, data }) => {
  console.log(data, 'lllllllll');
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const selectedOptionRef = useRef(selectedOption);

  const dispatch = useDispatch();

  const sortedArray = roles?.map(item => ({
    label: item.name,
    value: item.id,
  }));

  const handleCreateOption = inputValue => {
    setSelectedOption(inputValue);
    selectedOptionRef.current = inputValue;
    setOpenRoleModal(true);
    dispatch(RolesActions.roleModal());
  };

  useEffect(() => {
    // Set the ref value on every render so it persists
    selectedOptionRef.current = selectedOption;
  }, [selectedOption]);

  return (
    <>
      <StyledSelectField
        options={sortedArray}
        value={sortedArray?.find(option => option.value === data.role_id)}
        onChange={option => onChange(data, option)}
        ldap={true}
        handleCreateOption={handleCreateOption}
      />

      {openRoleModal && (
        <AddNewRoleModal
          openRoleModal={openRoleModal}
          setOpenRoleModal={setOpenRoleModal}
          selectedOption={selectedOptionRef.current}
          ldapGroupName={data.ldap_group_name}
        />
      )}
    </>
  );
};

SelectCellRender.propTypes = {
  roles: PropTypes.array,
  data: PropTypes.object,
  onChange: PropTypes.func,
};

export default SelectCellRender;
