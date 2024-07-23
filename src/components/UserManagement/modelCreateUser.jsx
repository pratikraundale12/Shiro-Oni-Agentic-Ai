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
  const openAddUserModal = () => {
    setAddUserModel(true);
  };

  const {
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async data => {
    console.log(data);
    alert('submit');
    await createUserApi(data);
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
      >
        <CreateUser
          watch={watch}
          register={register}
          control={control}
          errors={errors}
        />
      </Model>
    </>
  );
};
export default ModelCreateUser;
