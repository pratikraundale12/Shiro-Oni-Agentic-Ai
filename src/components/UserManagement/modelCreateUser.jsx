import React, { useState } from 'react';
import CreateUser from './createUser';
import { Button, Model } from '../../shared';
import styled from 'styled-components';
import { AddIcon } from '../../assets';
import { useForm } from 'react-hook-form';
import { createUserApi } from '../../utils/services';

const ButtonWrapper = styled.div`
  width: 135px;
`;
const ModelCreateUser = () => {
  const [addUserModel, setAddUserModel] = useState(false);
  const [photo, setPhoto] = useState(null);
  const openAddUserModal = () => {
    setAddUserModel(true);
  };

  const {
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
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
    formData.append('type', data.type || 'admin');
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
    <>
      <ButtonWrapper>
        <Button
          variant="primary"
          size="md"
          iconPosition="left"
          icon={<AddIcon />}
          onClick={openAddUserModal}
        >
          Add User
        </Button>
      </ButtonWrapper>
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
    </>
  );
};
export default ModelCreateUser;
