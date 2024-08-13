import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { useSort } from '@table-library/react-table-library/sort';

import { theme } from '../../styles';
import { GridActions as GridActionsComponent } from './GridActions';
import { useGlobalContext } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import Pagination from './Pagination';
import Breadcrumb from '../../shared/Breadcrumb';
import ClusterDetail from '../../pages/Clusters/components/ClusterDetail';
import RegistryDetail from '../../pages/Clusters/components/RegistryDetail';
import { Modal } from '../../shared';
import { Table } from './Table';
import { TextRender } from './CellRenders';
import { NoDataIcon } from '../../assets';
import { GridActions, GridSelectors } from '../../store/grid';
import { fetchGridData } from '../../store/services';

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
}) => {
  const dispatch = useDispatch();
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, module)
  );
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
  const DATA = {
    nodes: getData(
      loaders[module],
      module === 'clusters' || module === 'users' || module === 'namespaces'
        ? gridData
        : data,
      nodes
    ),
  };

  const tableTheme = useTheme([
    getTheme(),
    {
      Table: `
      --data-table-library_grid-template-columns: ${columns
        .map(column => column.width)
        .join(' ')} !important;

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
    if (
      module === 'clusters' ||
      module === 'users' ||
      module === 'namespaces'
    ) {
      dispatch(GridActions.fetchGrid({ module, params: { page: 1, search } }));
    } else {
      fetchGridData({
        setState,
        module,
        search,
        page,
        ...(nodeClusterId && { nodeClusterId }),
        ...(selectedSourceClusterId && { selectedSourceClusterId }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setState, module, search, page]);
  return (
    <Container>
      <GridActionsComponent
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
      {count >= 10 && (
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
};
