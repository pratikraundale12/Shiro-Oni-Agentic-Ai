import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useSort } from '@table-library/react-table-library/sort';

import { theme } from '../../styles';
import { useFetchData } from '../../utils';
import { Button, Dropdown } from '../../shared';
import { Loader, LoaderContainer } from '../Loader';
import {
  GreaterArrowIcon,
  LessArrowIcon,
  PlusCircleIcon,
  SmallSearchIcon,
  TodoIcon,
} from '../../assets';

const Container = styled.div`
  background-color: ${theme.colors.white};
  height: inherit;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  margin-left: 10px;
`;

const SearchContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
`;

const TableContainer = styled.div`
  height: 73%;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid ${theme.colors.darkGrey};
`;

const ButtonContainer = styled(Flex)`
  margin-top: 10px;
`;

export const Grid = ({
  module,
  columns = [],
  sortFns = {},
  options = [],
  title = '',
  buttonText = 'add',
}) => {
  const navigate = useNavigate();
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

  const getPageRange = () => {
    const start = (page - 1) * 10 + 1;
    const end = Math.min(count, page * 10);
    return `${start} - ${end}`;
  };

  const getLoader = () => {
    if (loading) return <Loader />;
    if (isEmpty(DATA.nodes))
      return <LoaderContainer>No data found</LoaderContainer>;
    return null;
  };

  return (
    <Container>
      <Flex>
        <Flex>
          <TodoIcon width={28} height={28} />
          <Title>{title}</Title>
        </Flex>
        <Flex>
          <Dropdown placeholder="Refresh" options={options} />
          <Dropdown placeholder="Status" options={options} />
          {buttonText && (
            <Button
              icon={<PlusCircleIcon width={20} height={20} color="white" />}
              onClick={() => navigate('add')}
            >
              {buttonText}
            </Button>
          )}
        </Flex>
      </Flex>
      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          value={search}
          placeholder="Search User Name, Email, Status"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchContainer>

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

      <ButtonContainer>
        <span>{`${getPageRange()} of ${count} List`}</span>
        <Flex>
          <Button
            size="sm"
            onClick={() => setPage(prev)}
            icon={<GreaterArrowIcon color={theme.colors.white} />}
          />
          <Button size="sm" variant="secondary">
            1
          </Button>
          <Button size="sm" variant="secondary">
            2
          </Button>
          <Button size="sm" variant="secondary">
            ...
          </Button>
          <Button size="sm" variant="secondary">
            9
          </Button>
          <Button size="sm" variant="secondary">
            10
          </Button>
          <Button
            size="sm"
            onClick={() => setPage(next)}
            icon={<LessArrowIcon color={theme.colors.white} />}
          />
        </Flex>
      </ButtonContainer>
    </Container>
  );
};

Grid.propTypes = {
  module: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  sortFns: PropTypes.shape({}),
  options: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  buttonText: PropTypes.string,
};
