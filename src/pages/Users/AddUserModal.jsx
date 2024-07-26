import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';

import { useGlobalContext } from '../../utils';
import { Button, InputField, Modal } from '../../shared';
import { PeopleIcon, PlusCircleIcon } from '../../assets';

const DEFAULT_VALUES = {
  username: '',
  email: '',
};

export const AddUserModal = () => {
  const { state, setState } = useGlobalContext();
  const { register, reset, handleSubmit } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const openModal = () => setState({ ...state, userModal: true });
  const closeModal = () =>
    setState({
      ...state,
      userModal: false,
      selectedItem: null,
    });

  const onSubmit = async data => {
    console.log(data);
  };

  useEffect(() => {
    if (state.userModal) {
      if (isEmpty(state.selectedItem)) reset(DEFAULT_VALUES);
      else
        reset({
          username: state.selectedItem.username,
          email: state.selectedItem.email,
        });
    }
  }, [reset, state.userModal, state.selectedItem]);

  return (
    <div>
      <Button
        icon={<PlusCircleIcon width={20} height={20} color="white" />}
        onClick={openModal}
      >
        Add New User
      </Button>
      <Modal
        title="Add User"
        isOpen={state.userModal}
        onRequestClose={closeModal}
        size="lg"
        secondaryButtonText="Cancel"
        primaryButtonText="Add"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          name="username"
          label="Username"
          register={register}
          icon={<PeopleIcon width={20} height={20} />}
        />
        <InputField
          name="email"
          label="email"
          register={register}
          icon={<PeopleIcon width={20} height={20} />}
        />
      </Modal>
    </div>
  );
};
