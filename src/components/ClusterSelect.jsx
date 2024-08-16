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

export const ClusterSelect = ({ isDestination = false, ...props }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const tokens = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const tokenIds = tokens.map(item => item.id);
  const clusters = useSelector(ClustersSelectors.getClusters);
  const updatedClusters = clusters.map(item => ({
    ...item,
    is_active: tokenIds.includes(item.value),
  }));
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );

  const onChange = value => {
    if (value.is_active || location.pathname === '/login')
      if (!isDestination) dispatch(NamespacesActions.setSelectedCluster(value));
      else dispatch(NamespacesActions.setSelectedDestCluster(value));
    else dispatch(AuthenticationActions.setClusterLogin(value));
    if (props.onChange) props.onChange(value);
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  return (
    <SelectField
      options={updatedClusters}
      value={isDestination ? selectedDestCluster : selectedCluster}
      {...props}
      onChange={onChange}
    />
  );
};

ClusterSelect.propTypes = {
  isDestination: PropTypes.bool,
  onChange: PropTypes.func,
};
