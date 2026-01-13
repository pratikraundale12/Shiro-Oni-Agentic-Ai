/*eslint-disable*/
import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { default as React, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { NoDataIcon, QRIcons } from '../../assets';
import { KDFM } from '../../constants';
import ClusterDetail from '../../pages/Clusters/components/ClusterDetail';
import RegistryDetail from '../../pages/Clusters/components/RegistryDetail';
import { InputField, Modal } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
  NamespacesSelectors,
} from '../../store';
import { ActivityHistoryActions } from '../../store/activityHistory/redux';
import { GridActions, GridSelectors } from '../../store/grid';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { Loader, LoaderContainer } from '../Loader';
import { UrlRender } from './CellRenders';
import { GridActions as GridActionsComponent } from './GridActions';
import Pagination from './Pagination';
import { Table } from './Table';
import TreeViewWrapper from '../../pages/Namespaces/TreeViewWrapper';
import ClusterControlButtons from '../../pages/Clusters/ClusterControlButtons';
import KubeClusterPodsAndMetrics from '../../pages/Clusters/components/ClusterKubePodsAndMetrics';

const Container = styled.div`
  background-color: ${theme.colors.white};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TableContainer = styled.div`
  height: ${({ fullHeight }) => (fullHeight ? '100%' : 'auto')};
  max-height: 100%;
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
  margin-bottom: 10px;
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

const NodeEvent = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const EVENTCOLUMNS = [
  {
    label: 'Node Events',
    renderCell: item => {
      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleString();
      return <NodeEvent>{`${formattedDate} : ${item.message}`}</NodeEvent>;
    },
  },
];

const getData = (loader = false, data = [], nodes = []) => {
  if (loader) {
    return data || [];
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
  currentPage = 1,
  setCurrentPage = () => {},
  sortingState,
  setSortingState,
  createdByAnsible = false,
  is_kube_cluster = false,
  setDownloadModalOpen,
  isDownloadModalOpen,
  removeSearch,
  setIsExportReportOpen,
  selectEvent,
  setSelectEvent,
  selectEntity,
  setSelectEntity,
  selectStatus,
  setSelectStatus,
  setRemoveSearch,
  FlowAnalysisPage = false,
}) => {
  const dispatch = useDispatch();
  const { id: clusterId } = useParams();
  const ClusterActivated = localStorage.getItem('clusters');
  const parsedClusterActivated = ClusterActivated
    ? JSON.parse(ClusterActivated)
    : [];
  const isClusterLoggedIn =
    clusterId &&
    Array.isArray(parsedClusterActivated) &&
    parsedClusterActivated.some(ele => ele?.id === clusterId);

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
  const selectedNamespaceForDetail = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const selectedRange = useSelector(SchedularSelectors.getScheduleSelectRange);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const [selectedRole, setSelectedRole] = useState(null);
  const [clusterSelectedValue, setClusterSelectedValue] = useState(null);
  // const [selectEvent, setSelectEvent] = useState(null);
  // const [selectEntity, setSelectEntity] = useState(null);
  const registryNodesData = useSelector(ClustersSelectors.getRegistryNodesData);
  const [scheduleType, setScheduleType] = useState(null);
  const [viewMode, setViewMode] = useState('list_view'); // 'list_view' | 'tree_view'

  const activeTabClusterView = useSelector(ClustersSelectors.getclusterViewTab);
  const { watch, control, setValue } = useForm();
  const watchStatus = watch('is_active');

  useEffect(() => {
    if (watchStatus) {
      dispatch(SchedularActions.setStatusFilterData(watchStatus));
    }
  }, [watchStatus]);

  const {
    state: { search, page, eventModal, selectedNode },
    setState,
  } = useGlobalContext();

  useEffect(() => {
    if (search) {
      dispatch(SchedularActions.setSearchText(search));
    } else {
      dispatch(SchedularActions.setSearchText(null));
    }
  }, [search]);
  const filteredData = gridData.filter(item => item.isProcessor === false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const DATA = {
    nodes: isNamespace
      ? getData(loading, filteredData, clusterSummary.nodes).slice(
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
          .join(' ')};
        margin-bottom: 0;

        th, td {
          border-bottom: none !important;
          padding: 5px 0 5px 10px !important;
        }

        th {
          height: 52px;
          background-color: ${theme.colors.lightGrey} !important;
          color:  ${theme.colors.darker} !important;
          z-index:6
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
       tr td:last-child div {
          overflow: visible;
        }
      `,
    },
  ]);

  const messages = {
    namespaces: 'No Process Group Available',
    clusters: 'No Cluster Available',
    users: 'No User Available',
    activityHistory: 'No Activity History Available',
    scheduler: 'No Schedulers Available',
    nodes: isClusterLoggedIn
      ? 'No Nodes Available!'
      : 'No nodes available. Please log in to the cluster first.',
    registry: 'No Registry Available',
  };

  const getModuleBasedStatusKey = module => {
    if (module === 'activityHistory') {
      return 'status';
    } else if (module === 'scheduler') {
      return 'deployment_status';
    } else if (module === 'clusters') {
      return 'status';
    } else {
      return 'is_active';
    }
  };

  const getLoader = () => {
    if (loading || (gridCount > 0 && isEmpty(gridData)))
      return <Loader size="lg" />;
    if (isEmpty(DATA.nodes))
      return (
        <LoaderContainer>
          <NoDataIcon width={140} />
          <LoadingText>{messages[module]}</LoadingText>
        </LoaderContainer>
      );
    return null;
  };

  const getNamespacesListData = () => {
    if (
      module === 'nodes' &&
      !isClusterLoggedIn
      // ||
      // (module === 'nodes' && is_kube_cluster)
    ) {
      return;
    }
    if (module === 'namespaces' && selectedCluster?.value) {
      dispatch(
        GridActions.fetchGrid({
          module,
          clusterId,
          params: {
            page: currentPage,
            limit: itemsPerPage,
            ...(scheduleToken && { id: scheduleToken }),
            ...(search && { search }),
            ...(watchStatus &&
              watchStatus !== 'all' && {
                [getModuleBasedStatusKey(module)]: watchStatus,
              }),

            ...(selectedRange && {
              start_date: selectedRange?.[0]?.toISOString(),
              end_date: selectedRange?.[1]?.toISOString(),
            }),
            ...(location?.pathname?.includes('user-management') &&
              selectedRole?.value !== 'all' && {
                role_id: selectedRole?.value,
              }),
            ...(location?.pathname?.includes('schedule-deployment') &&
              clusterSelectedValue?.label !== 'All' && {
                clusterName: clusterSelectedValue?.label,
              }),
            ...(location?.pathname?.includes('schedule-deployment') &&
              scheduleType?.value !== 'all' && {
                type: scheduleType?.value,
              }),
            ...(location?.pathname?.includes('activity-history') &&
              selectEvent &&
              selectEvent.length > 0 && {
                event: selectEvent.map(event => event.value).join(','),
              }),

            ...(location?.pathname?.includes('activity-history') &&
              selectEntity &&
              selectEntity.length > 0 && {
                entity: selectEntity.map(entity => entity.value).join(','),
              }),

            ...(location?.pathname?.includes('activity-history') &&
              selectStatus &&
              selectStatus.length > 0 && {
                status: selectStatus.map(status => status.value).join(','),
              }),

            ...(location?.pathname?.match(
              /user-management|clusters|schedule-deployment|activity-history/
            ) &&
              sortingState && {
                sort: sortingState,
              }),
          },
        })
      );
    }
    dispatch(
      GridActions.fetchGrid({
        module,
        clusterId,
        params: {
          page: currentPage,
          limit: itemsPerPage,
          ...(scheduleToken && { id: scheduleToken }),
          ...(search && { search }),
          ...(watchStatus &&
            watchStatus !== 'all' && {
              [getModuleBasedStatusKey(module)]: watchStatus,
            }),

          ...(selectedRange && {
            start_date: selectedRange?.[0]?.toISOString(),
            end_date: selectedRange?.[1]?.toISOString(),
          }),
          ...(location?.pathname?.includes('user-management') &&
            selectedRole?.value !== 'all' && {
              role_id: selectedRole?.value,
            }),
          ...(location?.pathname?.includes('schedule-deployment') &&
            clusterSelectedValue?.label !== 'All' && {
              clusterName: clusterSelectedValue?.label,
            }),
          ...(location?.pathname?.includes('schedule-deployment') &&
            scheduleType?.value !== 'all' && {
              type: scheduleType?.value,
            }),
          ...(location?.pathname?.includes('activity-history') &&
            selectEvent &&
            selectEvent.length > 0 && {
              event: selectEvent.map(event => event.value).join(','),
            }),

          ...(location?.pathname?.includes('activity-history') &&
            selectEntity &&
            selectEntity.length > 0 && {
              entity: selectEntity.map(entity => entity.value).join(','),
            }),

          ...(location?.pathname?.includes('activity-history') &&
            selectStatus &&
            selectStatus.length > 0 && {
              status: selectStatus.map(status => status.value).join(','),
            }),

          ...(location?.pathname?.match(
            /user-management|clusters|schedule-deployment|activity-history/
          ) &&
            sortingState && {
              sort: sortingState,
            }),
        },
      })
    );
  };

  const scheduleToken = window.localStorage.getItem('scheduleTokenid');
  useEffect(() => {
    getNamespacesListData();
  }, [selectedNamespaceForDetail, selectedCluster]);

  useEffect(() => {
    if (isNamespace && currentPage > 0) {
      return;
    } else getNamespacesListData();
  }, [
    setState,
    module,
    clusterId,
    search,
    page,
    currentPage,
    selectedRole,
    sortingState,
    clusterSelectedValue,
    selectEvent,
    selectEntity,
    itemsPerPage,
    scheduleToken,
    selectStatus,
  ]);
  useEffect(() => {
    dispatch(ActivityHistoryActions.setSelectedEvent(null));
    dispatch(ActivityHistoryActions.setSelectedEntity(null));
  }, []);

  useEffect(() => {
    if (search || selectedCluster) {
      setCurrentPage(1);
    }
  }, [search, selectedCluster]);

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
  useEffect(() => {
    if (isEmpty(TABLE_DATA?.nodes) && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [TABLE_DATA]);

  const METRICS_URL_COLUMN = [
    {
      label: KDFM.METRICS_URL,
      renderCell: item => (
        <UrlRender
          tooltipId={`metrics-url-tootip`}
          url={item?.metrics_url}
          tooltipPlacement="top"
          copy_btn_tooltip={'Copy Metrics URL'}
        />
      ),
      width: '100%',
    },
  ];

  const LOGS_URL_COLUMN = [
    {
      label: KDFM.LOGS_URL,
      renderCell: item => (
        <UrlRender
          tooltipId={`logs-url-tooltip`}
          url={item?.logs_url}
          tooltipPlacement="top"
          copy_btn_tooltip={'Copy Logs URL'}
        />
      ),
      width: '100%',
    },
  ];

  const getRegistryNodesData = () => {
    return (
      <>
        <ClusterRegistryContainer className="row">
          {createdByAnsible && <ClusterControlButtons />}
          <ClusterDetail
            displayFullWidth
            data={{
              name: registryNodesData?.cluster?.name,
              nifi_url: registryNodesData?.cluster?.nifi_url,
            }}
            displayInFullWidth={isEmpty(
              registryNodesData?.cluster?.registry?.registry_url
            )}
          />
        </ClusterRegistryContainer>
        <ClusterRegistryContainer className="row">
          {registryNodesData?.cluster?.registry?.length > 0 &&
            is_kube_cluster && (
              <RegistryDetail
                displayFullWidth
                data={registryNodesData?.cluster?.registry}
                handleCert={
                  () => {}
                  // dispatch(ClustersActions.setIsDownloadRegistryCertOpen(true))
                }
                showRegistryDownload={
                  false &&
                  registryNodesData?.cluster?.registry?.[0]?.is_kube_registry &&
                  registryNodesData?.cluster?.registry?.[0]?.id &&
                  registryNodesData?.cluster?.registry?.[0]
                    ?.is_registry_authenticated
                }
              />
            )}
          {registryNodesData?.cluster?.registry?.length > 0 &&
            !is_kube_cluster && (
              <RegistryDetail
                displayFullWidth
                data={registryNodesData?.cluster?.registry}
                handleCert={() => {}}
                showRegistryDownload={false}
              />
            )}
        </ClusterRegistryContainer>
        <ClusterRegistryContainer className="row">
          {registryNodesData?.cluster?.metrics_url && (
            <ClusterDetail
              data={{
                metrics_url: registryNodesData?.cluster?.metrics_url,
              }}
              columns={METRICS_URL_COLUMN}
            />
          )}
          {registryNodesData?.cluster?.logs_url && (
            <ClusterDetail
              data={{
                logs_url: registryNodesData?.cluster?.logs_url,
              }}
              columns={LOGS_URL_COLUMN}
            />
          )}
        </ClusterRegistryContainer>
        {is_kube_cluster && <KubeClusterPodsAndMetrics />}
        <Modal
          title="Event Log"
          isOpen={eventModal}
          onRequestClose={() =>
            setState(prevState => ({ ...prevState, eventModal: false }))
          }
          size="md"
          primaryButtonText={KDFM.BACK}
          onSubmit={() =>
            setState(prevState => ({ ...prevState, eventModal: false }))
          }
          contentStyles={{ maxWidth: '45%', maxHeight: '65%' }}
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
    );
  };
  function tableDispaly(module, activeTabClusterView) {
    if (module === 'nodes') {
      return activeTabClusterView === 'node';
    }
    return true;
  }

  return (
    <Container>
      {!is_kube_cluster && (
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
          watchStatus={watchStatus}
          watch={watch}
          control={control}
          setSelectedRole={setSelectedRole}
          selectedRole={selectedRole}
          sortingState={sortingState}
          setValue={setValue}
          setClusterSelectedValue={setClusterSelectedValue}
          clusterSelectedValue={clusterSelectedValue}
          setSelectEvent={setSelectEvent}
          selectEvent={selectEvent}
          selectEntity={selectEntity}
          setSelectEntity={setSelectEntity}
          setSortingState={setSortingState}
          setSelectStatus={setSelectStatus}
          selectStatus={selectStatus}
          setCurrentPage={setCurrentPage}
          isClusterLoggedIn={isClusterLoggedIn}
          is_kube_cluster={is_kube_cluster}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          scheduleType={scheduleType}
          setScheduleType={setScheduleType}
          isDownloadModalOpen={isDownloadModalOpen}
          setDownloadModalOpen={setDownloadModalOpen}
          removeSearch={removeSearch}
          setIsExportReportOpen={setIsExportReportOpen}
          setRemoveSearch={setRemoveSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
          FlowAnalysisPage={FlowAnalysisPage}
        />
      )}
      {module === 'namespaces' && viewMode === 'tree_view' ? (
        <>
          <TreeViewWrapper
            hideRootNode={false}
            enableHoverApi={true}
            enableSearch={true}
            showPathInSuggestions={true}
          />
        </>
      ) : (
        <>
          {module === 'nodes' &&
            !loading &&
            !isEmpty(registryNodesData?.cluster?.name) && (
              <>{getRegistryNodesData()}</>
            )}
          <div className="mb-2 ps-1">
            <Breadcrumb module={module} />
          </div>
          {tableDispaly(module, activeTabClusterView) && (
            <TableContainer
              module={module}
              fullHeight={loading || isEmpty(TABLE_DATA?.nodes)}
            >
              {loading || isEmpty(TABLE_DATA?.nodes) ? (
                getLoader()
              ) : (
                <CompactTable
                  data={TABLE_DATA}
                  columns={columns}
                  theme={tableTheme}
                  layout={{ custom: true }}
                  // sort={sort}
                />
              )}
            </TableContainer>
          )}
          {gridCount >= 10 && (
            <Pagination
              page={currentPage}
              setCurrentPage={setCurrentPage}
              count={gridCount ?? 0}
              prev={prev}
              next={next}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </>
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
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
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
  sortingState: PropTypes.string,
  setSortingState: PropTypes.func,
  createdByAnsible: PropTypes.bool,
  is_kube_cluster: PropTypes.bool,
  scheduleType: PropTypes.string,
  setScheduleType: PropTypes.func,
  setDownloadModalOpen: PropTypes.func,
  isDownloadModalOpen: PropTypes.bool,
  removeSearch: PropTypes.bool,
  setIsExportReportOpen: PropTypes.func,
  selectEntity: PropTypes.string,
  setSelectEntity: PropTypes.func,
  selectStatus: PropTypes.string,
  setSelectStatus: PropTypes.func,
  selectEvent: PropTypes.string,
  setSelectEvent: PropTypes.func,
  setRemoveSearch: PropTypes.func,
  FlowAnalysisPage: PropTypes.bool,
};
