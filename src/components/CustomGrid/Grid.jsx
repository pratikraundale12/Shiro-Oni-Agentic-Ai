import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { default as React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  NoDataIcon,
  QRIcons,
  SortDownIcon,
  SortIcon,
  SortUpIcon,
} from '../../assets';
import ClusterDetail from '../../pages/Clusters/components/ClusterDetail';
import RegistryDetail from '../../pages/Clusters/components/RegistryDetail';
import { InputField, Modal } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import { LoadingSelectors, NamespacesSelectors } from '../../store';
import { GridActions, GridSelectors } from '../../store/grid';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import { GridActions as GridActionsComponent } from './GridActions';
import Pagination from './Pagination';
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
    flex: 1;
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

const FLexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media screen and (min-width: 1024px) {
    flex-direction: row;
  }
`;

const EVENTCOLUMNS = [
  {
    label: 'Node Events',
    renderCell: item => (
      <TextRender
        text={`${item.timestamp}: ${item.message}`}
        tooltipPlacement="bottom-start"
      />
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

        th {
          height: 52px;
          background-color: ${theme.colors.lightGrey} !important;
          color:  ${theme.colors.darker} !important;
        }

        td {
          height: 73px;
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
      sortIcon: {
        iconDefault: <SortIcon />,
        iconUp: <SortUpIcon />,
        iconDown: <SortDownIcon />,
      },
    }
  );

  const messages = {
    namespaces: 'No Namespaces Available',
    clusters: 'No Cluster Available',
    users: 'No User Available',
    activityHistory: 'No Activity History Available',
    scheduler: 'No Schedulers Available',
  };

  const getLoader = () => {
    if (loading) return <Loader size="lg" />;
    if (isEmpty(DATA.nodes))
      return (
        <LoaderContainer>
          <NoDataIcon width={140} />
          <LoadingText>{messages[module]}</LoadingText>
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
  const filterClusterView = data => {
    if (!data) return;
    const { nodes } = data;
    const filtered = nodes?.filter(
      item =>
        item?.nodeId?.includes(search) ||
        item?.address?.includes(search.toLowerCase())
    );
    return {
      nodes: filtered,
    };
  };
  const TABLE_DATA = !clusterId
    ? DATA
    : search
      ? filterClusterView(DATA)
      : DATA;
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
        gridCount={gridCount}
        addModal={addModal}
        clusterId={clusterId}
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
            <FLexWrapper>
              <InputField
                label="Address"
                disabled={true}
                icon={<QRIcons />}
                value={selectedNode?.address}
              />
              <InputField
                label="Node ID"
                disabled={true}
                icon={<QRIcons />}
                value={selectedNode?.nodeId}
              />
            </FLexWrapper>
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
          data={TABLE_DATA}
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
