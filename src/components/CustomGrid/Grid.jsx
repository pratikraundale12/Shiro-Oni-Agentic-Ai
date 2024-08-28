import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { default as React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Breadcrumb from '../../shared/Breadcrumb';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import { GridActions as GridActionsComponent } from './GridActions';
import Pagination from './Pagination';

import { NoDataIcon } from '../../assets';
import ClusterDetail from '../../pages/Clusters/components/ClusterDetail';
import RegistryDetail from '../../pages/Clusters/components/RegistryDetail';
import { Modal } from '../../shared';
import { LoadingSelectors, NamespacesSelectors } from '../../store';
import { GridActions, GridSelectors } from '../../store/grid';
// import ReactPagination from './ReactPagnation';
import { useSort } from '@table-library/react-table-library/sort';
import { useParams } from 'react-router-dom';
import { KDFM } from '../../constants';
import { TextRender } from './CellRenders';
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
  @media (max-width: 991px) {
    table {
      min-width: 800px;
    }
  }
  table {
    overflow: visible;
  }
`;

const ClusterRegistryContainer = styled.div`
  display: flex;
  gap: 2%;
  margin-bottom: 1%;

  > div {
    width: calc(75% - ${props => props.theme.sidebar});
  }
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
  refreshOptions = [],
  statusOptions = [],
  title = '',
  buttonText = '',
  placeholder = '',
  addModal = () => {},
  isNamespace = false,
  // LIMIT,
  // offset,
  // setOffset,
  sortFns = () => {},
  state,
}) => {
  const dispatch = useDispatch();
  const { id: clusterId } = useParams();
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchGrid')
  );
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, module)
  );
  const clusterSummary = useSelector(state =>
    GridSelectors.getGridNodes(state, module)
  );

  const gridCount = useSelector(state =>
    GridSelectors.getGridCount(state, module)
  );
  const prev = useSelector(state => GridSelectors.getGridPrev(state, module));
  const next = useSelector(state => GridSelectors.getGridNext(state, module));
  const selectedNamespace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const {
    state: {
      search,
      page,
      eventModal,
      selectedNode,
      // nodeClusterId,
      // selectedSourceClusterId = '',
      // loaders,
    },
    setState,
  } = useGlobalContext();

  const DATA = {
    nodes: isNamespace
      ? getData(loading, gridData, clusterSummary.nodes).slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : getData(loading, gridData, clusterSummary.nodes),
  };

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
          padding: 25px !important;
        }

        td{
        max-width: 700px;
        }
        th {
          height: 52px;
          background-color: ${theme.colors.lightGrey} !important;
          color:  ${theme.colors.darker} !important;
        }

        td {
          height: 65px;
        }

        tbody tr:nth-of-type(even) td {
          background-color: ${theme.colors.lightGrey} !important;          
        }
       tr td:last-child div {
          overflow: visible;
        }
      `,
    },
  ]);

  const sort = useSort(
    DATA,
    {
      state,
    },
    {
      sortFns,
    }
  );

  const getLoader = () => {
    if (loading) return <Loader size="lg" />;
    if (isEmpty(DATA.nodes))
      return (
        <LoaderContainer>
          <NoDataIcon width={140} />
          <LoadingText>{KDFM.NO_DATA_FOUND}</LoadingText>
        </LoaderContainer>
      );
    return null;
  };

  useEffect(() => {
    if (isNamespace && currentPage > 1) {
      return;
    } else {
      dispatch(
        GridActions.fetchGrid({
          module,
          clusterId,
          params: { page: currentPage, ...(search && { search }) },
        })
      );
    }
  }, [
    setState,
    module,
    clusterId,
    search,
    page,
    selectedNamespace,
    selectedCluster,
    currentPage,
  ]);

  useEffect(
    () => () => setState(prev => ({ ...prev, search: '', page: 1 })),
    [setState]
  );

  return (
    <Container>
      <GridActionsComponent
        title={title}
        module={module}
        refreshOptions={refreshOptions}
        statusOptions={statusOptions}
        search={search}
        placeholder={placeholder}
        buttonText={buttonText}
        addModal={addModal}
      />
      {module === 'nodes' && !loading && !isEmpty(clusterSummary) && (
        <>
          <ClusterRegistryContainer>
            <ClusterDetail
              data={{
                name: clusterSummary.name,
                nifi_url: clusterSummary.nifi_url,
              }}
            />
            <RegistryDetail data={clusterSummary.registry} />
          </ClusterRegistryContainer>
          <Modal
            title="Event Log"
            isOpen={eventModal}
            onRequestClose={() =>
              setState(prevState => ({ ...prevState, eventModal: false }))
            }
            size="lg"
            primaryButtonText={KDFM.CONTINUE}
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
      <Breadcrumb module={module} />
      <TableContainer>
        <CompactTable
          data={DATA}
          columns={columns}
          theme={tableTheme}
          sort={sort}
        />
        {getLoader()}
      </TableContainer>
      {gridCount > itemsPerPage && (
        <Pagination
          page={currentPage}
          setCurrentPage={setCurrentPage}
          count={gridCount ?? 0}
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
  LIMIT: PropTypes.number,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  isNamespace: PropTypes.bool,
  state: PropTypes.object.isRequired,
  // sortFns: PropTypes.func,
};
