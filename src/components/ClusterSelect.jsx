import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CLUSTERS_TOKEN } from '../constants';
import { SelectField } from '../shared';
import {
  AuthenticationActions,
  ClustersActions,
  ClustersSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../store';
import { SchedularSelectors } from '../store/schedular/redux';

export const ClusterSelect = ({ isDestination = false, ...props }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const tokens = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const tokenIds = tokens.map(item => item.id);
  const clusters = useSelector(ClustersSelectors.getClusters);
  const updatedClusters = clusters.map(item => ({
    ...item,
    is_active: tokenIds.includes(item.value),
    status: item.status,
  }));
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );
  const namespaceDirectSchedular = useSelector(
    SchedularSelectors.getScheduleFromList
  );

  const onChange = value => {
    if (value.is_active || location.pathname === '/login')
      if (!isDestination) {
        dispatch(NamespacesActions.setSelectedCluster(value));
      } else {
        dispatch(NamespacesActions.setSelectedDestCluster(value));
        if (props.onChange) props.onChange(value);
      }
    else {
      value.is_deploy = true;
      if (namespaceDirectSchedular) {
        dispatch(
          NamespacesActions.setSelectedDestCluster({
            label: value.label,
            value: value.value,
          })
        );
        dispatch(NamespacesActions.checkDestCluster()); // CALL CHECK API
      } else {
        dispatch(AuthenticationActions.setClusterLogin(value)); // OPEN THE POPUP
      }

      if (isDestination) dispatch(AuthenticationActions.setDestinationFlag());
    }
  };

  const getValue = () => {
    if (location.pathname === '/login') return;
    if (isDestination) return selectedDestCluster;
    else return selectedCluster;
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  const remainingCluster =
    location.pathname === '/login'
      ? updatedClusters.filter(cluster => cluster.status !== 'Deactivated')
      : updatedClusters?.filter(
          cluster =>
            cluster?.value !== selectedCluster?.value &&
            cluster.status !== 'Deactivated' // Exclude deactivated clusters
        );

  return (
    <SelectField
      options={remainingCluster}
      value={getValue()}
      {...props}
      onChange={onChange}
    />
  );
};

ClusterSelect.propTypes = {
  isDestination: PropTypes.bool,
  onChange: PropTypes.func,
};
