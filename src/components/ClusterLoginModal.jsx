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
import { history } from '../helpers/history';
import { InputField, Modal, PasswordField, SelectField } from '../shared';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  ClustersSelectors,
  DashboardActions,
  GridActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../store';
import { getClusterToken } from '../store/apis';
import { SchedularSelectors } from '../store/schedular';
import { FullPageLoader } from './FullPageLoader';

const clusterSchema = yup.object().shape({
  cluster_id: yup.string().required('Cluster is required'),
  username: yup.string().when('is_certificate_based_service_account', {
    is: false,
    then: schema => schema.required('Username is required'),
    otherwise: schema => schema.notRequired(),
  }),
  password: yup.string().when('is_certificate_based_service_account', {
    is: false,
    then: schema => schema.required('Password is required'),
    otherwise: schema => schema.notRequired(),
  }),
  is_certificate_based_service_account: yup.boolean(),
});

const DEFAULT_VALUES = {
  cluster_id: '',
  username: '',
  password: '',
  is_certificate_based_service_account: false,
};

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
    const clustersArray = clustersCopy.filter(
      item => item.status !== 'Deactivated'
    );

    return clustersArray.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'Connected' ? -1 : 1;
    });
  };

  const sortedClusters = sortClustersByStatus(clusters);
  // const sortedClusterList =
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
  // Set is_certificate_based_service_account in form state
  useEffect(() => {
    setValue(
      'is_certificate_based_service_account',
      !!selectedClusterData?.is_certificate_based_service_account
    );
  }, [selectedClusterData, setValue]);

  const statusData = useSelector(SchedularSelectors.getStatusFilterData);

  const isFieldsDisabled = selectedClusterData?.status === 'Connected';

  const onSubmit = async data => {
    dispatch(DashboardActions.setResetNamespaceOption(true));
    setLoading(true);
    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );

    let payload;
    if (selectedClusterData?.is_certificate_based_service_account) {
      payload = {
        cluster_id: data?.cluster_id,
      };
    } else {
      payload = {
        cluster_id: data?.cluster_id,
        username: data?.username,
        password: data?.password,
      };
    }
    try {
      const response = await getClusterToken(payload);
      if (response.cluster_id) {
        const newCluster = {
          id: response?.cluster_id,
          name: response?.cluster_name,
          token: response?.token,
        };
        clusterData.push(newCluster);
        localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(clusterData));
        if (!clusterLogin.is_deploy) {
          localStorage.setItem(
            'selected_cluster',
            JSON.stringify({
              label: response?.cluster_name,
              value: response?.cluster_id,
            })
          );
        }

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
              label: response?.cluster_name,
              value: response?.cluster_id,
            })
          );
          dispatch(NamespacesActions.checkDestCluster());
        }
        dispatch(AuthenticationActions.setClusterLogin());
        toast.success('The cluster is now enabled successfully');

        reset(DEFAULT_VALUES);
        dispatch(
          GridActions.fetchGrid({
            module: 'clusters',
            params: {
              page: 1,
              sort: 'name',
              limit: 10,
              ...(statusData !== '' && { status: statusData }),
            },
          })
        );
        if (window.location.pathname.includes('/process-group')) {
          window.location.reload();
          history.push('/process-group');
        }
      } else {
        toast.error(response.message || 'Error while getting data');

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error?.response?.data?.message ===
        'The supplied username and password are not valid.'
          ? 'The entered username and password are incorrect.'
          : error?.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    // Try to use clusterLogin.value, otherwise fallback to selectedCluster.value
    let clusterIdToSet = '';
    if (isObject(clusterLogin) && clusterLogin.value) {
      clusterIdToSet = clusterLogin.value;
    } else if (isObject(selectedCluster) && selectedCluster.value) {
      clusterIdToSet = selectedCluster.value;
    }
    if (clusterIdToSet) {
      setValue('cluster_id', clusterIdToSet);
    }
    return () => reset(DEFAULT_VALUES);
  }, [clusterLogin, selectedCluster, setValue, reset]);

  const onSwitchCluster = () => {
    dispatch(DashboardActions.setResetNamespaceOption(true));
    if (window.location.pathname.includes('/process-group')) {
      window.location.reload();
      history.push('/process-group');
    }

    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );

    const updatedCluster = [];
    if (clusterData && clusterData.length > 0) {
      for (const item of clusterData) {
        const new_sorted_cluster = sortedClusters?.find(
          temp => item?.id === temp?.id
        );
        const new_cluster_token_Updated = {
          id: new_sorted_cluster?.id,
          name: new_sorted_cluster?.name,
          token: item?.token,
        };
        updatedCluster.push(new_cluster_token_Updated);
      }
    }
    localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(updatedCluster));
    const clusterName = updatedCluster?.find(
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

    if (!clusterLogin.is_deploy) {
      localStorage.setItem(
        'selected_cluster',
        JSON.stringify({
          label: clusterName,
          value: getValues()?.cluster_id,
        })
      );
    }
  };

  return (
    <>
      <FullPageLoader loading={loading} />
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
        contentStyles={{ maxWidth: '30%', maxHeight: '50%' }}
        primaryButtonProps={{ id: 'enable-cluster-submit-btn' }}
      >
        <SelectField
          label="Select Cluster"
          id="select-cluster"
          name="cluster_id"
          control={control}
          icon={<ClusterIcon />}
          errors={errors}
          options={sortedClusters}
          placeholder="Select Cluster"
          required
          disabled={isObject(clusterLogin)}
          showCircleIcon={true}
        />
        {selectedClusterData?.is_certificate_based_service_account && (
          <div style={{ height: '100px' }}></div>
        )}

        {/* Only show Username and Password if not certificate based */}
        {!selectedClusterData?.is_certificate_based_service_account && (
          <>
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
          </>
        )}
      </Modal>
    </>
  );
};

ClusterLoginModal.propTypes = {
  cluster: PropTypes.string,
};
