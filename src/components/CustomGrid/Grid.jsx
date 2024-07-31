import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useSort } from '@table-library/react-table-library/sort';

import { theme } from '../../styles';
import { GridActions } from './GridActions';
import { fetchGridData, useGlobalContext } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import Pagination from './Pagination';
import Breadcrumb from '../../shared/Breadcrumb';
import ClusterDetail from '../../pages/Clusters/components/ClusterDetail';
import RegistryDetail from '../../pages/Clusters/components/RegistryDetail';
import { Modal } from '../../shared';
import { Table } from './Table';
import { TextRender } from './CellRenders';

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

const ClusterRegistryContainer = styled.div`
  display: flex;
  gap: 2%;
  margin-bottom: 1%;
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
  // const DATA = { nodes: loaders[module] ? [] : nodes || data };

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
  addModal = () => {},
  onBreadcrumbClick = () => {},
}) => {
  const {
    state: {
      search,
      page,
      gridData: {
        [module]: {
          count = 0,
          prev = null,
          next = null,
          data = [],

          // nodelist
          name: nodeName = '',
          nifi_url = '',
          registry = {},
          nodes = [],
          breadcrumb = [],
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
  const DATA = { nodes: getData(loaders[module], data, nodes) };

  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
        --data-table-library_grid-template-columns:  ${columns
          .map(column => (column.width ? column.width : '1fr'))
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
    DATA.nodes,
    {},
    {
      sortFns,
    }
  );

  const getLoader = () => {
    if (loaders[module]) return <Loader size="lg" />;
    if (isEmpty(DATA.nodes))
      return <LoaderContainer>No data found</LoaderContainer>;
    return null;
  };

  useEffect(() => {
    fetchGridData({
      setState,
      module,
      search: search,
      ...(nodeClusterId && { nodeClusterId }),
      ...(selectedSourceClusterId && { selectedSourceClusterId }),
    });
  }, [setState, module, search]);

  return (
    <Container>
      <GridActions
        title={title}
        module={module}
        clusterOptions={clusterOptions}
        refreshOptions={refreshOptions}
        statusOptions={statusOptions}
        search={search}
        buttonText={buttonText}
        addModal={addModal}
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
      {DATA.nodes.length > 10 && (
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
  buttonText: PropTypes.string,
  addModal: PropTypes.func,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onBreadcrumbClick: PropTypes.func,
};
