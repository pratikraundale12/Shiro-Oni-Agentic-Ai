import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SelectField } from '../shared';
import {
  ClustersActions,
  ClustersSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../store';

export const ClusterSelect = ({ ...props }) => {
  const dispatch = useDispatch();
  const clusters = useSelector(ClustersSelectors.getClusters);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const onChange = value => {
    dispatch(NamespacesActions.setSelectedCluster(value));
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  return (
    <SelectField
      options={clusters}
      onChange={onChange}
      defaultValue={selectedCluster}
      {...props}
    />
  );
};
