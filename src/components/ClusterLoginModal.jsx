import React, { useEffect, useState } from 'react';
import { Modal, PasswordField, InputField, SelectField } from '../shared';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClusterIcon, UserIcon } from '../assets';
import { toast } from 'react-toastify';
import { getClusterToken } from '../store/apis';
import { CLUSTERS_TOKEN } from '../constants';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  ClustersSelectors,
  GridActions,
} from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { isObject } from 'lodash';

const clusterSchema = yup.object().shape({
  cluster_id: yup.string().required('Cluster is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const DEFAULT_VALUES = { cluster_id: '', username: '', password: '' };

export const ClusterLoginModal = () => {
  const dispatch = useDispatch();
  const clusterLogin = useSelector(AuthenticationSelectors.getClusterLogin);
  const tokens = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const tokenIds = tokens.map(item => item.id);
  const clusters = useSelector(ClustersSelectors.getClusters);
  const filteredClusters = clusters.filter(
    item => !tokenIds.includes(item.value)
  );
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(clusterSchema),
  });

  const onSubmit = async data => {
    setLoading(true);
    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );

    const payload = {
      cluster_id: data.cluster_id,
      username: data.username,
      password: data.password,
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
        setLoading(false);
        dispatch(AuthenticationActions.setClusterLogin());
        toast.success('Cluster Enabled Successfully');
        reset(DEFAULT_VALUES);
        dispatch(GridActions.fetchGrid({ module: 'clusters' }));
      } else {
        toast.error('Error while getting data');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isObject(clusterLogin)) {
      setValue('cluster_id', clusterLogin.value);
    }

    return () => reset(DEFAULT_VALUES);
  }, [clusterLogin, setValue, reset]);

  return (
    <Modal
      title="Enable Cluster"
      isOpen={isObject(clusterLogin) || clusterLogin}
      onRequestClose={() => dispatch(AuthenticationActions.setClusterLogin())}
      size="sm"
      loading={loading}
      secondaryButtonText="Back"
      primaryButtonText="Submit"
      onSubmit={handleSubmit(onSubmit)}
      footerAlign="start"
      contentStyles={{ minWidth: '30%' }}
    >
      <SelectField
        label="Select Cluster"
        name="cluster_id"
        control={control}
        icon={<ClusterIcon />}
        errors={errors}
        options={filteredClusters}
        defaultValue={clusterLogin}
        placeholder="Select Cluster"
        required
        disabled={isObject(clusterLogin)}
      />

      <InputField
        name="username"
        type="text"
        label="Username"
        placeholder="Enter your Username"
        register={register}
        errors={errors}
        icon={<UserIcon />}
        required
      />
      <PasswordField
        name="password"
        register={register}
        errors={errors}
        watch={watch}
        required
        label="Password"
      />
    </Modal>
  );
};

ClusterLoginModal.propTypes = {
  cluster: PropTypes.string,
};
