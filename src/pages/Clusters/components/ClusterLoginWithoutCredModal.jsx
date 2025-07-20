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
  const [loading, setLoading] = useState(false);
  const { handleSubmit, watch, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const clusterId = watch('cluster_id');
  const statusData = useSelector(SchedularSelectors.getStatusFilterData);

  const onSubmit = async () => {
    setLoading(true);
    const clusterData = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );

    const payload = {
      cluster_id: clusterLoginWithoutCred?.value,
    };
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
        dispatch(ClustersActions.setclusterToLoginWithoutCred({}));

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
        primaryButtonDisabled={selectedCluster?.value == clusterId}
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
