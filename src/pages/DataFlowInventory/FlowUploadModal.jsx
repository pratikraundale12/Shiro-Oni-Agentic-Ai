import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { InputField, Modal } from '../../shared';
import { PropertyIcon } from '../../assets';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import { useEffect } from 'react';

// Validation schema
const validationSchema = yup.object({
  name: yup
    .string()
    .required('Flow name is required')
    .trim()
    .min(1, 'Flow name cannot be empty'),
  comments: yup
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters'),
  flowFile: yup
    .mixed()
    .required('JSON file is required')
    .test('fileType', 'Please select a valid JSON file', value => {
      if (!value || !value[0]) return false;
      return value[0].name.endsWith('.json');
    }),
  source_icon: yup
    .mixed()
    .nullable()
    .test('fileType', 'Please select a valid image file', value => {
      if (!value || !value[0]) return true; // Optional field
      return value[0].type.startsWith('image/');
    }),
  destination_icon: yup
    .mixed()
    .nullable()
    .test('fileType', 'Please select a valid image file', value => {
      if (!value || !value[0]) return true; // Optional field
      return value[0].type.startsWith('image/');
    }),
});

// Styled Components
const FormContainer = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: ${props =>
    props.hasError ? '2px solid #e53e3e' : '1px solid #d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${props => (props.hasError ? '#e53e3e' : '#3b82f6')};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: ${props =>
    props.hasError ? '2px solid #e53e3e' : '1px solid #d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: ${props => (props.hasError ? '#e53e3e' : '#3b82f6')};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FileInput = styled(Input)`
  background-color: #f9fafb;
  cursor: pointer;

  &::-webkit-file-upload-button {
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 6px 12px;
    margin-right: 10px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f3f4f6;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
`;

const RequiredIndicator = styled.span`
  color: #e53e3e;
`;

const IconRow = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const IconField = styled.div`
  flex: 1;
`;

const FlowUploadModal = ({ setFlowUploadModalOpen, flowUploadModalOpen }) => {
  const dispatch = useDispatch();
  const uploadFlowState = useSelector(FlowValidationSelectors.getUploadFlow);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      comments: '',
      flowFile: null,
      source_icon: null,
      destination_icon: null,
    },
    mode: 'onChange',
  });

  const onRequestClose = () => {
    reset();
    // Reset the upload flow state to allow modal to open again
    dispatch(FlowValidationActions.resetUploadFlow());
    setFlowUploadModalOpen(false);
  };

  const onSubmit = async data => {
    try {
      const uploadData = new FormData();
      uploadData.append('flow_name', data.name);
      uploadData.append('comments', data.comments || '');

      if (data.flowFile?.[0]) {
        uploadData.append('flowFile', data.flowFile[0]);
      }

      if (data.source_icon?.[0]) {
        uploadData.append('source_icon', data.source_icon[0]);
      }
      if (data.destination_icon?.[0]) {
        uploadData.append('destination_icon', data.destination_icon[0]);
      }
      // Dispatch the upload flow action
      dispatch(FlowValidationActions.uploadFlow(uploadData));

      // Don't close modal here, let the useEffect handle it after success
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Watch for upload success to close modal and refresh flows
  React.useEffect(() => {
    if (uploadFlowState.success) {
      // Refresh the flows list
      dispatch(FlowValidationActions.fetchFlows());
      onRequestClose();
    }
  }, [uploadFlowState.success, dispatch]);

  // Reset upload flow state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(FlowValidationActions.resetUploadFlow());
    };
  }, [dispatch]);

  // Reset upload flow state when modal opens to ensure clean state
  useEffect(() => {
    if (flowUploadModalOpen) {
      dispatch(FlowValidationActions.resetUploadFlow());
    }
  }, [flowUploadModalOpen, dispatch]);

  const modalContent = (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Flow Name Input */}
        <FormGroup>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Flow Name"
                placeholder="Enter Flow Name"
                required
                icon={<PropertyIcon color="black" />}
                errors={errors.name ? { name: errors.name } : {}}
              />
            )}
          />
        </FormGroup>

        {/* Description Text Area */}
        <FormGroup>
          <Label htmlFor="comments">Description</Label>
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                id="comments"
                placeholder="Enter flow description"
                hasError={!!errors.comments}
              />
            )}
          />
          {errors.comments && (
            <ErrorMessage>{errors.comments.message}</ErrorMessage>
          )}
        </FormGroup>

        {/* JSON File Upload */}
        <FormGroup>
          <Label htmlFor="flowFile">
            Flow JSON File <RequiredIndicator>*</RequiredIndicator>
          </Label>
          <Controller
            name="flowFile"
            control={control}
            render={({ field: { onChange, name } }) => (
              <FileInput
                id="flowFile"
                name={name}
                type="file"
                accept=".json"
                onChange={e => onChange(e.target.files)}
                hasError={!!errors.flowFile}
              />
            )}
          />
          {errors.flowFile && (
            <ErrorMessage>{errors.flowFile.message}</ErrorMessage>
          )}
        </FormGroup>

        {/* Icon File Uploads - Same Line */}
        <FormGroup>
          <IconRow>
            <IconField>
              <Label htmlFor="source_icon">Source Icon</Label>
              <Controller
                name="source_icon"
                control={control}
                render={({ field: { onChange, name } }) => (
                  <FileInput
                    id="source_icon"
                    name={name}
                    type="file"
                    accept="image/*"
                    onChange={e => onChange(e.target.files)}
                    hasError={!!errors.source_icon}
                  />
                )}
              />
              {errors.source_icon && (
                <ErrorMessage>{errors.source_icon.message}</ErrorMessage>
              )}
            </IconField>

            <IconField>
              <Label htmlFor="destination_icon">Destination Icon</Label>
              <Controller
                name="destination_icon"
                control={control}
                render={({ field: { onChange, name } }) => (
                  <FileInput
                    id="destination_icon"
                    name={name}
                    type="file"
                    accept="image/*"
                    onChange={e => onChange(e.target.files)}
                    hasError={!!errors.destination_icon}
                  />
                )}
              />
              {errors.destination_icon && (
                <ErrorMessage>{errors.destination_icon.message}</ErrorMessage>
              )}
            </IconField>
          </IconRow>
        </FormGroup>
      </form>
    </FormContainer>
  );

  return (
    <div>
      <Modal
        isOpen={flowUploadModalOpen}
        onRequestClose={onRequestClose}
        title="Upload New Flow"
        primaryButtonText={uploadFlowState.loading ? 'Uploading...' : 'Save'}
        secondaryButtonText="Cancel"
        onSubmit={handleSubmit(onSubmit)}
        primaryButtonDisabled={!isValid || uploadFlowState.loading}
        contentStyles={{ minWidth: '32%', maxWidth: '500px' }}
        footerAlign="end"
      >
        {modalContent}
      </Modal>
    </div>
  );
};

FlowUploadModal.propTypes = {
  setFlowUploadModalOpen: PropTypes.func.isRequired,
  flowUploadModalOpen: PropTypes.bool.isRequired,
};

export default FlowUploadModal;
