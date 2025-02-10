import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { KDFM } from '../../constants';
import { CheckboxField, InputField, Modal } from '../../shared';
import { isEmpty, isEqual } from 'lodash';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const DEFAULT_VALUES = {
  name: '',
  value: '',
};

const AddOrEditVariablesModal = ({
  closePopup,
  isAddVariablesOpen,
  setIsAddVariablesOpen,
  handleSave,
  variablesDetailsData,
  editVariableData,
}) => {
  const [formData, setFormData] = useState(
    isAddVariablesOpen?.mode === 'edit' ? editVariableData : DEFAULT_VALUES
  );
  const [isChecked, setIsChecked] = useState(false);
  const [valPlaceHolder, setValPlaceHolder] = useState('');

  const isValueChanged = (obj1, obj2) => {
    return isEqual(obj1, obj2);
  };

  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(
    !isEmpty(editVariableData) && !isEmpty(formData)
      ? isValueChanged(editVariableData, formData)
      : false
  );
  useEffect(() => {
    setIsSaveBtnDisabled(
      !isEmpty(editVariableData) && !isEmpty(formData)
        ? isValueChanged(editVariableData, formData)
        : false
    );
  }, [formData]);
  useEffect(() => {
    isChecked
      ? setValPlaceHolder(KDFM.SET_EMPTY_STRING)
      : setValPlaceHolder('');
  }, [isChecked]);

  const handleInputChange = data => {
    const { name, value } = data.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = event => {
    const { checked } = event.target;
    setFormData(prev => ({
      ...prev,
      check: checked,
    }));
    checked &&
      setFormData(prev => ({
        ...prev,
        value: '',
      }));
    setIsChecked(checked);
  };

  const handleAddEditVariables = () => {
    if (!formData) return;
    const isDuplicate =
      isAddVariablesOpen?.mode === 'add' &&
      variablesDetailsData.some(group =>
        group.variables.some(
          variable =>
            variable.name.toLowerCase() === formData?.name?.toLowerCase()
        )
      );
    if (isDuplicate) {
      toast.info(KDFM.VARIABLE_ALREADY_EXISTS);
      return;
    }
    handleSave(formData);
    isAddVariablesOpen?.mode === 'edit'
      ? toast.success(KDFM.VARIABLE_EDITED)
      : toast.success(KDFM.VARIABLE_ADDED);
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
  };

  return (
    <Modal
      title={
        isAddVariablesOpen?.mode === 'add'
          ? KDFM.ADD_VARIABLES
          : KDFM.EDIT_VARIABLES
      }
      isOpen={isAddVariablesOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText={KDFM.CANCEL}
      primaryButtonText={KDFM.SAVE}
      footerAlign="start"
      onSubmit={() => handleAddEditVariables()}
      primaryButtonDisabled={
        !isEmpty(editVariableData) && !isEmpty(formData)
          ? isSaveBtnDisabled
          : false
      }
    >
      <ModalBody className="modal-body">
        <form>
          <InputField
            name="name"
            type="text"
            label={KDFM.NAME}
            icon={<QRIcons />}
            disabled={isAddVariablesOpen?.mode === 'edit'}
            value={formData.name}
            onChange={e => handleInputChange(e)}
          />
          <InputField
            name="value"
            type="text"
            label={KDFM.VALUE}
            icon={<QRIcons />}
            disabled={isChecked}
            placeholder={valPlaceHolder}
            value={isChecked ? '' : formData.value}
            onChange={e => handleInputChange(e)}
          />
          <CheckboxField
            name="check"
            label={KDFM.SET_EMPTY_STRING}
            onCheckBoxChange={handleCheckboxChange}
          />
        </form>
      </ModalBody>
    </Modal>
  );
};

AddOrEditVariablesModal.propTypes = {
  isAddVariablesOpen: PropTypes.object,
  setIsAddVariablesOpen: PropTypes.func,
  closePopup: PropTypes.func.isRequired,
  newlyAddVariables: PropTypes.array,
  setNewlyAddvariables: PropTypes.func,
  variableContextItem: PropTypes.func,
  handleSave: PropTypes.func,
  variablesDetailsData: PropTypes.array,
  editVariableData: PropTypes.object,
};

export default AddOrEditVariablesModal;
