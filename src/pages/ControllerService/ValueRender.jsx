/*eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
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
    <div
      onClick={() =>
        !item?.isSelective
          ? handleAddValueModal(item)
          : handleOpenPropertyDropDownModal(item)
      }
      style={{ cursor: 'pointer' }}
    >
      {item?.empty_string_set ? (
        'Empty String Set'
      ) : item?.dropDownName ? (
        <div>{item?.dropDownName}</div>
      ) : item?.sensitive ? (
        'Sensitive value set'
      ) : item?.value ? (
        <div>{item?.value}</div>
      ) : (
        'No Value Set'
      )}
    </div>
  );
};
ValueRender.propTypes = {
  item: PropTypes.object.isRequired,
  handleAddValueModal: PropTypes.func,
};
export default ValueRender;
