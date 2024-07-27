import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';

import { useGlobalContext } from '../../utils';
import {
  Button,
  CheckboxField,
  InputField,
  Modal,
  RadioField,
  RadioSelectField,
} from '../../shared';
import { PeopleIcon, PlusCircleIcon } from '../../assets';
import { Table } from '../../components';

const DEFAULT_VALUES = {
  username: '',
  email: '',
  is_active: false,
  type: '',
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
          is_active: state.selectedItem.is_active,
          type: state.selectedItem.type,
        });
    }
  }, [reset, state.userModal, state.selectedItem]);

  const OPTIONS = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];
  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => <div>{item.name}</div>,
    },
    {
      label: 'Namespace ID',
      renderCell: item => <div>{item.id}</div>,
    },
    {
      label: 'Flow Name',
      renderCell: item => <div>{item.flowName}</div>,
    },
    {
      label: 'Bucket Name',
      renderCell: item => <div>{item.bucketName}</div>,
    },
    {
      label: 'Version',
      renderCell: item => <div>{item.version}</div>,
    },
    {
      label: '',
      renderCell: item => (
        <RadioField
          name="select"
          onChange={() => console.log('Changed', item.id)}
        />
      ),
      width: '10%',
    },
  ];
  const data = [
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 1',
      flowName: 'Flow Name',
      bucketName: 'Bucket Name',
      version: 'V1',
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 2',
      flowName: 'Flow Name',
      bucketName: 'Bucket Name',
      version: 'V1',
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 3',
      flowName: 'Flow Name',
      bucketName: 'Bucket Name',
      version: 'V1',
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 4',
      flowName: 'Flow Name',
      bucketName: 'Bucket Name',
      version: 'V1',
    },
  ];

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
        <RadioSelectField
          name="is_active"
          label="Status"
          options={OPTIONS}
          register={register}
        />
        <CheckboxField name="is_admin" label="Admin" register={register} />
        <Table data={data} columns={COLUMNS} />
      </Modal>
    </div>
  );
};
