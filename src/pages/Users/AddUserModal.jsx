import React, { useState } from 'react';

import { Button, InputField, Modal } from '../../shared';
import { PeopleIcon, PlusCircleIcon } from '../../assets';
import { useForm } from 'react-hook-form';

export const AddUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async data => {
    console.log(data);
  };

  return (
    <div>
      <Button
        icon={<PlusCircleIcon width={20} height={20} color="white" />}
        onClick={() => setIsOpen(true)}
      >
        Add New User
      </Button>
      <Modal
        title="Add User"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
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
      </Modal>
    </div>
  );
};
