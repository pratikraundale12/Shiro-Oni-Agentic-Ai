import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Button, DateTimeInput, Modal, SelectField } from '../../shared';
import { PlusCircleIcon, QRIcons } from '../../assets';
import { useGlobalContext } from '../../utils';
// import {
//   userSchema,
// } from '../../components/UserManagement/userValidation';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { UserSelect } from '../../components';
import * as yup from 'yup';
import { isEmpty } from 'lodash';

export const scheduleSchema = yup.object().shape({
  namespace_id: yup.string().trim().required('Namespace is required'),
  source_cluster_id: yup.string().trim().required('Source Cluster is required'),
  destination_cluster_id: yup
    .string()
    .trim()
    .required('Destination Cluster is required'),
});

export const AddScheduleDeploymentModal = props => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const [startDate, setStartDate] = useState(new Date());
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const namespaces = useSelector(NamespacesSelectors.getNamespaces);
  const clusterList = useSelector(ClustersSelectors.getClusters);

  const {
    // register,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scheduleSchema),
    // defaultValues: {
    //   source_cluster_id: selectedCluster,
    // },
  });

  const selectedNamespace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  console.log(selectedCluster, selectedNamespace, 'selectedCluster>>>>>>');
  console.log(namespaces, 'namespaces????????');
  const onNamespaceSelect = selectedItem => {
    dispatch(NamespacesActions.setSelectedNamespace(selectedItem));
  };

  const onClusterSelect = value => {
    dispatch(NamespacesActions.fetchNamespaces());
    dispatch(NamespacesActions.setSelectedCluster(value));
  };

  const openModal = () => setState({ ...state, scheduleModel: true });
  const closeModal = () => {
    reset();
    setState({
      ...state,
      scheduleModel: false,
    });
  };

  const onSubmit = async data => {
    console.log(data);
  };
  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(NamespacesActions.fetchNamespaces());
    }
  }, [dispatch, selectedCluster]);

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      setValue('source_cluster_id', selectedCluster.value);
    }

    return () => reset();
  }, [selectedCluster, setValue, reset]);

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
              placeholder="Select Namespace"
              onChange={onNamespaceSelect}
              required
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
              onChange={onClusterSelect}
              required
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
        <UserSelect
          control={control}
          errors={errors}
          name="approver_ids"
          placeholder="Select atleast one approver"
          label="Approver"
        />
      </Modal>
    </div>
  );
};
