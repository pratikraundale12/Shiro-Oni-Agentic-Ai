import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

import { LoaderContainer } from '../Loader';
import { theme } from '../../styles';
import { NoDataIcon } from '../../assets';

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
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

export const Table = ({ data, columns, loading, className }) => {
  const DATA = { nodes: data || [] };
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
        margin-bottom: 0;

        th, td {
          border-bottom: none !important;
        }
        th {
          height: 48px;
          background-color: ${theme.colors.lightGrey} !important;
          color:  ${theme.colors.darker} !important;
        }

        td {
          height: 60px;
        }

        tbody tr:nth-of-type(even) td {
          background-color: ${theme.colors.lightGrey} !important;          
        }
      `,
    },
  ]);

  const getLoader = () => {
    if (loading)
      return (
        <LoaderContainer>
          <NoDataIcon width={130} />
          <NoDataText>No Data Found!!</NoDataText>
        </LoaderContainer>
      );
    return null;
  };

  return (
    <TableContainer className={className}>
      <CompactTable data={DATA} columns={columns} theme={tableTheme} />
      {getLoader()}
    </TableContainer>
  );
};

Table.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  className: PropTypes.string,
};
