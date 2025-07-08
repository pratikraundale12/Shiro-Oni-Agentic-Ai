import React, { useState, useEffect } from 'react';
import { DownloadIcon, InfoIcon, TodoIcon } from '../../assets';
import styled from 'styled-components';
import { Table, TextRender } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActivityHistoryActions,
  ActivityHistorySelectors,
} from '../../store/activityHistory';
import { useForm } from 'react-hook-form';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
import {
  ACTIVITY_EVENTS,
  ACTIVITY_STATUS_OPTIONS,
  KDFM,
  MODULE_LIST_MAP,
} from '../../constants';
import Breadcrumb from '../../shared/Breadcrumb';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;
const SpanEle = styled.span`
  width: 100%;
  cursor: pointer;
  color: #ff7a00;
  &:hover {
    text-decoration: underline;
  }
`;

const DownloadHistory = () => {
  const [selectStatus, setSelectStatus] = useState([]);
  const [selectEvent, setSelectEvent] = useState([]);
  const [selectEntity, setSelectEntity] = useState([]);

  const { control } = useForm();

  const downLoadReport = useSelector(
    ActivityHistorySelectors.getDownloadReportData
  );

  // Handle filter changes
  const handleStatusChange = selectedOptions => {
    setSelectStatus(selectedOptions);
  };

  const handleEventChange = selectedOptions => {
    setSelectEvent(selectedOptions);
  };

  const handleEntityChange = selectedOptions => {
    setSelectEntity(selectedOptions);
  };

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

  const COLUMNS_ONE = [
    {
      label: 'Event',
      renderCell: item => <TextRender text={item?.event || KDFM.NA} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Entity',
      renderCell: item => <TextRender text={item?.entity || KDFM.NA} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => <TextRender text={item?.status || KDFM.NA} />,
      width: '20%',
      resize: true,
    },
    {
      label: 'Created By',
      renderCell: item => <TextRender text={item.user_name || KDFM.NA} />,
      width: '15%',
      resize: true,
    },
    {
      label: 'Created At',
      renderCell: item => convertDateTime(item?.created_at || 'N/A'),
      width: '20%',
      resize: true,
    },
    {
      label: '',
      renderCell: item =>
        item?.download_link ? (
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = item.download_link;
              link.download = ''; // Optional: provide filename here
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <DownloadIcon color="black" />
          </button>
        ) : (
          <>
            <span
              data-tooltip-id="download-tooltip"
              style={{ cursor: 'default' }}
            >
              <InfoIcon color="orange" />
            </span>
            <ReactTooltip
              id="download-tooltip"
              place="left"
              style={{
                width: 'auto',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
              content="The report is being prepared. A download link will be available soon, and a copy will also be sent to your registered email."
            />
          </>
        ),
      width: '5%',
      resize: true,
    },
  ];

  const dispatch = useDispatch();

  const path = [
    {
      label: 'Activity History',
      path: '/activity-history',
    },
    { label: 'Download Activity History' },
  ];

  useEffect(() => {
    dispatch(
      ActivityHistoryActions.fetchDownloadReport({
        queryParams: {
          status: selectStatus,
          event: selectEvent,
          entity: selectEntity,
        },
      })
    );
  }, [dispatch, selectStatus, selectEvent, selectEntity]);

  const handleClearFilter = () => {
    setSelectStatus([]);
    setSelectEvent([]);
    setSelectEntity([]);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <TodoIcon width={22} height={24} />
            <HeadingStyle>Download Activity History</HeadingStyle>
          </div>
        </div>
        {/* Filter Section */}
        <div className="mb-2 d-flex align-items-center">
          <div className="ml-2">
            <MultiSelectField
              name="activityStatus"
              control={control}
              label="Select Status"
              placeholder="Select Status"
              options={ACTIVITY_STATUS_OPTIONS}
              customValue={selectStatus}
              customOnChange={(onChange, selectedOptions) => {
                handleStatusChange(selectedOptions);
                onChange(selectedOptions);
              }}
              wrapperCustomClass="entity-dropdown"
              customWidth="275px"
              enableCheckboxes={true}
              hideMultipleOptions={true}
              enableSelectAll={true} // Enable select all
              selectAllLabel="Select All"
            />
          </div>
          <div className="ml-2">
            <MultiSelectField
              name="activityEvent"
              control={control}
              label="Select Event"
              placeholder="Select Event"
              options={ACTIVITY_EVENTS}
              customValue={selectEvent}
              customOnChange={(onChange, selectedOptions) => {
                handleEventChange(selectedOptions);
                onChange(selectedOptions);
              }}
              wrapperCustomClass="entity-dropdown"
              customWidth="275px"
              enableCheckboxes={true}
              hideMultipleOptions={true}
              enableSelectAll={true} // Enable select all
              selectAllLabel="Select All"
            />
          </div>
          <div className="ml-2">
            <MultiSelectField
              name="entityName"
              control={control}
              label="Select Entity"
              placeholder="Select Entity"
              options={MODULE_LIST_MAP}
              customValue={selectEntity}
              customOnChange={(onChange, selectedOptions) => {
                handleEntityChange(selectedOptions);
                onChange(selectedOptions);
              }}
              wrapperCustomClass="entity-dropdown"
              customWidth="275px"
              enableCheckboxes={true}
              hideMultipleOptions={true}
              enableSelectAll={true} // Enable select all
              selectAllLabel="Select All"
            />
          </div>
          <div className="ml-2">
            <SpanEle onClick={handleClearFilter}>{'Clear Filters'}</SpanEle>
          </div>
        </div>
      </div>
      <BreadcrumbContainer className="d-flex  mb-3 mt-3">
        <Breadcrumb module="path" path={path} />
      </BreadcrumbContainer>
      <div className="mt-3">
        <Table
          data={downLoadReport}
          columns={COLUMNS_ONE}
          className={'customTable'}
          showPagination={true}
        />
      </div>
    </div>
  );
};

export default DownloadHistory;
