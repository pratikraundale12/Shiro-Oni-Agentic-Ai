/*eslint-disable*/
import PropTypes from 'prop-types';
import React from 'react';
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
      {item?.dropDownName ? (
        <div>{item?.dropDownName}</div>
      ) : item?.sensitive ? (
        'Sensitive value set'
      ) : item?.value ? (
        <div>{item?.value}</div>
      ) : (
        'No Set Value'
      )}
    </div>
  );
};
ValueRender.propTypes = {
  item: PropTypes.object.isRequired,
  handleAddValueModal: PropTypes.func,
};
export default ValueRender;
