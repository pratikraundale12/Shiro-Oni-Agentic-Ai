import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, SelectField, InputField } from '../../shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BucketIcon, DescIcon, FlowIcon } from '../../assets';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { AddsquareIcon } from '../../assets/Icons/AddSquareIcon';
import { useSelector } from 'react-redux';
import {
  AiFlowGeneratorActions,
  AiFlowGeneratorSelectors,
  LoadingSelectors,
} from '../../store';
import { dispatch } from 'd3';

const bucketSchema = yup.object().shape({
  bucket: yup.string().required('Bucket is required'),
  flow_name: yup
    .string()
    .required('Flow name is required')
    .min(2, 'Please enter atleast 2 character for flow name'),
});

const BtnConatainer = styled.div`
  position: absolute;
  right: 0;
  z-index: 10; /* Ensure it appears above other elements */
`;
const AddNewBucketButton = styled.button`
  pointer-events: auto;
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

const BucketWrapper = styled.div`
  margin-bottom: 20px;
`;
export const FlowAddToRegistryModal = ({
  isModalOpen,
  setIsModalOpen,
  bucketList,
  defaultFlowName,
  setIsAddNewBucketModalOpen,
  handleAddToRegistry,
  showAddNewBucket = true,
  handleClose,
}) => {
  const newBucketData = useSelector(AiFlowGeneratorSelectors.getNewBucket);
  const defaultBucket = bucketList?.filter(bucket =>
    bucket.name.toLowerCase().includes('genai')
  );
  const DEFAULT_fORM_DATA = {
    bucket: newBucketData?.identifier || defaultBucket[0]?.id || '',
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

  useEffect(() => {
    reset({
      bucket: newBucketData?.identifier || defaultBucket[0]?.id || '',
      flow_name: defaultFlowName,
      flow_desc: '',
    });
  }, [newBucketData, reset, bucketList]);
  const onSubmit = data => {
    handleAddToRegistry(data);
    reset(DEFAULT_fORM_DATA);
    setIsModalOpen(false);
    dispatch(AiFlowGeneratorActions.setNewBucket({}));
  };

  const onClose = () => {
    handleClose();
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'addNewBucketToRegistry')
  );

  return (
    <>
      <Modal
        title="Add to Registry"
        isOpen={isModalOpen}
        onRequestClose={onClose}
        size="sm"
        loading={loading}
        secondaryButtonText="Cancel"
        primaryButtonText="Save"
        primaryButtonDisabled={isEmpty(bucket) || isEmpty(flow)}
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '35%' }}
      >
        <Container>
          {showAddNewBucket && (
            <BtnConatainer onClick={() => setIsAddNewBucketModalOpen(true)}>
              <AddNewBucketButton
                type="button"
                onClick={() => {
                  setIsAddNewBucketModalOpen(true);
                }}
              >
                <AddsquareIcon />
                <span>Add New Bucket</span>
              </AddNewBucketButton>
            </BtnConatainer>
          )}
          <BucketWrapper>
            <SelectField
              label="Bucket"
              name="bucket"
              control={control}
              icon={<BucketIcon />}
              errors={errors}
              register={register}
              options={bucketList}
              placeholder="Select Bucket"
              required
            />
          </BucketWrapper>
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
            icon={<DescIcon />}
          />
        </Container>
      </Modal>
    </>
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
  setIsAddNewBucketModalOpen: PropTypes.func,
};
