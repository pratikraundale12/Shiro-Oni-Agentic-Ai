import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useSort } from '@table-library/react-table-library/sort';
import { useTheme } from '@table-library/react-table-library/theme';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { NoDataIcon } from '../../assets';
import ClusterDetail from '../../pages/Clusters/components/ClusterDetail';
import RegistryDetail from '../../pages/Clusters/components/RegistryDetail';
import { Modal } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import { fetchGridData } from '../../store';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import { TextRender } from './CellRenders';
import { GridActions } from './GridActions';
import Pagination from './Pagination';
import ReactPagination from './ReactPagnation';
import { Table } from './Table';

const Container = styled.div`
  background-color: ${theme.colors.white};
  height: inherit;
`;

const TableContainer = styled.div`
  height: 90%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid ${theme.colors.darkGrey};
  @media (min-width: 992px) {
    overflow-x: hidden;
  }
  @media (max-width: 991px) {
    table {
      min-width: 800px;
    }
  }
`;

const ClusterRegistryContainer = styled.div`
  display: flex;
  gap: 2%;
  margin-bottom: 1%;
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const EVENTCOLUMNS = [
  {
    label: 'Address',
    renderCell: item => <TextRender text={item.address} />,
  },
  {
    label: 'Node ID',
    renderCell: item => <TextRender text={item.nodeId} />,
  },
  {
    label: 'Node Events',
    renderCell: item => (
      <TextRender text={`${item.timestamp}: ${item.message}`} />
    ),
  },
];

const getData = (loader = false, data = [], nodes = []) => {
  if (loader) {
    return [];
  }
  if (!isEmpty(nodes)) {
    return nodes;
  }
  return data;
};

export const Grid = ({
  module,
  columns = [],
  sortFns = {},
  clusterOptions = [],
  refreshOptions = [],
  statusOptions = [],
  title = '',
  buttonText = '',
  placeholder = '',
  addModal = () => {},
  onBreadcrumbClick = () => {},
  handleRefresh = () => {},
  isNamespace = false,
  LIMIT,
  offset,
  setOffset,
}) => {
  const {
    state: {
      search,
      page,
      gridData: {
        [module]: {
          data = [],
          name: nodeName = '',
          nifi_url = '',
          registry = {},
          nodes = [],
          breadcrumb = [],
          count = 0,
          prev = null,
          next = null,
        } = {},
      },
      eventModal,
      selectedNode,
      nodeClusterId,
      selectedSourceClusterId = '',
      loaders,
    },
    setState,
  } = useGlobalContext();
  const DATA = {
    nodes: isNamespace
      ? getData(loaders[module], data, nodes).slice(offset, offset + LIMIT)
      : getData(loaders[module], data, nodes),
  };
  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
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

  const sort = useSort(
    DATA.nodes,
    {},
    {
      sortFns,
    }
  );

  const getLoader = () => {
    if (loaders[module]) return <Loader size="lg" />;
    if (isEmpty(DATA.nodes))
      return (
        <LoaderContainer>
          <NoDataIcon width={140} />
          <LoadingText>No Data Found!!</LoadingText>
        </LoaderContainer>
      );
    return null;
  };
  useEffect(() => {
    fetchGridData({
      setState,
      module,
      search,
      page,
      ...(nodeClusterId && { nodeClusterId }),
      ...(selectedSourceClusterId && { selectedSourceClusterId }),
    });
    if (isNamespace) {
      setOffset(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setState, module, search, page]);
  const handlePageChange = newOffset => {
    setOffset(newOffset);
    // Additional logic can be added here if needed
  };

  return (
    <Container>
      <GridActions
        title={title}
        module={module}
        clusterOptions={clusterOptions}
        refreshOptions={refreshOptions}
        statusOptions={statusOptions}
        search={search}
        placeholder={placeholder}
        buttonText={buttonText}
        addModal={addModal}
        handleRefresh={handleRefresh}
      />
      {module === 'nodeList' && !isEmpty(nodes) && (
        <>
          <ClusterRegistryContainer>
            <ClusterDetail data={{ name: nodeName, nifi_url }} />
            <RegistryDetail data={registry} />
          </ClusterRegistryContainer>
          <Modal
            title="Event Log"
            isOpen={eventModal}
            onRequestClose={() =>
              setState(prevState => ({ ...prevState, eventModal: false }))
            }
            size="lg"
            primaryButtonText="Continue"
            onSubmit={() =>
              setState(prevState => ({ ...prevState, eventModal: false }))
            }
          >
            <Table
              data={
                selectedNode?.events?.slice(0, 10).map(item => ({
                  address: selectedNode?.address,
                  nodeId: selectedNode?.nodeId,
                  ...item,
                })) || []
              }
              columns={EVENTCOLUMNS}
            />
          </Modal>
        </>
      )}
      <Breadcrumb
        breadcrumbs={breadcrumb}
        onBreadcrumbClick={onBreadcrumbClick}
      />
      <TableContainer>
        <CompactTable
          data={DATA}
          sort={sort}
          columns={columns}
          theme={tableTheme}
        />
        {getLoader()}
      </TableContainer>
      {isNamespace
        ? count >= LIMIT && (
            <ReactPagination
              offset={offset}
              onPageChange={handlePageChange}
              count={count}
              LIMIT={LIMIT}
            />
          )
        : count >= 10 && (
            <Pagination
              page={page}
              setState={setState}
              count={count}
              prev={prev}
              next={next}
            />
          )}
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
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  addModal: PropTypes.func,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onBreadcrumbClick: PropTypes.func,
  handleRefresh: PropTypes.func,
  LIMIT: PropTypes.number,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  isNamespace: PropTypes.bool,
};
