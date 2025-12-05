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
const RegistryDetail = ({ data, handleCert, showRegistryDownload }) => {
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
        <UrlRender
          tooltipId={'registry-url-tooltip'}
          key={item.registry_url}
          url={
            item?.registry_url?.includes('/nifi-registry')
              ? item.registry_url
              : `${item.registry_url}/nifi-registry`
          }
          tooltipPlacement="top"
          type="Registry"
          copy_btn_tooltip={'Copy Registry URL'}
          displayCert={!isEmpty(showRegistryDownload)}
          handleCert={handleCert}
          certTitle="Download Certificate"
        />
      ),
      width: '75%',
    },
  ];

  return (
    <Container className="col-6">
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
  handleCert: PropTypes.func.isRequired,
  showRegistryDownload: PropTypes.any,
};

export default RegistryDetail;
