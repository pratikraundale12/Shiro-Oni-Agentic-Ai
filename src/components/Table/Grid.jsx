import React from 'react';
import PropTypes from 'prop-types';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useSort } from '@table-library/react-table-library/sort';
// import { useForm } from 'react-hook-form';
import { TableHeader } from './TableHeader/TableHeader';
import Pagination from './Pagination/Pagination';
import { useFetchData } from '../../utils';
import { theme } from '../../styles';

export const Grid = ({
  module,
  columns = [],
  sortFns = {},
  // options = [],
  // buttonText = 'add new user',
}) => {
  const {
    dataCount,
    data,
    // loading,
    // error,
    search,
    setSearch,
    setPage,
    page,
  } = useFetchData(module);

  const DATA = { nodes: data };

  // const { control } = useForm();

  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
      border-radius: 16px;
      border: 1px solid ${theme.colors.lightGrey};
      
      th, td {
        border-bottom: none !important;
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
      BaseCell: `
      padding: 16px;
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

  return (
    <>
      <div className="main-space bg-white">
        <TableHeader search={search} setSearch={setSearch} />
        <div className="table-area position-relative mb-3">
          <div className="main-table-div main-table-resposniveness-1">
            <CompactTable
              data={DATA}
              sort={sort}
              columns={columns}
              theme={tableTheme}
            />
          </div>
        </div>
      </div>
      <Pagination dataCount={dataCount} currentPage={page} setPage={setPage} />
    </>
  );
};

Grid.propTypes = {
  module: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  sortFns: PropTypes.shape({}),
  options: PropTypes.arrayOf(PropTypes.shape({})),
  buttonText: PropTypes.string,
};
