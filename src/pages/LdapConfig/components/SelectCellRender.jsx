import React from 'react';
import { SelectField } from '../../../shared';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { RolesActions, RolesSelectors } from '../../../store';

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
  //   const dispatch = useDispatch();
  //   const roles = useSelector(RolesSelectors.getRoles);

  //   const [kdfList, setKdfList] = useState([]);
  //   //   const { control } = useForm();

  //   useEffect(() => {
  //     dispatch(RolesActions.fetchRoles());
  //   }, [dispatch]);

  //   useEffect(() => {
  //     const sortedArray = roles?.map(item => ({
  //       label: item.name,
  //       value: item.id,
  //       ldap_group_name: item.ldap_group_name,
  //     }));
  //     setKdfList(sortedArray);
  //   }, [roles]);

  //   console.log('sorted', kdfList);

  //   const defaultValue = kdfList.find(
  //     option => option.ldap_group_name === dfmGroup
  //   );
  //   console.log(defaultValue, 'dd');

  const sortedArray = roles?.map(item => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <>
      <StyledSelectField
        options={sortedArray}
        //   control={control}
        defaultValue={sortedArray.find(option => option.value === data.role_id)}
        //   onChange={event => onChange(event, item)}
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
