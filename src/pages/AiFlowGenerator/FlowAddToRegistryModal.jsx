import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, SelectField, InputField } from '../../shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BucketIcon, FlowIcon } from '../../assets';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { AddsquareIcon } from '../../assets/Icons/AddSquareIcon';

const bucketSchema = yup.object().shape({
  bucket: yup.string().required('Bucket is required'),
  flow_name: yup
    .string()
    .required('Flow name is required')
    .min(2, 'Please enter atleast 2 character for flow name'),
});

const AddNewBucketButton = styled.button`
  position: absolute;
  cursor: pointer !important;
  width: 135px;
  height: 19px;
  background: #ffffff;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #ff7a00;
  left: 75%;
  > svg {
    cursor: pointer !important;
  }
  > span {
    cursor: pointer !important;
  }
`;

const Container = styled.div`
  position: relative;
`;

export const FlowAddToRegistryModal = ({
  isModalOpen,
  setIsModalOpen,
  bucketList,
  defaultFlowName,
  handleAddToRegistry,
  showAddNewBucket = false,
  handleClose,
}) => {
  const defaultBucket = bucketList?.filter(bucket =>
    bucket.name.toLowerCase().includes('genai')
  );
  const DEFAULT_fORM_DATA = {
    bucket: defaultBucket[0]?.name || '',
    flow_name: defaultFlowName,
    flow_desc: '',
  };
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_fORM_DATA,
    resolver: yupResolver(bucketSchema),
  });
  const bucket = watch('bucket');
  const flow = watch('flow_name');

  useEffect(() => {
    reset(DEFAULT_fORM_DATA);
  }, []);
  const onSubmit = data => {
    handleAddToRegistry(data?.flow_name);
    reset(DEFAULT_fORM_DATA);
    setIsModalOpen(false);
  };

  const onClose = () => {
    handleClose();
    reset(DEFAULT_fORM_DATA);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Add to Registry"
      isOpen={isModalOpen}
      onRequestClose={onClose}
      size="sm"
      // loading={loading}
      secondaryButtonText="Cancel"
      primaryButtonText="Save"
      primaryButtonDisabled={isEmpty(bucket) || isEmpty(flow)}
      onSubmit={handleSubmit(onSubmit)}
      footerAlign="start"
      contentStyles={{ minWidth: '30%' }}
    >
      <Container>
        {showAddNewBucket && (
          <AddNewBucketButton type="button">
            <AddsquareIcon />
            <span>Add New Bucket</span>
          </AddNewBucketButton>
        )}
        <SelectField
          label="Bucket"
          name="bucket"
          control={control}
          icon={<BucketIcon />}
          errors={errors}
          options={bucketList}
          defaultValue={defaultBucket[0]?.name || ''}
          placeholder="Select Bucket"
          required
        />
        <InputField
          name="flow_name"
          type="text"
          label="Flow Name"
          placeholder="Enter Flow Name"
          register={register}
          errors={errors}
          icon={<FlowIcon />}
          required
          defaultValue={defaultFlowName}
        />
        <InputField
          name="flow_desc"
          type="text"
          label="Flow Description"
          placeholder="Enter Flow Description"
          register={register}
          errors={errors}
          icon={<FlowIcon />}
        />
      </Container>
    </Modal>
  );
};

FlowAddToRegistryModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  bucketList: PropTypes.array,
  defaultFlowName: PropTypes.string,
  handleAddToRegistry: PropTypes.func,
  showAddNewBucket: PropTypes.bool,
  handleClose: PropTypes.func,
};
