import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Table, TextRender, UrlRender } from '../../../components';
import { KDFM } from '../../../constants';

const Container = styled.div`
  .customTable {
    height: auto;
  }
`;
const ClusterDetail = ({ data, columns }) => {
  const CLUSTERCOLUMNS = [
    {
      label: KDFM.CLUSTER_NAME,
      renderCell: item => (
        <TextRender text={item.name} tooltipPlacement="right" />
      ),
      width: '25%',
    },
    {
      label: KDFM.CLUSTER_URL,
      renderCell: item => (
        <UrlRender
          key={item.nifi_url}
          url={
            item?.nifi_url?.includes('/nifi')
              ? item?.nifi_url
              : `${item.nifi_url}/nifi`
          }
          tooltipPlacement="top"
          type="Cluster"
        />
      ),
      width: '75%',
    },
  ];

  return (
    <Container className="col-6">
      <Table
        data={[data || {}]}
        columns={columns?.length > 0 ? columns : CLUSTERCOLUMNS}
        className={'customTable'}
      />
    </Container>
  );
};

ClusterDetail.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array,
};

export default ClusterDetail;
