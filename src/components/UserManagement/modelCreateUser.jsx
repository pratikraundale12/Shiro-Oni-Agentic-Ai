import React, { useState } from 'react';
import CreateUser from './createUser';
import { useForm } from 'react-hook-form';
import { createUserApi } from '../../utils/services';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { userSchema } from './userValidation';
import { Model } from '../../shared';

const ModelCreateUser = ({ addUserModel, setAddUserModel }) => {
  const [photo, setPhoto] = useState(null);

  const {
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {},
  });
  const closeModal = () => {
    setAddUserModel(false);
    reset();
    setPhoto(null);
  };
  const onSubmit = async data => {
    const formData = new FormData();

    formData.append('first_name', data.first_name);
    formData.append('middle_name', data.middle_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone_number);
    if (data?.is_active) {
      formData.append('is_active', JSON.parse(data?.is_active));
    } else {
      formData.append('is_active', true);
    }
    formData.append('type', data.type || 'user');
    formData.append('username', data.first_name);

    if (photo) {
      formData.append('photo', photo);
    }

    const [response] = await createUserApi(formData);
    if (response) {
      closeModal();
    }
  };

  return (
    <Model
      setModalIsOpen={setAddUserModel}
      modalIsOpen={addUserModel}
      size="lg"
      leftButtonText="Cancel"
      rightButtonText="Submit"
      title="Add New User"
      onSubmit={handleSubmit(onSubmit)}
      reset={reset}
      closeModal={closeModal}
    >
      <CreateUser
        watch={watch}
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        setPhoto={setPhoto}
        photo={photo}
      />
    </Model>
  );
};
export default ModelCreateUser;
ModelCreateUser.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func,
  register: PropTypes.func,
  setValue: PropTypes.func,
  setPhoto: PropTypes.func,
  photo: PropTypes.object,
  addUserModel: PropTypes.object,
  setAddUserModel: PropTypes.func,
  editUserData: PropTypes.object,
};
