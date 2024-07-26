import React from 'react';
import PropTypes from 'prop-types';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
// import { useSort } from '@table-library/react-table-library/sort';

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

  return <CompactTable data={DATA} columns={columns} theme={tableTheme} />;
};

Table.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
};
