import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Button, Modal, SelectField } from '../../shared';
import { CalendarIcon, PlusCircleIcon, QRIcons, UserIcon } from '../../assets';
import { useGlobalContext } from '../../utils';
import {
  userSchema,
  editUserSchema,
} from '../../components/UserManagement/userValidation';

const DEFAULT_VALUES = {
  username: '',
  email: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  password: '',
  is_active: '',
  type: '',
  photo: '',
  phone: '',
  confirm_password: '',
};

export const AddScheduleDeploymentModal = props => {
  const { state, setState } = useGlobalContext();
  const {
    // register,
    // reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(
      isEmpty(state?.selectedItem) ? userSchema : editUserSchema
    ),
  });

  const openModal = () => setState({ ...state, scheduleModel: true });
  const closeModal = () => {
    setState({
      ...state,
      scheduleModel: false,
    });
  };

  const onSubmit = async data => {
    console.log(data);
  };

  useEffect(() => {
    if (state?.scheduleModel) {
      alert('call api');
    }
  }, [state?.scheduleModel]);

  return (
    <div {...props}>
      <Button
        icon={<PlusCircleIcon width={16} height={16} color="white" />}
        onClick={openModal}
        size="sm"
      >
        Add New User
      </Button>
      <Modal
        size="md"
        title={'Add Schedule Deploymet'}
        isOpen={state.scheduleModel}
        onRequestClose={closeModal}
        secondaryButtonText="Cancel"
        primaryButtonText="Submit"
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '45%' }}
      >
        <div className="row">
          <div className="col-6">
            <SelectField
              label="Namespace"
              name="namespace"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              //   options={filteredClusters}
              //   defaultValue={clusterLogin}
              placeholder="Select Namespace"
              required
              //   disabled={isObject(clusterLogin)}
            />
          </div>
          <div className="col-6">
            <SelectField
              label="Source Cluster"
              name="source_cluster"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              //   options={filteredClusters}
              //   defaultValue={clusterLogin}
              placeholder="Select Source Cluster"
              required
              //   disabled={isObject(clusterLogin)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <SelectField
              label="Destination Cluster"
              name="namespace"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              //   options={filteredClusters}
              //   defaultValue={clusterLogin}
              placeholder="Select Destination Cluster"
              required
              //   disabled={isObject(clusterLogin)}
            />
          </div>
          <div className="col-6">
            <SelectField
              label="Destination Cluster"
              name="source_cluster"
              control={control}
              icon={<CalendarIcon />}
              errors={errors}
              //   options={filteredClusters}
              //   defaultValue={clusterLogin}
              placeholder="Select  Cluster"
              required
              //   disabled={isObject(clusterLogin)}
            />
          </div>
        </div>
        <SelectField
          label="Approver"
          name="namespace"
          control={control}
          icon={<UserIcon />}
          errors={errors}
          //   options={filteredClusters}
          //   defaultValue={clusterLogin}
          placeholder="Select atleast one approver"
          required
          //   disabled={isObject(clusterLogin)}
        />
      </Modal>
    </div>
  );
};
