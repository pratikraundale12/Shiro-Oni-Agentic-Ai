import React from 'react';
import PropTypes from 'prop-types';

import { Table, TextRender } from '../../../components';

const RegistryDetail = ({ data }) => {
  const REGISTRYCOLUMNS = [
    {
      label: 'Registry Name',
      renderCell: item => <TextRender text={item.name} />,
      width: '25%',
    },
    {
      label: 'Registry URL',
      renderCell: item => <TextRender text={item.registry_url} />,
      width: '75%',
    },
  ];

  return <Table data={[data || {}]} columns={REGISTRYCOLUMNS} />;
};

RegistryDetail.propTypes = {
  data: PropTypes.object.isRequired,
};

export default RegistryDetail;
