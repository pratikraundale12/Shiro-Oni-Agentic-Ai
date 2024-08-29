import PropTypes from 'prop-types';
import React from 'react';

import { Table, TextRender, UrlRender } from '../../../components';
import { KDFM } from '../../../constants';

const ClusterDetail = ({ data }) => {
  const CLUSTERCOLUMNS = [
    {
      label: KDFM.CLUSTER_NAME,
      renderCell: item => (
        <TextRender text={item.name} tooltipPlacement="right" />
      ),
      width: '10%',
    },
    {
      label: KDFM.CLUSTER_URL,
      renderCell: item => <UrlRender url={item.nifi_url} />,
      width: '75%',
    },
  ];

  return <Table data={[data || {}]} columns={CLUSTERCOLUMNS} />;
};

ClusterDetail.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ClusterDetail;
