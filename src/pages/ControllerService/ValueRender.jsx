/*eslint-disable*/
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NamespacesActions } from '../../store';
import { Tooltip as ReactTooltip } from 'react-tooltip';
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
      <div
        onClick={() =>
          !item?.isSelective
            ? handleAddValueModal(item)
            : handleOpenPropertyDropDownModal(item)
        }
        style={{ cursor: 'pointer' }}
        data-tooltip-id={`tooltip-${item.dropDownName}`}
      >
        {item?.empty_string_set ? (
          'Empty String Set'
        ) : item?.dropDownName ? (
          <div> {item?.dropDownName}</div>
        ) : item?.sensitive ? (
          'Sensitive value set'
        ) : item?.value ? (
          <div>{item?.value}</div>
        ) : (
          'No Value Set'
        )}
      </div>
      <ReactTooltip
        id={`tooltip-${item.dropDownName}`}
        place="right"
        content={'Click to edit'}
        style={{
          width: '110px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 9999,
        }}
      />
    </>
  );
};
ValueRender.propTypes = {
  item: PropTypes.object.isRequired,
  handleAddValueModal: PropTypes.func,
};
export default ValueRender;
