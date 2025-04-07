import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SelectField } from '../../../shared';
import { RolesSelectors } from '../../../store';

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
  const ldapGroup = useSelector(RolesSelectors.getLdapGroup);
  const existingRole = ldapGroup.find(
    item => item.ldap_group_name === data.name
  );

  const sortedArray = roles?.map(item => ({
    label: item.name,
    value: item.role_id,
  }));

  return (
    <>
      <StyledSelectField
        options={sortedArray}
        value={sortedArray?.find(
          option => option.value === existingRole?.role_id
        )}
        onChange={option => onChange(data, option)}
      />
    </>
  );
};

SelectCellRender.propTypes = {
  roles: PropTypes.array,
  data: PropTypes.object,
  onChange: PropTypes.func,
};

export default SelectCellRender;
