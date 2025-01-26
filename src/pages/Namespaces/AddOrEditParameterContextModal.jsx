import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { KDFM } from '../../constants';
import {
  CheckboxField,
  InputField,
  Modal,
  RadioSelectField,
} from '../../shared';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const ModalBodyDiv = styled.div`
  align-items: center !important;
  justify-content: flex-start !important;
`;

const RowModal = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: calc(-0.5 * 1.5rem);
  margin-left: calc(-0.5 * 1.5rem);
`;

const InputBox = styled.div`
  margin-bottom: 24px;
`;

const ColumnSix = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
`;

const ColumnOneTwo = styled.div`
  max-width: 100%;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-top: 0;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const RedioButtonDiv = styled.div`
  margin-top: 30px;
`;

const DEFAULT_VALUES = {
  check: false,
  name: '',
  value: '',
  description: '',
  sensitive: 'false',
};

const AddOrEditParameterContextModal = ({
  isAddParameterContextOpen,
  closePopup,
  setIsAddParameterContextOpen,
  pcEditData,
  handleSave,
}) => {
  const OPTIONS = [
    {
      id: 1,
      value:
        pcEditData && pcEditData?.sensitive === true
          ? pcEditData?.sensitive
          : false,
      label: 'Yes',
    },
    {
      id: 2,
      value:
        pcEditData && pcEditData?.sensitive === false
          ? pcEditData?.sensitive
          : false,
      label: 'No',
    },
  ];

  const [formData, setFormData] = useState(
    isAddParameterContextOpen?.mode === 'edit' ? pcEditData : DEFAULT_VALUES
  );
  const [valPlaceHolder, setValPlaceHolder] = useState('');
  const [isChecked, setIsChecked] = useState(
    pcEditData ? pcEditData?.check : false
  );

  const handleAddEditParameterContext = () => {
    if (!formData) return;
    handleSave(formData);
    isAddParameterContextOpen?.mode === 'edit'
      ? toast.success(KDFM.PARAMETER_EDITED)
      : toast.success(KDFM.PARAMETER_ADDED);
    setIsAddParameterContextOpen({ isOpen: false, mode: 'add' });
  };

  const handleCheckboxChange = event => {
    const { checked } = event.target;
    setIsChecked(checked);
    setFormData(prev => ({
      ...prev,
      value: checked ? '' : prev.value,
      check: checked,
    }));
  };

  const handleInputChange = data => {
    const { name, value } = data.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    isChecked
      ? setValPlaceHolder(KDFM.SET_EMPTY_STRING)
      : setValPlaceHolder('');
  }, [isChecked]);

  return (
    <Modal
      title={
        isAddParameterContextOpen?.mode === 'add'
          ? KDFM.ADD_PARAMETER_CONTEXT
          : KDFM.EDIT_PARAMETER_CONTEXT
      }
      isOpen={isAddParameterContextOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      footerAlign="start"
      secondaryButtonText={KDFM.BACK}
      primaryButtonText={KDFM.SAVE}
      onSubmit={handleAddEditParameterContext}
    >
      <ModalBody className="modal-body">
        <ModalBodyDiv className="d-flex">
          <RowModal>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="name"
                  type="text"
                  label={KDFM.NAME}
                  icon={<QRIcons />}
                  placeholder={KDFM.ENTER_PARAMETER}
                  disabled={isAddParameterContextOpen?.mode === 'edit'}
                  value={formData?.name}
                  onChange={e => handleInputChange(e)}
                />
              </InputBox>
            </ColumnSix>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="value"
                  type="text"
                  label={KDFM.VALUE}
                  icon={<QRIcons />}
                  placeholder={valPlaceHolder}
                  disabled={isChecked}
                  value={isChecked ? '' : formData.value}
                  onChange={e => handleInputChange(e)}
                />
              </InputBox>
            </ColumnSix>
            <ColumnOneTwo className="col-12 mb-4">
              <CheckboxField
                name="check"
                label={KDFM.SET_EMPTY_STRING}
                defaultChecked={isChecked}
                onCheckBoxChange={handleCheckboxChange}
              />
              <RedioButtonDiv>
                <RadioSelectField
                  name="sensitive"
                  label={KDFM.SENSITIVE_VALUE}
                  options={OPTIONS}
                  disabled={isAddParameterContextOpen?.mode === 'edit'}
                  defaultValue={formData?.sensitive}
                />
              </RedioButtonDiv>
            </ColumnOneTwo>
            <ColumnOneTwo className="col-12">
              <InputBox>
                <InputField
                  name="description"
                  type="text"
                  label={KDFM.DESCRIPTION}
                  icon={<QRIcons />}
                  placeholder={KDFM.ENTER_DESCRIPTION}
                  value={formData.description}
                  onChange={e => handleInputChange(e)}
                />
              </InputBox>
            </ColumnOneTwo>
          </RowModal>
        </ModalBodyDiv>
      </ModalBody>
    </Modal>
  );
};

AddOrEditParameterContextModal.propTypes = {
  isAddParameterContextOpen: PropTypes.object.isRequired,
  closePopup: PropTypes.func.isRequired,
  setIsAddParameterContextOpen: PropTypes.func,
  pcEditData: PropTypes.object,
  handleSave: PropTypes.func,
};

export default AddOrEditParameterContextModal;
