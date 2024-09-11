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
const ClusterDetail = ({ data }) => {
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
      renderCell: item => <UrlRender key={item.nifi_url} url={item.nifi_url} />,
      width: '75%',
    },
  ];

  return (
    <Container>
      <Table
        data={[data || {}]}
        columns={CLUSTERCOLUMNS}
        className={'customTable'}
      />
    </Container>
  );
};

ClusterDetail.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ClusterDetail;
