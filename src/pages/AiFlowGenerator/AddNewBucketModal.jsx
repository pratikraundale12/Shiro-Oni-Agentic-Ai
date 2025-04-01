import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, InputField, CheckboxField } from '../../shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BucketIcon, DescIcon } from '../../assets';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { AiFlowGeneratorActions } from '../../store';

const bucketSchema = yup.object().shape({
  bucket: yup.string().required('Bucket name is required'),
});

export const AddNewBucketModal = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const DEFAULT_fORM_DATA = {
    bucket_name: '',
    bucket_desc: '',
    check: false,
  };
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_fORM_DATA,
    resolver: yupResolver(bucketSchema),
  });
  const bucketName = watch('bucket_name');
  const bucketDesc = watch('bucket_desc');
  const check = watch('check');

  useEffect(() => {
    reset(DEFAULT_fORM_DATA);
  }, []);

  const onSubmit = () => {
    const data = {
      bucketName: bucketName,
      bucketDesc: bucketDesc,
      allowPublicRead: check,
    };
    dispatch(AiFlowGeneratorActions.addNewBucketToRegistry(data));
    reset(DEFAULT_fORM_DATA);
    setIsModalOpen(false);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Add New Bucket"
      isOpen={isModalOpen}
      onRequestClose={onClose}
      size="sm"
      secondaryButtonText="Cancel"
      primaryButtonText="Save"
      primaryButtonDisabled={isEmpty(bucketName)}
      onSubmit={e => onSubmit(e)}
      footerAlign="start"
      contentStyles={{ maxWidth: '25%', minWidth: '20%' }}
    >
      <InputField
        name="bucket_name"
        type="text"
        label="Bucket Name"
        placeholder="Enter Bucket Name"
        register={register}
        errors={errors}
        icon={<BucketIcon />}
        required
      />
      <InputField
        name="bucket_desc"
        type="text"
        label="Bucket Description"
        placeholder="Enter Bucket Description"
        register={register}
        errors={errors}
        icon={<DescIcon />}
      />
      <CheckboxField
        name="check"
        label={'Make Publicly Visible'}
        register={register}
      />
    </Modal>
  );
};

AddNewBucketModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};
