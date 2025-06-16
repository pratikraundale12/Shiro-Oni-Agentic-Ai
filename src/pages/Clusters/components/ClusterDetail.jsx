import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Table, TextRender, UrlRender } from '../../../components';
import { KDFM } from '../../../constants';
import { isEmpty } from 'lodash';

const Container = styled.div`
  .customTable {
    height: auto;
  }
`;
const ClusterDetail = ({ data, columns, displayInFullWidth }) => {
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
          tooltipId={'cluster-url-tooltip'}
          key={item.nifi_url}
          url={
            item?.nifi_url?.includes('/nifi')
              ? item?.nifi_url
              : `${item.nifi_url}/nifi`
          }
          tooltipPlacement="top"
          type="Cluster"
          copy_btn_tooltip={'Copy Cluster URL'}
        />
      ),
      width: '75%',
    },
  ];

  return (
    <Container className={displayInFullWidth ? 'col-12' : 'col-6'}>
      <Table
        data={[data || {}]}
        columns={!isEmpty(columns) ? columns : CLUSTERCOLUMNS}
        className={'customTable'}
      />
    </Container>
  );
};

ClusterDetail.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array,
  displayInFullWidth: PropTypes.bool,
};

export default ClusterDetail;
