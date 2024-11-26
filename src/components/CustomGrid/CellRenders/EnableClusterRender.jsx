import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { LoginIcon, LogoutIcon } from '../../../assets';
import { CLUSTERS_TOKEN, CLUSTER_STATUS } from '../../../constants';
import {
  AuthenticationActions,
  DashboardActions,
  GridActions,
  NamespacesActions,
} from '../../../store';
import { ClusterLoginModal } from '../../ClusterLoginModal';
import { IconButton } from './AtionRender';

const EnableClusterText = styled.div`
  display: block;
  color: #0cbf59;
  left: 0;
  bottom: 0;
  padding: 4px;
  z-index: 1;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  cursor: pointer;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

export const EnableClusterRender = ({ item }) => {
  const dispatch = useDispatch();

  const handleClusterAction = () => {
    if (item?.status === CLUSTER_STATUS.DISCONNECTED) {
      dispatch(
        AuthenticationActions.setClusterLogin({
          label: item.name,
          value: item.id,
        })
      );
    } else if (item?.status === CLUSTER_STATUS.CONNECTED) {
      dispatch(GridActions.fetchGrid({ module: 'clusters' }));
      dispatch(
        GridActions.fetchGridSuccess({ module: 'namespaces', data: {} })
      );
      dispatch(DashboardActions.fetchDashboardSuccess({ data: {} }));

      const clusterItem = localStorage.getItem('selected_cluster');
      const clustersToken = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));

      if (clusterItem) {
        const cluster = JSON.parse(clusterItem);
        if (cluster.value === item.id) {
          localStorage.removeItem('selected_cluster');
          dispatch(
            NamespacesActions.setSelectedCluster({
              label: '',
              value: '',
            })
          );
        }
      }

      // Remove the matching cluster from clustersToken
      const updatedClustersToken = clustersToken.filter(
        token => token.id !== item.id
      );
      localStorage.setItem(
        CLUSTERS_TOKEN,
        JSON.stringify(updatedClustersToken)
      );

      toast.success('Cluster Disconnected Successfully');
    }
  };

  return (
    <>
      <EnableClusterText onClick={handleClusterAction}>
        <IconButton
          title={
            item?.status === CLUSTER_STATUS.DISCONNECTED
              ? 'Login to Cluster'
              : 'Logout from Cluster'
          }
        >
          {item?.status === CLUSTER_STATUS.DISCONNECTED ? (
            <LoginIcon />
          ) : (
            <LogoutIcon />
          )}
        </IconButton>
      </EnableClusterText>
      {item?.status === CLUSTER_STATUS.DISCONNECTED && (
        <ClusterLoginModal cluster={item} />
      )}
    </>
  );
};

EnableClusterRender.propTypes = {
  item: PropTypes.object.isRequired,
};
