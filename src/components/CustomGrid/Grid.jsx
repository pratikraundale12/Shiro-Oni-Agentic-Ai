import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useSort } from '@table-library/react-table-library/sort';

import { theme } from '../../styles';
import { GridActions } from './GridActions';
import { useFetchData } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import Pagination from './Pagination';

const Container = styled.div`
  background-color: ${theme.colors.white};
  height: inherit;
`;

const TableContainer = styled.div`
  height: 73%;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${theme.colors.darkGrey};
`;

export const Grid = ({
  module,
  columns = [],
  sortFns = {},
  clusterOptions = [],
  refreshOptions = [],
  statusOptions = [],
  title = '',
  buttonText = '',
  addModal = () => {},
}) => {
  const {
    response: { count, prev, next, data },
    page,
    setPage,
    search,
    setSearch,
    loading,
  } = useFetchData(module);
  const DATA = { nodes: loading ? [] : data };
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns:  ${columns
          .map(column => (column.width ? `${column.width}px` : '1fr'))
          .join(' ')} !important;

        th, td {
          border-bottom: none !important;
        }

        th {
          height: 50px;
          z-index:0 !important;
        }

        td {
          height: 58px;
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

  const sort = useSort(
    data,
    {},
    {
      sortFns,
    }
  );

  const getLoader = () => {
    if (loading) return <Loader size="lg" />;
    if (isEmpty(DATA.nodes))
      return <LoaderContainer>No data found</LoaderContainer>;
    return null;
  };

  return (
    <Container>
      <GridActions
        title={title}
        clusterOptions={clusterOptions}
        refreshOptions={refreshOptions}
        statusOptions={statusOptions}
        search={search}
        setSearch={setSearch}
        buttonText={buttonText}
        addModal={addModal}
      />
      {/* Breadcrumb */}
      <TableContainer>
        <CompactTable
          data={DATA}
          sort={sort}
          columns={columns}
          theme={tableTheme}
        />
        {getLoader()}
      </TableContainer>
      <Pagination
        page={page}
        setPage={setPage}
        count={count}
        prev={prev}
        next={next}
      />
    </Container>
  );
};

Grid.propTypes = {
  module: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  sortFns: PropTypes.shape({}),
  clusterOptions: PropTypes.arrayOf(PropTypes.shape({})),
  refreshOptions: PropTypes.arrayOf(PropTypes.shape({})),
  statusOptions: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  buttonText: PropTypes.string,
  addModal: PropTypes.func,
};
