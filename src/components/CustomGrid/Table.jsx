import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { NoDataIcon } from '../../assets';
import { KDFM } from '../../constants';
import { theme } from '../../styles';
import { Loader, LoaderContainer } from '../Loader';
import Pagination from './Pagination';

const TableContainer = styled.div`
  /* height: 90%; */
  height: ${props =>
    props.deployTable ? 'calc(100vh - 475px)' : props?.csList ? '77%' : '83%'};
  /* height: calc(100vh - 475px); */
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

const PaginationContainer = styled.div`
  background: ${props => props.theme.colors.lightBackground};
  padding: 3px 10px 13px 10px;
  margin-top: 10px;
  border-radius: 7px;
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Ensure the loader is on top of the table */
`;

export const Table = ({
  data,
  columns,
  loading,
  className,
  deployTable = false,
  showPagination = false,
  csList = false,
  isResetNotRequired = false,
  customNoDataText = false,
}) => {
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const DATA = { nodes: data || [] };
  const [currentPage, setCurrentPage] = useState(1);

  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
      --data-table-library_grid-template-columns: ${columns
        .map(column => column.width || 'auto')
        .join(' ')};
        margin-bottom: 0;

        th, td {
          border-bottom: none !important;
        }
        th {
          height: 48px;
          background-color: ${theme.colors.lightGrey} !important;
          color:  ${theme.colors.darker} !important;
        }
        thead th.resize button[style='background: none;'] {
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
          width: 100%;
        }

        td {
          height: 58px;
        }

        tbody tr:nth-of-type(even) td {
          background-color: ${theme.colors.lightGrey} !important;
        }
      `,
    },
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = DATA.nodes.slice(indexOfFirstItem, indexOfLastItem);
  const [pageLoading, setPageLoading] = useState(false);

  const getLoader = () => {
    if (loading || pageLoading) {
      return (
        <LoaderOverlay>
          <Loader size="lg" />
        </LoaderOverlay>
      );
    }
    if (isEmpty(DATA.nodes)) {
      return (
        <LoaderContainer>
          <NoDataIcon width={140} />
          <NoDataText>
            {customNoDataText ? customNoDataText : KDFM.NO_DATA_FOUND}
          </NoDataText>
        </LoaderContainer>
      );
    }
    return null;
  };
  useEffect(() => {
    if (showPagination && isEmpty(currentItems)) {
      setCurrentPage(1);
    }
  }, [showPagination, currentItems]);

  const previousDataRef = useRef(data);
  useEffect(() => {
    if (
      previousDataRef.current?.length !== data?.length &&
      !isResetNotRequired
    ) {
      setCurrentPage(1);
    }
    previousDataRef.current = data;
  }, [data]);

  return (
    <>
      <TableContainer
        className={className}
        csList={csList}
        deployTable={deployTable}
      >
        {' '}
        {pageLoading || loading || isEmpty(DATA.nodes) ? (
          getLoader()
        ) : (
          <CompactTable
            data={{ nodes: showPagination ? currentItems : DATA.nodes }}
            columns={columns}
            theme={tableTheme}
            layout={{ custom: true }}
          />
        )}
      </TableContainer>
      {/* Pagination */}
      {DATA.nodes.length && DATA.nodes.length >= 10 && showPagination ? (
        <PaginationContainer>
          <Pagination
            page={currentPage}
            count={DATA.nodes.length}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setitemsPerPage}
            setPageLoading={setPageLoading}
          />
        </PaginationContainer>
      ) : (
        ''
      )}
    </>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  className: PropTypes.string,
  deployTable: PropTypes.bool,
  showPagination: PropTypes.bool,
  csList: PropTypes.bool,
  isResetNotRequired: PropTypes.bool,
  customNoDataText: PropTypes.string,
};
