import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Button, DateTimeInput, Modal, SelectField } from '../../shared';
import { PlusCircleIcon, QRIcons } from '../../assets';
import { useGlobalContext } from '../../utils';
// import {
//   userSchema,
// } from '../../components/UserManagement/userValidation';
import { useSelector } from 'react-redux';
import { ClustersSelectors, NamespacesSelectors } from '../../store';
import { UserSelect } from '../../components';
import * as yup from 'yup';

export const scheduleSchema = yup.object().shape({
  namespace_id: yup
    .string()
    .trim()
    .required('Namespace is required'),
});

export const AddScheduleDeploymentModal = props => {
  const { state, setState } = useGlobalContext();
  const [startDate, setStartDate] = useState(new Date());
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const namespaces = useSelector(NamespacesSelectors.getNamespaces);
  const clusterList = useSelector(ClustersSelectors.getClusters);
  const {
    // register,
    // reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scheduleSchema),
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

  return (
    <div {...props}>
      <Button
        icon={<PlusCircleIcon width={16} height={16} color="white" />}
        onClick={openModal}
        size="sm"
      >
        Add Schedule Deployment
      </Button>
      <Modal
        size="md"
        title={'Add Schedule Deployment'}
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
              name="namespace_id"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              options={namespaces.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              //   defaultValue={clusterLogin}
              placeholder="Select Namespace"
              required
              //   disabled={isObject(clusterLogin)}
            />
          </div>
          <div className="col-6">
            <SelectField
              label="Source Cluster"
              name="source_cluster_id"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              options={clusterList}
              defaultValue={selectedCluster}
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
              name="destination_cluster_id"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              options={clusterList}
              //   defaultValue={clusterLogin}
              placeholder="Select Destination Cluster"
              required
              //   disabled={isObject(clusterLogin)}
            />
          </div>
          <div className="col-6">
            <DateTimeInput
              startDate={startDate}
              setStartDate={setStartDate}
              label="Deploy Time"
              required
            />
          </div>
        </div>

        <UserSelect control={control} errors={errors} />
      </Modal>
    </div>
  );
};
