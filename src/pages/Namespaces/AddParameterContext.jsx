import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckboxField,
  InputField,
  Modal,
  RadioSelectField,
} from '../../shared';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { useForm } from 'react-hook-form';
import { useGlobalContext } from '../../utils';
import { updateParameterContextService } from '../../utils/services';

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
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const RedioButtonDiv = styled.div`
  margin-top: 30px;
`;

const AddParameterContext = ({
  isOpen,
  closePopup,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
}) => {
  const { state, setState } = useGlobalContext();
  const { register, handleSubmit, reset } = useForm();
  const OPTIONS = [
    { name: 'Yes', value: true },
    { name: 'No', value: false },
  ];

  const convertObject = objects => {
    return objects.map(originalObject => ({
      can_write: originalObject?.canWrite,
      name: originalObject?.parameter?.name,
      context_name: originalObject?.parameter?.name,
      value: originalObject?.parameter?.value,
      description: originalObject?.parameter?.description,
      sensitive: originalObject?.parameter?.sensitive,
      provided: originalObject?.parameter?.provided,
    }));
  };

  const onSubmit = async data => {
    try {
      const revision = {
        version: state.parameterVersion,
      };

      const response = await updateParameterContextService(
        state.selectedClusterId,
        state.deployCountDetails.data.parameterContextId,
        revision,
        data
      );

      if (response.status === 200) {
        setIsAddParameterContextOpen(false);
        setIsParameterContextOpen(true);

        const paramter = {
          [response?.data?.id]: convertObject(
            response.data.component.parameters
          ),
        };

        setState(prevState => ({
          ...prevState,
          parameterVersion: response.data.revision.version,
          parameterDetails: {
            ...prevState.parameterDetails,
            data: paramter,
          },
        }));
        reset();
      }
    } catch (error) {
      console.error('Error updating parameter context:', error);
    }
  };

  return (
    <Modal
      title="Add Parameter Context"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText="Back"
      primaryButtonText="Save"
      onSubmit={handleSubmit(onSubmit)}
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
                  register={register}
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
                  register={register}
                />
              </InputBox>
            </ColumnSix>
            <ColumnOneTwo className="col-12 mb-4">
              <CheckboxField
                name="is_admin"
                label="Set Empty String"
                register={register}
              />
              <RedioButtonDiv>
                <RadioSelectField
                  name="is_active"
                  label="Sensitive value"
                  options={OPTIONS}
                  register={register}
                />
              </RedioButtonDiv>
            </ColumnOneTwo>
            <ColumnOneTwo className="col-12">
              <InputBox>
                <InputField
                  name="description"
                  type="text"
                  label="Description"
                  placeholder="Description"
                  icon={<QRIcons />}
                  register={register}
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
  setIsAddParameterContextOpen: PropTypes.func,
  setIsParameterContextOpen: PropTypes.func,
};

export default AddParameterContext;
