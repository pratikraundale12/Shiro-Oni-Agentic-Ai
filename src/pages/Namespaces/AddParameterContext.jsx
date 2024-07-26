import React from 'react';
import PropTypes from 'prop-types';
import { InputField, Modal } from '../../shared';
import styled from 'styled-components';
import { QRIcons } from '../../assets';

const ModalBody = styled.div`
  padding: 35px 16px 25px;
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
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const AddParameterContext = ({ isOpen, closePopup }) => {
  return (
    <Modal
      title="Add Parameter Context"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="sm"
      secondaryButtonText="Back"
      primaryButtonText="Save"
      //   onSubmit={handleSubmit(onSubmit)}
    >
      <ModalBody className="modal-body">
        <ModalBodyDiv className="d-flex">
          <RowModal>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="name"
                  type="text"
                  label="Name"
                  placeholder="User"
                  icon={<QRIcons />}
                />
              </InputBox>
            </ColumnSix>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="value"
                  type="text"
                  label="Value"
                  placeholder="User@123"
                  icon={<QRIcons />}
                />
              </InputBox>
            </ColumnSix>
            <ColumnOneTwo className="col-12">
              <InputBox>
                <InputField
                  name="description"
                  type="text"
                  label="Description"
                  placeholder="Description"
                  icon={<QRIcons />}
                />
              </InputBox>
            </ColumnOneTwo>
          </RowModal>
        </ModalBodyDiv>
      </ModalBody>
    </Modal>
  );
};

AddParameterContext.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default AddParameterContext;
