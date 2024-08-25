import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Button, DateTimeInput, Modal } from '../../shared';
import { useGlobalContext } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { UserSelect } from '../../components';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import { SchedularActions } from '../../store/schedular/redux';

export const scheduleSchema = yup.object().shape({
  // namespace_id: yup.string().trim().required('Namespace is required'),
  // source_cluster_id: yup.string().trim().required('Source Cluster is required'),
  // destination_cluster_id: yup
  //   .string()
  //   .trim()
  //   .required('Destination Cluster is required'),
  approver_ids: yup.string().trim().required('Approver is required'),
});

export const AddScheduleDeploymentModal = props => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const [startDate, setStartDate] = useState(new Date());
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  // const [selectCluster, setSelectCluster] = useState(selectedCluster);
  // const [namespaceSelected, setNamespaceSelected] = useState(null);
  // const namespaces = useSelector(NamespacesSelectors.getNamespaces);
  // const clusters = useSelector(ClustersSelectors.getClusters);
  // const namespaces = useSelector(SchedularSelectors.fetchNamespaces);
  // console.log(namespaceSelected, 'namespaceSelected');
  // selectCluster;
  const {
    // register,
    setValue,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scheduleSchema),
  });

  // const onNamespaceSelect = selectedItem => {
  //   setNamespaceSelected(selectedItem);
  // };

  // const onClusterSelect = selectedItem => {
  //   setSelectCluster(selectedItem?.value);
  // };

  const openModal = () => setState({ ...state, scheduleModel: true });
  const closeModal = () => {
    reset();
    setState({
      ...state,
      scheduleModel: false,
    });
  };

  const onSubmit = async data => {
    const { approver_ids, ...rest } = data;
    const payload = {
      ...rest,
      scheduled_time: startDate.toISOString(),
      // namespace_name: namespaceSelected?.label,
      // flow_id:namespaceSelected?.flowId,
      approver_ids: [approver_ids],
      deployment_status: 'PENDING',
    };
    dispatch(SchedularActions.createScheduleDeployment(payload));
    closeModal();
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

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  // useEffect(() => {
  //   if (selectCluster) {
  //     dispatch(SchedularActions.fetchNamespaces(selectCluster));
  //   }
  // }, [selectCluster]);

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(SchedularActions.fetchNamespaces(selectedCluster?.value));
    }
  }, [selectedCluster, dispatch]);

  return (
    <div {...props}>
      <Button onClick={openModal} size="md" variant="secondary">
        Schedule
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
          <div className="col-12">
            <DateTimeInput
              startDate={startDate}
              setStartDate={setStartDate}
              label="Deploy Time"
              control={control}
              errors={errors}
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
