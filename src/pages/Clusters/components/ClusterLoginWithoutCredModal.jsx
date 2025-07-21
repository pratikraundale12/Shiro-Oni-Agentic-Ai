import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  GridActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../../../store';
import { Modal } from '../../../shared';
import { CLUSTERS_TOKEN } from '../../../constants';
import { history } from '../../../helpers/history';
import { SchedularSelectors } from '../../../store/schedular';
import { getClusterToken } from '../../../store/apis';
import { FullPageLoader } from '../../../components';

const DEFAULT_VALUES = { cluster_id: '', username: '', password: '' };

export const ClusterLoginWithOutCredModal = () => {
  const dispatch = useDispatch();
  const destinationFlag = useSelector(
    AuthenticationSelectors.getDestinationFlag
  );
  const clusterLoginWithoutCred = useSelector(
    ClustersSelectors.getclusterToLoginWithoutCred
  );
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  console.log(selectedCluster, 'selectedCluster');

  const [loading, setLoading] = useState(false);
  const { handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  // const clusterId = watch('cluster_id');
  const statusData = useSelector(SchedularSelectors.getStatusFilterData);
  const clusterLogin = useSelector(AuthenticationSelectors.getClusterLogin);

  const onSubmit = async () => {
    setLoading(true);

    // Load cluster data from local storage or use empty array
    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );

    // Ensure the payload is valid
    const payload = {
      cluster_id: clusterLoginWithoutCred?.value,
    };

    console.log('Submitting with payload:', payload);

    try {
      const response = await getClusterToken(payload);
      console.log('API response:', response);

      // Check for valid response
      if (response && response.cluster_id) {
        const newCluster = {
          id: response.cluster_id,
          name: response.cluster_name,
          token: response.token,
        };

        // Save cluster to local storage
        clusterData.push(newCluster);
        localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(clusterData));

        // Clear cluster without credentials
        dispatch(ClustersActions.setclusterToLoginWithoutCred({}));

        // Set selected cluster if not deployed
        if (!clusterLogin?.is_deploy) {
          localStorage.setItem(
            'selected_cluster',
            JSON.stringify({
              label: response.cluster_name,
              value: response.cluster_id,
            })
          );
        }

        // Set namespace cluster if not going to destination
        if (!destinationFlag) {
          dispatch(
            NamespacesActions.setSelectedCluster({
              label: response.cluster_name,
              value: response.cluster_id,
            })
          );
        }

        // Destination cluster handling
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
        toast.success('The cluster is now enabled successfully');

        // Reset form and reload grid
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

        // Reload if on process-group route
        if (window.location.pathname.includes('/process-group')) {
          window.location.reload();
          history.push('/process-group');
        }
      } else {
        // If response is invalid or cluster_id is missing
        toast.error(response?.message || 'Error while getting data');
        console.warn('API did not return expected data:', response);
      }
    } catch (error) {
      console.error('Caught error:', error);

      // Extract meaningful error message
      const errorMessage =
        error?.response?.data?.message ===
        'The supplied username and password are not valid.'
          ? 'The entered username and password are incorrect.'
          : error?.response?.data?.message ||
            error.message ||
            'Something went wrong';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FullPageLoader loading={loading} />
      <Modal
        title="Login Cluster"
        isOpen={!isEmpty(clusterLoginWithoutCred)}
        onRequestClose={() =>
          dispatch(ClustersActions.setclusterToLoginWithoutCred({}))
        }
        size="sm"
        loading={loading}
        secondaryButtonText="Back"
        primaryButtonText={'Submit'}
        // primaryButtonDisabled={selectedCluster?.value == clusterId}
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
        primaryButtonProps={{ id: 'enable-cluster-submit-btn' }}
      >
        Do you want to connect to the cluster{' '}
        <strong>{clusterLoginWithoutCred?.label}</strong>?
      </Modal>
    </>
  );
};

ClusterLoginWithOutCredModal.propTypes = {
  cluster: PropTypes.string,
};
