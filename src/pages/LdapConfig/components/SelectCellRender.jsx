import React from 'react';
import { SelectField } from '../../../shared';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  const sortedArray = roles?.map(item => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <>
      <StyledSelectField
        options={sortedArray}
        defaultValue={sortedArray?.find(
          option => option.value === data.role_id
        )}
        onChange={option => onChange(data, option)}
      />
    </>
  );
};

export default SelectCellRender;

SelectCellRender.propTypes = {
  roles: PropTypes.array,
  data: PropTypes.object,
  onChange: PropTypes.func,
};
