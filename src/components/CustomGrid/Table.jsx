import React from 'react';
import PropTypes from 'prop-types';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import styled from 'styled-components';
import { LoaderContainer } from '../Loader';
import { isEmpty } from 'lodash';
import { theme } from '../../styles';
// import { useSort } from '@table-library/react-table-library/sort';

const TableContainer = styled.div`
  height: 73%;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${theme.colors.darkGrey};
`;
const NoDataText = styled.div`
  font-family: Noto Sans;
  font-size: 32px;
  font-weight: 600;
  line-height: 43.58px;
  text-align: center;
  background: #fff;
  color: #b9c3d3;
`;
export const Table = ({ data, columns }) => {
  const DATA = { nodes: data || [] };
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns:  ${columns
          .map(column => (column.width ? `${column.width}` : '1fr'))
          .join(' ')} !important;

        th, td {
          border-bottom: none !important;
        }

        th {
          height: 50px;
        }

        td {
          height: 58px;
        }
      `,
      HeaderRow: `
         background: #DDE4F0;
        ;
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
