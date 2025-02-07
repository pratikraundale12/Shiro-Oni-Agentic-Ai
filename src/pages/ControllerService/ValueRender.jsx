/*eslint-disable*/
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { NamespacesActions } from '../../store';
const ValueRender = ({
  item,
  handleAddValueModal,
  setSelectedPropertyToEdit,
}) => {
  const dispatch = useDispatch();
  const handleOpenPropertyDropDownModal = item => {
    dispatch(NamespacesActions.setIsAddPropertyDropdownModalOpen(true));
    setSelectedPropertyToEdit(item);
  };
  return (
    <>
      <div>
        {item?.empty_string_set ? (
          'Empty String Set'
        ) : item?.sensitive ? (
          'Sensitive value set'
        ) : item?.dropDownName ? (
          <div> {item?.dropDownName}</div>
        ) : item?.value ? (
          <div>{item?.value}</div>
        ) : (
          'No Value Set'
        )}
      </div>
    </>
  );
};
ValueRender.propTypes = {
  item: PropTypes.object.isRequired,
  handleAddValueModal: PropTypes.func,
};
export default ValueRender;
