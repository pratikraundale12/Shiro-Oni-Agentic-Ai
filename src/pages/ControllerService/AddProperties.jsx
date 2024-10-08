/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { InputField, Modal, RadioSelectField } from '../../shared';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;
const RedioButtonDiv = styled.div`
  margin-top: 30px;
`;
const OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];
const AddProperties = ({ isOpen, onClose }) => {
  return (
    <div>
      <Modal
        title="Add Properties"
        isOpen={isOpen}
        onRequestClose={onClose}
        size="md"
        primaryButtonText="Save"
        // onSubmit={}
        footerAlign="start"
      >
        <ModalBody className="modal-body">
          <InputField
            name="name"
            type="text"
            label="Property Name"
            icon={<QRIcons />}
          />
          <RedioButtonDiv>
            <RadioSelectField
              name="sensitive"
              label="Sensitive"
              options={OPTIONS}
            />
          </RedioButtonDiv>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AddProperties;
