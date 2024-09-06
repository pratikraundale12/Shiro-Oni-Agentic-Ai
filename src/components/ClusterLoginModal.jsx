import { yupResolver } from '@hookform/resolvers/yup';
import { isObject } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { ClusterIcon, UserIcon } from '../assets';
import { CLUSTERS_TOKEN } from '../constants';
import { InputField, Modal, PasswordField, SelectField } from '../shared';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  GridActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../store';
import { getClusterToken } from '../store/apis';

const clusterSchema = yup.object().shape({
  cluster_id: yup.string().required('Cluster is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const DEFAULT_VALUES = { cluster_id: '', username: '', password: '' };

export const ClusterLoginModal = () => {
  const dispatch = useDispatch();
  const destinationFlag = useSelector(
    AuthenticationSelectors.getDestinationFlag
  );
  const clusterLogin = useSelector(AuthenticationSelectors.getClusterLogin);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const clusters = useSelector(ClustersSelectors.getAllClustersList);

  const sortClustersByStatus = clusters => {
    const clustersCopy = [...clusters];
    return clustersCopy.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'Connected' ? -1 : 1;
    });
  };

  const sortedClusters = sortClustersByStatus(clusters);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(clusterSchema),
  });

  const clusterId = watch('cluster_id');
  const selectedClusterData = sortedClusters.find(
    cluster => cluster.value === clusterId
  );
  const isFieldsDisabled = selectedClusterData?.status === 'Connected';

  const onSubmit = async data => {
    setLoading(true);
    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );

    const payload = {
      cluster_id: data?.cluster_id,
      username: data?.username,
      password: data?.password,
    };

    try {
      const response = await getClusterToken(payload);

      if (response.cluster_id) {
        const newCluster = {
          id: response.cluster_id,
          name: response.cluster_name,
          token: response.token,
        };
        clusterData.push(newCluster);
        localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(clusterData));
        localStorage.setItem(
          'selected_cluster',
          JSON.stringify({
            label: response.cluster_name,
            value: response?.cluster_id,
          })
        );
        if (!destinationFlag) {
          dispatch(
            NamespacesActions.setSelectedCluster({
              label: response?.cluster_name,
              value: response?.cluster_id,
            })
          );
        }
        setLoading(false);
        if (destinationFlag) {
          dispatch(AuthenticationActions.setDestinationFlag());
          dispatch(
            NamespacesActions.setSelectedDestCluster({
              label: response.cluster_name,
              value: response.cluster_id,
            })
          );
          dispatch(NamespacesActions.checkDestCluster());
        }
        dispatch(AuthenticationActions.setClusterLogin());
        toast.success('Cluster Enabled Successfully');
        reset(DEFAULT_VALUES);
        dispatch(GridActions.fetchGrid({ module: 'clusters' }));
      } else {
        toast.error(response.message || 'Error while getting data');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error?.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isObject(clusterLogin)) {
      setValue('cluster_id', clusterLogin.value);
    }

    return () => reset(DEFAULT_VALUES);
  }, [clusterLogin, setValue, reset]);

  useEffect(() => {
    dispatch(ClustersActions.fetchClusters({ params: { page: 1 } }));
  }, [dispatch]);

  const onSwitchCluster = () => {
    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );
    const clusterName = clusterData.find(
      cluster => cluster?.id == getValues()?.cluster_id
    )?.name;
    dispatch(AuthenticationActions.setClusterLogin());
    toast.success('Cluster Enabled Successfully');
    dispatch(
      NamespacesActions.setSelectedCluster({
        label: clusterName,
        value: getValues()?.cluster_id,
      })
    );
    localStorage.setItem(
      'selected_cluster',
      JSON.stringify({
        label: clusterName,
        value: getValues()?.cluster_id,
      })
    );
  };

  return (
    <Modal
      title="Enable Cluster"
      isOpen={isObject(clusterLogin) || clusterLogin}
      onRequestClose={() => dispatch(AuthenticationActions.setClusterLogin())}
      size="sm"
      loading={loading}
      secondaryButtonText="Back"
      primaryButtonText={isFieldsDisabled ? 'Switch' : 'Submit'}
      primaryButtonDisabled={selectedCluster?.value == clusterId}
      onSubmit={isFieldsDisabled ? onSwitchCluster : handleSubmit(onSubmit)}
      footerAlign="start"
      contentStyles={{ minWidth: '30%' }}
    >
      <SelectField
        label="Select Cluster"
        name="cluster_id"
        control={control}
        icon={<ClusterIcon />}
        errors={errors}
        options={sortedClusters}
        defaultValue={clusterLogin}
        placeholder="Select Cluster"
        required
        disabled={isObject(clusterLogin)}
        showCircleIcon={true}
      />

      <InputField
        name="username"
        type="text"
        label="Username"
        placeholder="Enter your Username"
        register={register}
        errors={errors}
        icon={<UserIcon />}
        required={!isFieldsDisabled}
        disabled={isFieldsDisabled}
      />
      <PasswordField
        name="password"
        register={register}
        errors={errors}
        watch={watch}
        required={!isFieldsDisabled}
        label="Password"
        disabled={isFieldsDisabled}
      />
    </Modal>
  );
};

ClusterLoginModal.propTypes = {
  cluster: PropTypes.string,
};
