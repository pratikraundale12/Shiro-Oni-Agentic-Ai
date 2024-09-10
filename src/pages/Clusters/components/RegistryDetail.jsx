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
const RegistryDetail = ({ data }) => {
  const REGISTRYCOLUMNS = [
    {
      label: KDFM.REGISTRY_NAME,
      renderCell: item => (
        <TextRender text={item.name} tooltipPlacement="right" />
      ),
      width: '25%',
    },
    {
      label: KDFM.REGISTRY_URL,
      renderCell: item => (
        <UrlRender key={item.registry_url} url={item.registry_url} />
      ),
      width: '75%',
    },
  ];

  return (
    <Container>
      <Table
        data={[data || {}]}
        columns={REGISTRYCOLUMNS}
        className={'customTable'}
      />
    </Container>
  );
};

RegistryDetail.propTypes = {
  data: PropTypes.object.isRequired,
};

export default RegistryDetail;
