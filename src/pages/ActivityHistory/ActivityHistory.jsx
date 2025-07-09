/*eslint-disable*/
import React, { useState } from 'react';
import { FileDownloadIcon, OpenEyeIcon, SortDownIcon, SortUpIcon } from '../../assets';
import { Grid, IconButton, StatusRender, Table, TextRender } from '../../components';
import { ACTIVITY_STATUS_OPTIONS, KDFM } from '../../constants';
import styled from 'styled-components';
import { theme } from '../../styles';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ActivityHistoryActions, ActivityHistorySelectors } from '../../store/activityHistory';
import { useDispatch, useSelector } from 'react-redux';
import { InfoModalActivityHistory } from './InfoModal';
import { StatusText } from '../ScheduleDeployment/StatusText';
import { Modal, ModalWithIcon } from '../../shared';
import { useGlobalContext } from '../../utils';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
`;

export const ActvityHistory = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('');  
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [selectEvent, setSelectEvent] = useState([]);
  const [selectEntity, setSelectEntity] = useState([]);
  const [selectStatus, setSelectStatus] = useState([]);

  const {
      state: { search },
      setState,
    } = useGlobalContext();
    
  const toggleSorting = column => {
    setSortingState(prevState =>
      prevState === column ? `-${column}` : column
    );
  };
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    row: {},
  });

  const convertDateTime = dateString => {
    if (!dateString) return 'No date provided';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getSortIcon = (sortingState, type) => {
    return sortingState === type ? <SortUpIcon /> : <SortDownIcon />;
  };
  const getActionsMenu = item => {
    return (
      <ActionTd>
        <div className="position-relative">
          <IconButton
            onClick={event => {
              dispatch(ActivityHistoryActions.setSelectedItem(item));
              dispatch(ActivityHistoryActions.setIsInfoModalOpen(true));
              event.currentTarget.blur();
            }}
            data-tooltip-id={`${`tooltip-group-info-icon`}`}
          >
            <OpenEyeIcon width={16} height={16} />
          </IconButton>
          <ReactTooltip
            id={`tooltip-group-info-icon`}
            place="left"
            content={'View More Details'}
            style={{
              width: '150px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </div>
      </ActionTd>
    );
  };

  const COLUMNS = [
    {
      label: (
        <button
          onClick={() => toggleSorting('event')}
          style={{ background: 'none' }}
        >
          {KDFM.EVENT}
          {getSortIcon(sortingState, 'event')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('entity')}
          style={{ background: 'none' }}
        >
          {KDFM.ENTITY}
          {getSortIcon(sortingState, 'entity')}
        </button>
      ),
      width: '12%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={
            item?.entity === 'Ldap'
              ? item?.entity?.toUpperCase()
              : item?.entity || KDFM.NA
          }
        />
      ),
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('namespace')}
          style={{ background: 'none' }}
        >
          {KDFM.NAMESPACE}
          {getSortIcon(sortingState, 'namespace')}
        </button>
      ),
      width: '11%',
      resize: true,
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
      sort: { sortKey: 'namespace' },
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('flow_name')}
          style={{ background: 'none' }}
        >
          {KDFM.FLOW_NAME} {getSortIcon(sortingState, 'flow_name')}
        </button>
      ),
      width: '13%',
      resize: true,
      renderCell: item => <TextRender text={item.flow_name || KDFM.NA} />,
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('cluster')}
          style={{ background: 'none' }}
        >
          {KDFM.CLUSTER} {getSortIcon(sortingState, 'cluster')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
      sort: { sortKey: 'cluster' },
    },
    {
      label: KDFM.VERSION,
      width: '8%',
      resize: true,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('status')}
          style={{ background: 'none' }}
        >
          {KDFM.STATUS} {getSortIcon(sortingState, 'status')}
        </button>
      ),
      width: '8%',
      resize: true,
      renderCell: item => (
        <StatusText text={item?.status?.replace(/_/g, ' ')} item={item} />
      ),
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('timestamp')}
          style={{ background: 'none' }}
        >
          {KDFM.TIMESTAMP} {getSortIcon(sortingState, 'timestamp')}
        </button>
      ),
      width: '14%',
      resize: true,
      renderCell: item => (
        <TextRender text={convertDateTime(item.timestamp) || KDFM.NA} />
      ),
      sort: { sortKey: 'timestamp' },
    },
    {
      label: (
        <button
          onClick={() => toggleSorting('created_by_name')}
          style={{ background: 'none' }}
        >
          {KDFM.CREATED_BY} {getSortIcon(sortingState, 'created_by_name')}
        </button>
      ),
      width: '10%',
      resize: true,
      renderCell: item => (
        <TextRender
          text={item.created_by_name || KDFM.NA}
          withEllipses={true}
        />
      ),
    },
    {
      renderCell: item => getActionsMenu(item),
      resize: true,
      width: '4%',
    },
  ];



  const sortFns = {
    namespace: data =>
      data.sort((a, b) =>
        (a?.namespace || '').localeCompare(b?.namespace || '')
      ),
    cluster: data =>
      data.sort((a, b) => (a?.cluster || '').localeCompare(b?.cluster || '')),
    timestamp: data =>
      data.sort(
        (a, b) => new Date(a?.timestamp || 0) - new Date(b?.timestamp || 0)
      ),
  };
  
const handleExportReport= () =>{
  dispatch(
     ActivityHistoryActions.fetchEmailReport({
       queryParams: {
       status: selectStatus.map(status => status.value).join(','),
       event: selectEvent.map(event => event.value).join(','),
       entity: selectEntity.map(entity => entity.value).join(','),
       search: search,
      },
    })
 );
 setIsExportReportOpen(false);
}

  return (
    <>
      <InfoModalActivityHistory />
      <Grid
        module="activityHistory"
        title={KDFM.ACTIVITY_LIST}
        columns={COLUMNS}
        placeholder={KDFM.ACTIVITY_HISTORY_SEARCH_PLACEHOLDER}
        sortFns={sortFns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
        setIsExportReportOpen={setIsExportReportOpen}
        selectEvent={selectEvent}
        setSelectEvent={setSelectEvent}
        selectEntity={selectEntity}
        setSelectEntity={setSelectEntity}
        selectStatus={selectStatus}
        setSelectStatus={setSelectStatus}
      />
       <ModalWithIcon
          title="Export Report"
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          icon={<FileDownloadIcon height={125} width={125} color="#444445" />}
          primaryText="Do you want to export activity history records?"
          secondaryText="If the activity history contains fewer than 20,000 records, the CSV will download immediately, for larger datasets, a download link will be sent to your email."
          isOpen={isExportReportOpen}
          onSubmit={handleExportReport}
          onRequestClose={() => setIsExportReportOpen(false)}
          contentStyles={{ maxWidth: '45%', maxHeight: '80%' }}
        />
    </>
  );
};
