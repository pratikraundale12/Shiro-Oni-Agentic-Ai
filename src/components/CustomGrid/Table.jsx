import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

import { LoaderContainer } from '../Loader';
import { theme } from '../../styles';

const TableContainer = styled.div`
  height: 90%;
  overflow: auto;
  border-radius: 16px;
  border: 1px solid ${theme.colors.darkGrey};

  table {
    overflow: visible;
  }
`;

const NoDataText = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-size: 32px;
  font-weight: 600;
  line-height: 43.58px;
  text-align: center;
  background: ${props => props.theme.colors.white};
  color: #b9c3d3;
`;

export const Table = ({ data, columns }) => {
  const DATA = { nodes: data || [] };
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
        th, td {
          border-bottom: none !important;
        }

        th {
          height: 48px;
        }

        td {
          height: 60px;
        }
      `,
      HeaderRow: `
        background-color: #F5F7FA;
        color: #444445;
      `,
      Row: `
        &:nth-of-type(even) {
          background-color: #F5F7FA;
        }
      `,
    },
  ]);

  const getLoader = () => {
    if (isEmpty(DATA?.nodes))
      return (
        <LoaderContainer>
          <NoDataText> No data found</NoDataText>
        </LoaderContainer>
      );
    return null;
  };

  return (
    <TableContainer>
      <CompactTable data={DATA} columns={columns} theme={tableTheme} />
      {getLoader()}
    </TableContainer>
  );
};

Table.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
};
