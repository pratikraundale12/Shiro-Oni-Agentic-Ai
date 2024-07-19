import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useSort } from '@table-library/react-table-library/sort';

import { theme } from '../styles';
import { useFetchData } from '../utils';
import { Button, SelectField } from '../shared';
import { PlusIcon } from '../assets';

const Container = styled.div`
  background-color: ${theme.colors.white};
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Select = styled(SelectField)`
  margin-bottom: 0;
  margin-right: 1rem;
`;

export const Grid = ({
  module,
  columns = [],
  sortFns = {},
  options = [],
  buttonText = 'add',
}) => {
  const navigate = useNavigate();
  const { data, search, setSearch } = useFetchData(module);
  const DATA = { nodes: data };
  const { control } = useForm();
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
    <Container>
      <h3>User List</h3>
      <Flex>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Flex>
          <Select
            name="sort"
            control={control}
            placeholder="Sort by"
            options={options}
            size="sm"
          />
          {buttonText && (
            <Button
              size="sm"
              icon={<PlusIcon width={14} height={14} />}
              onClick={() => navigate('add')}
            >
              {buttonText}
            </Button>
          )}
        </Flex>
      </Flex>

      <CompactTable
        data={DATA}
        sort={sort}
        columns={columns}
        theme={tableTheme}
      />
    </Container>
  );
};

Grid.propTypes = {
  module: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  sortFns: PropTypes.shape({}),
  options: PropTypes.arrayOf(PropTypes.shape({})),
  buttonText: PropTypes.string,
};
