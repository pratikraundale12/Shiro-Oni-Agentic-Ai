import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { NoDataIcon } from '../../assets';
import { theme } from '../../styles';
import { Loader, LoaderContainer } from '../Loader';

const TableContainer = styled.div`
  height: 90%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid ${theme.colors.darkGrey};

  @media (max-width: 991px) {
    table {
      min-width: 800px;
    }
  }

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

export const Table = ({
  data,
  columns,
  loading,
  className,
  controllerModule = false,
}) => {
  const DATA = { nodes: data || [] };
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
      --data-table-library_grid-template-columns: ${columns
        .map(column => column.width || 'auto')
        .join(' ')} !important;
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

  const getLoader = controllerModule => {
    if (loading)
      return (
        <>
          <LoaderContainer>
            {!controllerModule && (
              <>
                <NoDataIcon width={130} />
                <NoDataText>No Data Found!!</NoDataText>
              </>
            )}

            <Loader />
          </LoaderContainer>
        </>
      );
    return null;
  };
  return (
    <TableContainer className={className}>
      <CompactTable data={DATA} columns={columns} theme={tableTheme} />
      {getLoader(controllerModule)}
    </TableContainer>
  );
};

Table.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  className: PropTypes.string,
  controllerModule: PropTypes.bool,
};
