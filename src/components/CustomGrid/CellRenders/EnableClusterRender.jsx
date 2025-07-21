import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { LoginIcon, LogoutIcon } from '../../../assets';
import { CLUSTERS_TOKEN, CLUSTER_STATUS } from '../../../constants';
import {
  AuthenticationActions,
  ClustersActions,
  DashboardActions,
  GridActions,
  NamespacesActions,
} from '../../../store';
import { ClusterLoginModal } from '../../ClusterLoginModal';
import { IconButton } from './AtionRender';
import { isEmpty } from 'lodash';
import { SchedularSelectors } from '../../../store/schedular';

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
  const statusData = useSelector(SchedularSelectors.getStatusFilterData);

  const handleClusterAction = () => {
    if (item?.status === CLUSTER_STATUS.DISCONNECTED) {
      if (item?.is_certificate_based_service_account) {
        dispatch(
          ClustersActions.setclusterToLoginWithoutCred({
            label: item.name,
            value: item.id,
          })
        );
      } else {
        dispatch(
          AuthenticationActions.setClusterLogin({
            label: item.name,
            value: item.id,
          })
        );
        dispatch(ClustersActions.fetchClusters());
      }
    } else if (item?.status === CLUSTER_STATUS.CONNECTED) {
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
      dispatch(
        GridActions.fetchGridSuccess({ module: 'namespaces', data: {} })
      );
      dispatch(DashboardActions.fetchDashboardSuccess({ data: {} }));

      const clusterItem = localStorage.getItem('selected_cluster');
      const clustersToken = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
      const tokenToRemove =
        !isEmpty(clustersToken) &&
        clustersToken?.filter(token => token.id === item?.id);
      const payload = { id: item?.id, token: tokenToRemove?.[0]?.token };
      dispatch(ClustersActions.clusterLogout(payload));

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
      toast.success('The cluster is now disconnected successfully');
    }
  };

  return (
    <>
      <EnableClusterText
        onClick={
          item?.status === CLUSTER_STATUS.DEACTIVATED
            ? undefined
            : handleClusterAction
        }
      >
        <IconButton
          data-tooltip-id={`${item?.id}1`}
          disabled={item?.status === CLUSTER_STATUS.DEACTIVATED}
        >
          {item?.status === CLUSTER_STATUS.DISCONNECTED ||
          item?.status === CLUSTER_STATUS.DEACTIVATED ? (
            <LoginIcon />
          ) : (
            <LogoutIcon color="#a51e1e" />
          )}
        </IconButton>
      </EnableClusterText>
      {item?.status === CLUSTER_STATUS.DISCONNECTED && (
        <ClusterLoginModal cluster={item} />
      )}
      <ReactTooltip
        id={`${item?.id}1`}
        place="left"
        effect="solid"
        content={
          item?.status === CLUSTER_STATUS.DISCONNECTED
            ? 'Cluster login'
            : 'Cluster logout'
        }
        style={{
          width: '130px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      />
    </>
  );
};

EnableClusterRender.propTypes = {
  item: PropTypes.object.isRequired,
};
