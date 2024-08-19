import React from 'react';
import PropTypes from 'prop-types';

import { Table, TextRender } from '../../../components';

const ClusterDetail = ({ data }) => {
  const CLUSTERCOLUMNS = [
    {
      label: 'Cluster Name',
      renderCell: item => <TextRender text={item.name} />,
      width: '25%',
    },
    {
      label: 'Cluster URL',
      renderCell: item => <TextRender text={item.nifi_url} />,
      width: '75%',
    },
  ];

  return <Table data={[data || {}]} columns={CLUSTERCOLUMNS} />;
};

ClusterDetail.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ClusterDetail;
